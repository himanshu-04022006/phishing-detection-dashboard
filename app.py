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

db.execute("""
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender TEXT,
    subject TEXT,
    score REAL,
    label INTEGER
)
""")

class Mail(BaseModel):
    subject: str
    body_text: str
    from_addr: str = ""
    urls: str = ""

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

    db.execute(
        "INSERT INTO events(sender, subject, score, label) VALUES (?, ?, ?, ?)",
        (mail.from_addr, mail.subject, score, label)
    )

    db.commit()

    signals = []

    if label == 1:
        signals.append("Suspicious phishing pattern detected.")

    if "urgent" in text.lower():
        signals.append("Urgent language detected.")

    if "verify" in text.lower():
        signals.append("Verification keyword detected.")

    if mail.urls:
        signals.append("Email contains URLs.")

    return {
        "phish_score": round(score, 3),
        "label": "Phishing" if label == 1 else "Safe",
        "signals": signals
    }

@app.get("/stats")
def stats():

    cur = db.cursor()

    cur.execute("SELECT COUNT(*) FROM events")
    total = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM events WHERE label = 1")
    high = cur.fetchone()[0]

    cur.execute("""
        SELECT sender, subject, score, label, ts
        FROM events
        ORDER BY id DESC
        LIMIT 10
    """)

    rows = cur.fetchall()

    alerts = [
        {
            "sender": r[0],
            "subject": r[1],
            "score": round(r[2], 3),
            "label": "Phishing" if r[3] == 1 else "Safe",
            "time": r[4]
        }
        for r in rows
    ]

    return {
        "total_scanned": total,
        "high_risk": high,
        "alerts": alerts,
        "lesson": "Always hover over links before clicking."
    }
if __name__ == "__main__":
    app.run(debug=True, port=5000)