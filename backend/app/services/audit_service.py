import hashlib
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.audit_model import AuditLog

def compute_hash(user_email: str, action: str, timestamp_str: str, previous_hash: str) -> str:
    """Compute the SHA-256 hash of an audit log block."""
    block_string = f"{user_email}|{action}|{timestamp_str}|{previous_hash or '0'}"
    return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

def log_event(db: Session, user_email: str, action: str) -> AuditLog:
    """
    Append a new cryptographically chained audit log entry to the ledger.
    """
    # 1. Fetch the last log entry to retrieve the current head of the chain
    last_log = db.query(AuditLog).order_by(AuditLog.id.desc()).first()
    previous_hash = last_log.current_hash if last_log else "0"

    # 2. Capture a stable timestamp
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    timestamp_str = now.isoformat()

    # 3. Calculate block hash
    current_hash = compute_hash(user_email, action, timestamp_str, previous_hash)

    # 4. Save audit log record to database
    new_log = AuditLog(
        user_email=user_email,
        action=action,
        timestamp=now,
        previous_hash=previous_hash,
        current_hash=current_hash
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def verify_audit_chain(db: Session) -> dict:
    """
    Scan and verify the mathematical integrity of the audit logging ledger.
    """
    logs = db.query(AuditLog).order_by(AuditLog.id.asc()).all()

    if not logs:
        return {"status": "intact", "corrupted_ids": [], "message": "No log records found to verify."}

    corrupted_ids = []
    expected_previous_hash = "0"

    for log in logs:
        # 1. Validate previous hash link matches preceding entry
        if log.previous_hash != expected_previous_hash:
            corrupted_ids.append(log.id)
            expected_previous_hash = log.current_hash
            continue

        # 2. Recalculate hash of content
        timestamp_str = log.timestamp.isoformat()
        calculated_hash = compute_hash(log.user_email, log.action, timestamp_str, log.previous_hash)

        # 3. Validate recalculated hash matches the stored hash
        if log.current_hash != calculated_hash:
            corrupted_ids.append(log.id)

        expected_previous_hash = log.current_hash

    if corrupted_ids:
        return {
            "status": "corrupted",
            "corrupted_ids": corrupted_ids,
            "message": f"Alert: Tampering detected! Log chain is broken at record ID(s): {corrupted_ids}"
        }

    return {
        "status": "intact",
        "corrupted_ids": [],
        "message": f"Verification successful. Chain of {len(logs)} log entries verified intact."
    }
