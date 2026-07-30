from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad

# The Master Key (Key Encryption Key - KEK)
# In production, this key is managed inside a secure cloud HSM/KMS.
MASTER_KEK = b'MasterKeyEncryptionKey1234567890'

# Keep the legacy static key for backward compatibility when decrypting older files
KEY = b'12345678901234567890123456789012'

def generate_dek() -> bytes:
    """Generate a random 256-bit Data Encryption Key (DEK)."""
    return get_random_bytes(32)

def encrypt_dek(dek: bytes) -> tuple[bytes, bytes]:
    """
    Encrypt the DEK using the Master KEK.
    Returns (encrypted_dek, dek_iv).
    """
    dek_iv = get_random_bytes(16)
    cipher = AES.new(MASTER_KEK, AES.MODE_CBC, dek_iv)
    encrypted_dek = cipher.encrypt(pad(dek, AES.block_size))
    return encrypted_dek, dek_iv

def decrypt_dek(encrypted_dek_bytes: bytes, dek_iv_bytes: bytes) -> bytes:
    """
    Decrypt the DEK using the Master KEK.
    """
    cipher = AES.new(MASTER_KEK, AES.MODE_CBC, dek_iv_bytes)
    dek = unpad(cipher.decrypt(encrypted_dek_bytes), AES.block_size)
    return dek

def encrypt_file(data: bytes, dek: bytes):
    """
    Encrypt file data using the dynamic Data Encryption Key (DEK).
    """
    iv = get_random_bytes(16)
    cipher = AES.new(dek, AES.MODE_CBC, iv)
    encrypted_data = cipher.encrypt(pad(data, AES.block_size))
    return encrypted_data, iv.hex()

def decrypt_file(encrypted_data: bytes, iv: str, dek: bytes):
    """
    Decrypt file data using the dynamic Data Encryption Key (DEK).
    """
    iv_bytes = bytes.fromhex(iv)
    cipher = AES.new(dek, AES.MODE_CBC, iv_bytes)
    decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
    return decrypted_data