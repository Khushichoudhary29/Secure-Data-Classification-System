from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
import io
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.services.file_service import (
    get_file_by_id,
    get_decrypted_file,
    check_access,
    save_encrypted_file
)

from app.core.auth import get_current_user
from app.models.file_model import File as FileModel

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        metadata = await save_encrypted_file(file)
        # Log upload to the audit chain
        from app.services.audit_service import log_event
        log_event(db, user.email, f"Uploaded file: {file.filename} (Classification: {metadata['classification']})")
        return metadata
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("")
def list_files(db: Session = Depends(get_db), user=Depends(get_current_user)):
    all_files = db.query(FileModel).all()
    # Filter files based on user access role
    accessible_files = []
    for file in all_files:
        if check_access(user.role.name, file.classification):
            accessible_files.append({
                "id": file.id,
                "original_filename": file.original_filename,
                "classification": file.classification,
                "encrypted_dek": file.encrypted_dek,
                "dek_iv": file.dek_iv,
                "classification_method": "Naive Bayes ML Model"
            })
    return accessible_files


@router.get("/download/{file_id}")
def download_file(file_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):

    file = get_file_by_id(file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if not check_access(user.role.name, file.classification):
        raise HTTPException(status_code=403, detail="Access Denied")

    file_data = get_decrypted_file(
        file.stored_filename,
        file.iv,
        file.encrypted_dek,
        file.dek_iv
    )

    # Log successful download to the audit chain
    from app.services.audit_service import log_event
    log_event(db, user.email, f"Downloaded file: {file.original_filename}")

    return StreamingResponse(
        io.BytesIO(file_data),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={file.original_filename}"
        }
    )