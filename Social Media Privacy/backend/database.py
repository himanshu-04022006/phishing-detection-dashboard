import sqlite3
import json
import time

DB_NAME = "privacy.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            risk_score INTEGER,
            findings TEXT,
            created_at INTEGER
        )
    """)

    conn.commit()
    conn.close()


def save_assessment(username: str, risk_score: int, findings: list):
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO assessments (username, risk_score, findings, created_at)
        VALUES (?, ?, ?, ?)
    """, (
        username,
        risk_score,
        json.dumps(findings),
        int(time.time())
    ))

    conn.commit()
    conn.close()


def get_stats():
    conn = sqlite3.connect(DB_NAME)
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*), AVG(risk_score), MAX(risk_score) FROM assessments")
    total, avg_score, highest_score = cur.fetchone()

    cur.execute("""
        SELECT username, risk_score, findings, created_at
        FROM assessments
        ORDER BY risk_score DESC
        LIMIT 10
    """)

    rows = cur.fetchall()
    conn.close()

    return {
        "total_assessments": total or 0,
        "average_score": round(avg_score or 0, 2),
        "highest_score": highest_score or 0,
        "top_risks": [
            {
                "username": username,
                "risk_score": risk_score,
                "findings": json.loads(findings),
                "created_at": created_at
            }
            for username, risk_score, findings, created_at in rows
        ]
    }