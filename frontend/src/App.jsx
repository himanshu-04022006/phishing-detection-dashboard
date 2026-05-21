import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sender, setSender] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({
    total_scans: 0,
    phishing_detected: 0,
    safe_emails: 0,
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://phishing-detection-dashboard.onrender.com";

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stats`);
      setStats({
        total_scans: res.data.total_scans ?? res.data.total ?? 0,
        phishing_detected:
          res.data.phishing_detected ?? res.data.phishing ?? 0,
        safe_emails: res.data.safe_emails ?? res.data.safe ?? 0,
      });
    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const scanEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        subject: subject,
        body_text: body,
        from_addr: sender,
        urls: url,
      });

      setResult(response.data);
      await loadStats();
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Backend connection failed. Please check Render backend URL.");
    } finally {
      setLoading(false);
    }
  };

  const predictionValue =
    result?.prediction ?? result?.label ?? result?.result ?? "Unknown";

  const isPhishing =
    result?.prediction === 1 ||
    result?.label === 1 ||
    String(result?.result || "").toLowerCase().includes("phishing") ||
    String(result?.result || "").toLowerCase().includes("malicious");

  const confidence = Number(result?.score ?? result?.confidence ?? 0);

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top right, #162447, #070b18 45%, #020617)",
      color: "#ffffff",
      fontFamily: "Inter, Arial, sans-serif",
      padding: "24px",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "40px",
    },
    logo: { fontSize: "26px", fontWeight: "800", color: "#4da3ff" },
    badge: {
      border: "1px solid #22c55e",
      color: "#22c55e",
      padding: "8px 18px",
      borderRadius: "999px",
      fontWeight: "700",
      background: "rgba(34,197,94,0.1)",
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: "28px",
      marginBottom: "28px",
    },
    h1: {
      fontSize: "42px",
      lineHeight: "1.1",
      marginBottom: "18px",
    },
    p: {
      color: "#cbd5e1",
      fontSize: "16px",
      lineHeight: "1.7",
    },
    card: {
      background: "rgba(15,23,42,0.86)",
      border: "1px solid rgba(148,163,184,0.25)",
      borderRadius: "22px",
      padding: "28px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    },
    active: {
      fontSize: "38px",
      color: "#22c55e",
      margin: "10px 0",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "28px",
      marginBottom: "28px",
    },
    input: {
      width: "100%",
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "14px",
      border: "1px solid rgba(148,163,184,0.3)",
      background: "#020617",
      color: "#ffffff",
      fontSize: "15px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      height: "140px",
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "14px",
      border: "1px solid rgba(148,163,184,0.3)",
      background: "#020617",
      color: "#ffffff",
      fontSize: "15px",
      resize: "vertical",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "17px",
      border: "none",
      borderRadius: "14px",
      background: "linear-gradient(90deg, #2563eb, #9333ea)",
      color: "white",
      fontSize: "17px",
      fontWeight: "800",
      cursor: "pointer",
    },
    resultBox: {
      border: `1px solid ${isPhishing ? "#ef4444" : "#22c55e"}`,
      boxShadow: `0 0 35px ${
        isPhishing ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"
      }`,
      borderRadius: "22px",
      padding: "28px",
      background: "#020617",
    },
    pill: {
      display: "inline-block",
      padding: "8px 18px",
      borderRadius: "999px",
      background: isPhishing
        ? "rgba(239,68,68,0.25)"
        : "rgba(34,197,94,0.25)",
      color: isPhishing ? "#f87171" : "#4ade80",
      fontWeight: "800",
      marginBottom: "20px",
    },
    analyticsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "18px",
    },
    statNumber: {
      fontSize: "34px",
      color: "#60a5fa",
      margin: "8px 0",
    },
    footer: {
      textAlign: "center",
      color: "#64748b",
      marginTop: "26px",
    },
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div>
          <div style={styles.logo}>PhishGuard AI</div>
          <div style={{ color: "#94a3b8" }}>
            AI-Powered Phishing Detection Dashboard
          </div>
        </div>
        <div style={styles.badge}>● Live Security Scanner</div>
      </nav>

      <section style={styles.hero}>
        <div>
          <h1 style={styles.h1}>Detect Suspicious Emails Before They Attack</h1>
          <p style={styles.p}>
            Analyze email subject, body, sender, and suspicious links using a
            machine-learning powered phishing detection system.
          </p>
        </div>

        <div style={styles.card}>
          <p style={{ color: "#93c5fd" }}>Threat Engine</p>
          <h2 style={styles.active}>Active</h2>
          <p style={styles.p}>Backend connected via Render API</p>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2>Scan Email</h2>

          <input
            style={styles.input}
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Paste email body/message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Sender Email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Suspicious URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button style={styles.button} onClick={scanEmail} disabled={loading}>
            {loading ? "Scanning Threat..." : "Scan Email"}
          </button>
        </div>

        <div style={styles.card}>
          <h2>Detection Result</h2>

          {!result ? (
            <div
              style={{
                border: "1px dashed rgba(148,163,184,0.4)",
                borderRadius: "18px",
                padding: "40px",
                textAlign: "center",
                color: "#94a3b8",
              }}
            >
              <p>No scan result yet.</p>
              <p>Submit an email to analyze phishing risk.</p>
            </div>
          ) : (
            <div style={styles.resultBox}>
              <span style={styles.pill}>{isPhishing ? "Phishing" : "Safe"}</span>

              <h1>{isPhishing ? "Phishing Email Detected" : "Email Looks Safe"}</h1>

              <h3>Prediction: {String(predictionValue)}</h3>
              <h3>Confidence: {confidence.toFixed(4)}</h3>
              <h3>Risk Level: {isPhishing ? "High" : "Low"}</h3>
            </div>
          )}
        </div>
      </section>

      <section style={styles.card}>
        <h2>Threat Analytics</h2>

        <div style={styles.analyticsGrid}>
          <div style={styles.card}>
            <p>Total Scans</p>
            <h1 style={styles.statNumber}>{stats.total_scans}</h1>
            <p style={styles.p}>Emails analyzed</p>
          </div>

          <div style={styles.card}>
            <p>Phishing Detected</p>
            <h1 style={styles.statNumber}>{stats.phishing_detected}</h1>
            <p style={styles.p}>Threats found</p>
          </div>

          <div style={styles.card}>
            <p>Safe Emails</p>
            <h1 style={styles.statNumber}>{stats.safe_emails}</h1>
            <p style={styles.p}>Clean results</p>
          </div>
        </div>
      </section>

      <footer
  style={{
    textAlign: "center",
    padding: "12px",
    fontSize: "13px",
    color: "#888",
    marginTop: "20px",
  }}
>
  Built by <strong>Himanshu Sahu</strong> · B.Tech Cyber Security, Pune ·
  <a
    href="https://github.com/himanshu-04022006"
    target="_blank"
    rel="noreferrer"
  >
    {" "}
    GitHub
  </a>{" "}
  ·
  <a
    href="https://www.linkedin.com/in/himanshu-sahu-a134a0283"
    target="_blank"
    rel="noreferrer"
  >
    {" "}
    LinkedIn
  </a>
  </footer>
    </div>
  );
}

export default App;