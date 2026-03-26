from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
import io

from app.services.file_service import (
    get_file_by_id,
    get_decrypted_file,
    check_access
)

from app.core.security import get_current_user

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return {"message": "Upload working"}   # (replace with your real logic)


@router.get("/download/{file_id}")
def download_file(file_id: int, user=Depends(get_current_user)):

    file = get_file_by_id(file_id)

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if not check_access(user.role.name, file.classification):
        raise HTTPException(status_code=403, detail="Access Denied")

    file_data = get_decrypted_file(file.stored_filename, file.iv)

    return StreamingResponse(
        io.BytesIO(file_data),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={file.original_filename}"
        }
    )