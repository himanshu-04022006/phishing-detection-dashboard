import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

from featureizer import extract_url_feats

df = pd.read_csv("emails_labeled.csv")

df = df.dropna(subset=["subject", "body_text", "label"])
df = df.drop_duplicates(subset=["subject", "body_text"])

text = df["subject"].fillna("") + " " + df["body_text"].fillna("")
y = df["label"]

tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))

X_text = tfidf.fit_transform(text).toarray()
X_url = np.array([extract_url_feats(x) for x in df["urls"].fillna("")])

X = np.hstack([X_text, X_url])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

model = LogisticRegression(max_iter=300, class_weight="balanced")
model.fit(X_train, y_train)

pred = model.predict(X_test)
proba = model.predict_proba(X_test)[:, 1]

print(classification_report(y_test, pred))
print("ROC-AUC:", roc_auc_score(y_test, proba))

joblib.dump(
    {
        "model": model,
        "tfidf": tfidf
    },
    "phish_lr.joblib"
)

print("Model saved as phish_lr.joblib")