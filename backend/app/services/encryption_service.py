from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad

KEY = b'12345678901234567890123456789012'

def encrypt_file(data: bytes):

    iv = get_random_bytes(16)

    cipher = AES.new(KEY, AES.MODE_CBC, iv)

    encrypted_data = cipher.encrypt(pad(data, AES.block_size))

    return encrypted_data, iv.hex()

from Crypto.Util.Padding import unpad

def decrypt_file(encrypted_data: bytes, iv: str):

    iv_bytes = bytes.fromhex(iv)

    cipher = AES.new(KEY, AES.MODE_CBC, iv_bytes)

    decrypted_data = unpad(cipher.decrypt(encrypted_data), AES.block_size)

    return decrypted_data