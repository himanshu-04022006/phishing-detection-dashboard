[README_phishing_detection_dashboard.md](https://github.com/user-attachments/files/28106790/README_phishing_detection_dashboard.md)[Upl# 🛡️ Phishing Email Detection Dashboard

An AI-powered web application that analyzes email content in real time and predicts whether it is **safe or a phishing attempt**, using a trained Machine Learning model served via a FastAPI backend and a React frontend.

🔗 **Live Demo:** [phishing-detection-dashboard-6z2u.vercel.app](https://phishing-detection-dashboard-6z2u.vercel.app)

---

## 📌 What It Does

- Accepts email input (subject, body, sender address, and URLs)
- Extracts features using TF-IDF vectorization + custom URL feature extraction
- Runs a trained Logistic Regression model to classify the email as **Phishing** or **Safe**
- Returns a **risk score (0–1)** along with the classification label
- Logs all scans to a SQLite database and displays real-time stats (total scans, phishing detected, safe emails)

---

## 🧠 How the ML Model Works

| Step | Detail |
|------|--------|
| **Text Features** | TF-IDF vectorization on email subject + body text |
| **URL Features** | Custom `featureizer.py` extracts URL-based signals (length, special chars, suspicious keywords) |
| **Model** | Logistic Regression trained on labeled phishing email dataset (`emails_labeled.csv`) |
| **Output** | Probability score + binary label (0 = Safe, 1 = Phishing) |
| **Threshold** | Score ≥ 0.5 → classified as Phishing |

The model is serialized using `joblib` and loaded at API startup (`phish_lr.joblib`).

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Python, FastAPI |
| ML Model | Scikit-learn (Logistic Regression + TF-IDF) |
| Database | SQLite |
| Deployment | Vercel (frontend), backend served via API |

---

## 📁 Project Structure

```
phishing-detection-dashboard/
│
├── app.py               # FastAPI app — /predict, /stats, /health endpoints
├── featureizer.py       # URL feature extraction logic
├── train_model.py       # Model training script
├── phish_lr.joblib      # Serialized trained model + TF-IDF vectorizer
├── emails_labeled.csv   # Labeled phishing email dataset used for training
├── events.db            # SQLite database for scan logs
├── requirements.txt     # Python dependencies
│
└── frontend/            # React frontend
```

---

## 🚀 Running Locally

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload
```
API will be available at `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/predict` | Classify an email as phishing or safe |
| GET | `/stats` | Get total scan statistics |

### Sample Request
```json
POST /predict
{
  "subject": "Urgent: Verify your account",
  "body_text": "Click the link below to reset your password immediately.",
  "from_addr": "support@paypa1.com",
  "urls": "http://paypa1.com/reset"
}
```

### Sample Response
```json
{
  "label": 1,
  "result": "Phishing",
  "score": 0.87
}
```

---

## 🔐 Security Relevance

This project demonstrates applied cybersecurity concepts including:
- **Social engineering detection** via NLP/text analysis
- **URL heuristic analysis** for phishing indicators
- **ML-based threat classification** used in real-world email security tools (similar to approaches used by Google Safe Browsing, Microsoft Defender)

---

## 👤 Author

**Himanshu Sahu**
3rd Year B.Tech — Cyber Security | Pune
[LinkedIn](https://www.linkedin.com/in/himanshu-sahu) • [GitHub](https://github.com/himanshu-04022006)
oading README_phishing_detection_dashboard.md…]()
