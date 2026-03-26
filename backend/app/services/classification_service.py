def classify_file(content: str):

    content = content.lower()

    if "confidential" in content:
        return "Restricted"

    elif "internal use" in content:
        return "Internal"

    elif "password" in content or "bank" in content:
        return "Confidential"

    else:
        return "Public"