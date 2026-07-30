import os
import uuid
from app.services.encryption_service import (
    encrypt_file,
    generate_dek,
    encrypt_dek,
    decrypt_dek,
    decrypt_file
)
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

    # 4. Generate dynamic DEK and encrypt file
    dek = generate_dek()
    encrypted_data, iv = encrypt_file(file_bytes, dek)

    # 4.1 Encrypt the DEK using Master KEK (Envelope Encryption)
    encrypted_dek_bytes, dek_iv_bytes = encrypt_dek(dek)
    encrypted_dek_hex = encrypted_dek_bytes.hex()
    dek_iv_hex = dek_iv_bytes.hex()

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
        iv,
        encrypted_dek_hex,
        dek_iv_hex
    )

    # 8. Return metadata
    return {
        "file_id": file_record.id,
        "original_filename": file.filename,
        "classification": classification
    }
    
def get_decrypted_file(filename: str, iv: str, encrypted_dek: str = None, dek_iv: str = None):

    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        return None

    with open(file_path, "rb") as f:
        encrypted_data = f.read()

    # If the database record contains envelope encryption columns, decrypt DEK then decrypt file
    if encrypted_dek and dek_iv:
        try:
            encrypted_dek_bytes = bytes.fromhex(encrypted_dek)
            dek_iv_bytes = bytes.fromhex(dek_iv)
            dek = decrypt_dek(encrypted_dek_bytes, dek_iv_bytes)
            decrypted_data = decrypt_file(encrypted_data, iv, dek)
            return decrypted_data
        except Exception as e:
            print(f"Failed to decrypt DEK: {e}. Attempting fallback legacy decryption.")

    # Fallback legacy key decryption
    try:
        from app.services.encryption_service import KEY
        from Crypto.Cipher import AES
        from Crypto.Util.Padding import unpad
        iv_bytes = bytes.fromhex(iv)
        cipher = AES.new(KEY, AES.MODE_CBC, iv_bytes)
        decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
        return decrypted_data
    except Exception as e:
        print(f"Legacy decryption failed: {e}")
        return None

from app.models.file_model import File
from app.core.database import SessionLocal

def save_file_metadata(original, stored, classification, iv, encrypted_dek=None, dek_iv=None):

    db = SessionLocal()

    file = File(
        original_filename=original,
        stored_filename=stored,
        classification=classification,
        iv=iv,
        encrypted_dek=encrypted_dek,
        dek_iv=dek_iv
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

    file_record = db.query(File).filter(File.id == file_id).first()

    db.close()

    return file_record


def check_access(user_role: str, file_label: str):

    access_map = {
        "Admin": ["Public", "Internal", "Confidential", "Restricted"],
        "Manager": ["Public", "Internal", "Confidential"],
        "Employee": ["Public", "Internal"],
        "User": ["Public"]
    }

    return file_label in access_map.get(user_role, [])