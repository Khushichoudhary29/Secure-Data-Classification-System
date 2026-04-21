import os
import uuid
from app.services.encryption_service import encrypt_file
from app.services.classification_service import classify_file

UPLOAD_DIR = "app/uploads"

async def save_encrypted_file(file):

    # 1. Read file
    file_bytes = await file.read()

    # 2. Try to decode (only works for text files)
    try:
        content = file_bytes.decode("utf-8")
    except:
        content = ""

    # 3. Classify file
    classification = classify_file(content)

    # 4. Encrypt file
    encrypted_data, iv = encrypt_file(file_bytes)

    # 5. Ensure upload folder exists
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    # 6. Unique filename
    unique_name = str(uuid.uuid4()) + ".enc"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # 7. Save encrypted file
    with open(file_path, "wb") as f:
        f.write(encrypted_data)
        
    file_record = save_file_metadata(
    file.filename,
    unique_name,
    classification,
    iv
)

    # 8. Return metadata
    return {
    "file_id": file_record.id,
    "original_filename": file.filename,
    "classification": classification
}
    
from app.services.encryption_service import decrypt_file

def get_decrypted_file(filename: str, iv: str):

    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        return None

    with open(file_path, "rb") as f:
        encrypted_data = f.read()

    decrypted_data = decrypt_file(encrypted_data, iv)

    return decrypted_data

from app.models.file_model import File
from app.core.database import SessionLocal

def save_file_metadata(original, stored, classification, iv):

    db = SessionLocal()

    file = File(
        original_filename=original,
        stored_filename=stored,
        classification=classification,
        iv=iv
    )

    db.add(file)
    db.commit()
    db.refresh(file)

    db.close()

    return file


from app.models.file_model import File
from app.core.database import SessionLocal

def get_file_by_id(file_id: int):

    db = SessionLocal()

    files = db.query(File).all()

    db.close()

    return file


def check_access(user_role: str, file_label: str):

    access_map = {
        "Admin": ["Public", "Internal", "Confidential", "Restricted"],
        "Manager": ["Public", "Internal", "Confidential"],
        "Employee": ["Public", "Internal"],
        "User": ["Public"]
    }

    return file_label in access_map.get(user_role, [])