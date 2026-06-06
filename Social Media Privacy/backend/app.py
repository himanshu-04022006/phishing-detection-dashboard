from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from risk_engine import calculate_risk
from database import init_db, save_assessment, get_stats

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class AnalyzeRequest(BaseModel):
    username: str
    email: str
    phone: str
    bio: str


@app.get("/")
def home():
    return {"message": "Social Media Privacy Backend Running"}


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    result = calculate_risk(
        data.username,
        data.email,
        data.phone,
        data.bio
    )

    save_assessment(
        result["username"],
        result["risk_score"],
        result["findings"]
    )

    return result


@app.get("/stats")
def stats():
    return get_stats()