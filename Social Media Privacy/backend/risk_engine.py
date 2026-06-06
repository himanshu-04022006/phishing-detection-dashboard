import re
import joblib

EMAIL_PATTERN = r"\S+@\S+\.\S+"
PHONE_PATTERN = r"^\d{10}$"
URL_PATTERN = r"https?://\S+"
USERNAME_PATTERN = r"@\w+"

DOB_PATTERNS = [
    r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
    r"\b(?:dob|date of birth|born on)\s*[:\-]?\s*\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
    r"\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}\b"
]

LOCATION_KEYWORDS = [
    "road", "street", "colony", "apartment", "flat",
    "house no", "room no", "near", "lane", "sector",
    "pune", "mumbai", "delhi", "bangalore", "bengaluru",
    "nashik", "akola", "hostel", "college", "school"
]

model = joblib.load("privacy_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


def add_finding(findings, category, item, points, fix):
    findings.append({
        "category": category,
        "item": item,
        "risk_points": points,
        "fix": fix
    })


def calculate_risk(username: str, email: str, phone: str, bio: str):
    score = 0
    findings = []

    if re.search(EMAIL_PATTERN, email):
        score += 10
        add_finding(findings, "PII", "Valid email is publicly visible", 10,
                    "Remove public email or use a contact form.")

    if re.search(PHONE_PATTERN, phone):
        score += 10
        add_finding(findings, "PII", "Valid phone number is publicly visible", 10,
                    "Remove phone number from public profile.")

    if re.search(URL_PATTERN, bio):
        score += 5
        add_finding(findings, "LINK", "Public URL detected in bio", 5,
                    "Check linked pages for exposed personal data.")

    bio_lower = bio.lower()

    if any(keyword in bio_lower for keyword in LOCATION_KEYWORDS):
        score += 15
        add_finding(findings, "LOCATION", "Possible address or location detail detected in bio", 15,
                    "Avoid posting exact location, address, or routine places.")

    if any(re.search(pattern, bio_lower) for pattern in DOB_PATTERNS):
        score += 15
        add_finding(findings, "DOB", "Date of birth or birth detail detected", 15,
                    "Remove DOB from public profile to reduce identity misuse risk.")

    if re.search(USERNAME_PATTERN, bio):
        score += 5
        add_finding(findings, "HANDLE", "Social media username or handle detected", 5,
                    "Avoid linking too many accounts using the same handle.")

    bio_vector = vectorizer.transform([bio])
    ml_prediction = model.predict(bio_vector)[0]

    if ml_prediction == "risky":
        score += 10
        add_finding(findings, "ML", "ML detected contextual privacy risk", 10,
                    "Avoid sharing routines, sensitive personal context, or exploitable details.")

    return {
        "username": username,
        "risk_score": score,
        "ml_prediction": ml_prediction,
        "findings": findings
    }