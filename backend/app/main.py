from fastapi import FastAPI

app = FastAPI(title="Secure Data Classification System")

@app.get("/")
def root():
    return {"message": "Secure Data Classification System Backend Running"}
