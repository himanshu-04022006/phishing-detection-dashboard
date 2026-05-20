from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import joblib
import numpy as np
import sqlite3

from featureizer import extract_url_feats

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bundle = joblib.load("phish_lr.joblib")

model = bundle["model"]
tfidf = bundle["tfidf"]

db = sqlite3.connect("events.db", check_same_thread=False)
cursor = db.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT,
    body_text TEXT,
    from_addr TEXT,
    urls TEXT,
    score REAL,
    label INTEGER
)
""")
db.commit()


class Mail(BaseModel):
    subject: str
    body_text: str
    from_addr: str = ""
    urls: str = ""


@app.get("/")
def home():
    return {"message": "Phishing Detection API is running"}


@app.get("/stats")
def stats():
    cursor.execute("SELECT COUNT(*) FROM scans")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scans WHERE label = 1")
    phishing = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM scans WHERE label = 0")
    safe = cursor.fetchone()[0]

    return {
        "total_scans": total,
        "phishing_detected": phishing,
        "safe_emails": safe
    }


@app.post("/predict")
def predict(mail: Mail):
    text = mail.subject + " " + mail.body_text

    X_text = tfidf.transform([text]).toarray()

    X_url = np.array([
        extract_url_feats(mail.urls)
    ])

    X = np.hstack([X_text, X_url])

    score = float(model.predict_proba(X)[0][1])
    label = int(score >= 0.5)

    cursor.execute(
        """
        INSERT INTO scans 
        (subject, body_text, from_addr, urls, score, label)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            mail.subject,
            mail.body_text,
            mail.from_addr,
            mail.urls,
            score,
            label
        )
    )
    db.commit()

    return {
        "label": label,
        "result": "Phishing" if label == 1 else "Safe",
        "score": score
    }