import os
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Corporate corpus representing Public, Internal, Confidential, and Restricted documents
TRAINING_DATA = [
    # Public
    ("Our company is excited to announce the launch of our new product.", "Public"),
    ("Welcome to our corporate website. We offer high-quality services.", "Public"),
    ("Press release: Q3 earnings show steady growth across all sectors.", "Public"),
    ("Marketing brochure: join our loyalty program and earn reward points.", "Public"),
    ("This document describes standard general instructions for users.", "Public"),
    ("Public announcement regarding building renovation and workspace changes.", "Public"),
    
    # Internal
    ("Please keep this strategy document inside our team wiki.", "Internal"),
    ("For internal use only: draft roadmap for the upcoming fiscal year.", "Internal"),
    ("Project alpha sprint planning notes and weekly meeting status.", "Internal"),
    ("Employee handbook detailing dress code, holidays, and HR policies.", "Internal"),
    ("Please do not share these engineering designs outside the company network.", "Internal"),
    ("Quarterly roadmap and internal objectives for our software development team.", "Internal"),
    
    # Confidential
    ("Customer database backup containing email addresses and credit cards.", "Confidential"),
    ("Here is the database password: admin123! and API key secrets.", "Confidential"),
    ("Confidential financial report: monthly payroll and executive compensation.", "Confidential"),
    ("Personal identity records, Aadhaar numbers, and bank account routing keys.", "Confidential"),
    ("Access tokens, private keys, and user password credentials stored securely.", "Confidential"),
    ("Sensitive financial statements, trade ledgers, and credit cards database.", "Confidential"),
    
    # Restricted
    ("Restricted access: Board of Directors mergers and acquisition planning.", "Restricted"),
    ("Project Manhattan: Top secret nuclear research and weapon design files.", "Restricted"),
    ("Highly classified patent applications for stealth aircraft engineering.", "Restricted"),
    ("Restricted document detailing military deployment operations and plans.", "Restricted"),
    ("Strictly restricted source code intellectual property and trade secrets.", "Restricted"),
    ("Acquisition targets list, board decisions, and executive stealth blueprints.", "Restricted")
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "classification_model.pkl")

def get_trained_model():
    # If the model is already trained and saved on disk, load it
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            pass
            
    # Train the pipeline
    texts = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]
    
    pipeline = Pipeline([
        ('vectorizer', TfidfVectorizer(lowercase=True, stop_words='english')),
        ('classifier', MultinomialNB())
    ])
    
    pipeline.fit(texts, labels)
    
    # Save the pipeline to disk
    try:
        joblib.dump(pipeline, MODEL_PATH)
    except Exception:
        pass
        
    return pipeline

# Initialize model on startup
_model = get_trained_model()

def classify_file(content: str) -> str:
    """
    Predict the classification level (Public, Internal, Confidential, Restricted)
    using the trained TF-IDF + Naive Bayes Machine Learning model.
    """
    if not content or not content.strip():
        return "Public"
        
    try:
        prediction = _model.predict([content])[0]
        return prediction
    except Exception as e:
        print(f"ML classification failed, falling back to keywords. Error: {e}")
        # Heuristic fallback if model execution fails
        content = content.lower()
        if "restricted" in content or "stealth" in content or "manhattan" in content:
            return "Restricted"
        elif "internal use" in content or "roadmap" in content:
            return "Internal"
        elif "password" in content or "bank" in content or "credential" in content:
            return "Confidential"
        return "Public"