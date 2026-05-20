import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sender, setSender] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "https://phishing-detection-dashboard.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Stats Error:", err));
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
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Backend connection failed. Please check Render backend URL.");
    }

    setLoading(false);
  };

  const predictionText =
    result?.prediction || result?.label || result?.result || "Unknown";

  const isPhishing =
     String(predictionText).toLowerCase().includes("phishing") ||
     String(predictionText).toLowerCase().includes("malicious");
  return (
    <div style={styles.page}>
      <div style={styles.backgroundGlow}></div>

      <nav style={styles.navbar}>
        <div>
          <h1 style={styles.logo}>PhishGuard AI</h1>
          <p style={styles.subtitle}>AI-Powered Phishing Detection Dashboard</p>
        </div>
        <div style={styles.statusBadge}>● Live Security Scanner</div>
      </nav>

      <section style={styles.hero}>
        <div>
          <h2 style={styles.heroTitle}>
            Detect Suspicious Emails Before They Attack
          </h2>
          <p style={styles.heroText}>
            Analyze email subject, body, sender, and suspicious links using a
            machine-learning powered phishing detection system.
          </p>
        </div>

        <div style={styles.threatCard}>
          <p style={styles.threatLabel}>Threat Engine</p>
          <h3 style={styles.threatScore}>Active</h3>
          <p style={styles.safeText}>Backend connected via Render API</p>
        </div>
      </section>

      <main style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Scan Email</h2>

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
          <h2 style={styles.cardTitle}>Detection Result</h2>

          {!result && !loading && (
            <div style={styles.emptyBox}>
              <p>No scan result yet.</p>
              <span>Submit an email to analyze phishing risk.</span>
            </div>
          )}

          {loading && (
            <div style={styles.scannerBox}>
              <div style={styles.loader}></div>
              <p>Analyzing indicators...</p>
            </div>
          )}

          {result && (
            <div
              style={{
                ...styles.resultBox,
                borderColor: isPhishing ? "#ef4444" : "#22c55e",
                boxShadow: isPhishing
                  ? "0 0 25px rgba(239,68,68,0.35)"
                  : "0 0 25px rgba(34,197,94,0.35)",
              }}
            >
              <div
                style={{
                  ...styles.riskBadge,
                  background: isPhishing ? "#7f1d1d" : "#14532d",
                  color: isPhishing ? "#fecaca" : "#bbf7d0",
                }}
              >
                {isPhishing ? "High Risk" : "Safe"}
              </div>

              <h3 style={styles.prediction}>
                {isPhishing ? "Phishing Detected" : "Email Looks Safe"}
              </h3>

              <p>
                <strong>Prediction:</strong> {predictionText}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {result?.confidence || result?.score || "N/A"}
              </p>

              <p>
                <strong>Risk Level:</strong>{" "}
                {result?.risk_level || (isPhishing ? "High" : "Low")}
              </p>
            </div>
          )}
        </div>
      </main>

      <section style={styles.analytics}>
        <h2 style={styles.cardTitle}>Threat Analytics</h2>

        <div style={styles.statsGrid}>
          <StatCard
            title="Total Scans"
            value={stats?.total_scans ?? "0"}
            label="Emails analyzed"
          />
          <StatCard
            title="Phishing Detected"
            value={stats?.phishing_detected ?? "0"}
            label="Threats found"
          />
          <StatCard
            title="Safe Emails"
            value={stats?.safe_emails ?? "0"}
            label="Clean results"
          />
        </div>
      </section>

      <footer style={styles.footer}>
        Built by Himanshu Sahu | Cyber Security Project | React + FastAPI + ML
      </footer>
    </div>
  );
}

function StatCard({ title, value, label }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>{title}</p>
      <h3 style={styles.statValue}>{value}</h3>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a, #111827)",
    color: "#e5e7eb",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "28px",
    position: "relative",
    overflow: "hidden",
  },
  backgroundGlow: {
    position: "absolute",
    width: "420px",
    height: "420px",
    background: "rgba(37, 99, 235, 0.18)",
    borderRadius: "50%",
    filter: "blur(90px)",
    top: "-120px",
    right: "-100px",
    zIndex: 0,
  },
  navbar: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "45px",
  },
  logo: {
    margin: 0,
    fontSize: "32px",
    color: "#60a5fa",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },
  statusBadge: {
    padding: "10px 16px",
    border: "1px solid #22c55e",
    borderRadius: "999px",
    color: "#86efac",
    background: "rgba(34, 197, 94, 0.08)",
    fontWeight: "bold",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
    marginBottom: "28px",
  },
  heroTitle: {
    fontSize: "44px",
    lineHeight: "1.1",
    margin: "0 0 16px",
  },
  heroText: {
    maxWidth: "750px",
    color: "#cbd5e1",
    fontSize: "17px",
    lineHeight: "1.7",
  },
  threatCard: {
    background: "rgba(15, 23, 42, 0.75)",
    border: "1px solid rgba(96, 165, 250, 0.35)",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 0 35px rgba(59,130,246,0.18)",
  },
  threatLabel: {
    color: "#93c5fd",
    margin: 0,
  },
  threatScore: {
    fontSize: "38px",
    margin: "10px 0",
    color: "#22c55e",
  },
  safeText: {
    color: "#94a3b8",
  },
  grid: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "22px",
    padding: "24px",
    backdropFilter: "blur(14px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  cardTitle: {
    marginTop: 0,
    color: "#f8fafc",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginTop: "14px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginTop: "14px",
    minHeight: "150px",
    borderRadius: "12px",
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
  },
  button: {
    width: "100%",
    marginTop: "18px",
    padding: "15px",
    border: "none",
    borderRadius: "14px",
    color: "white",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(37,99,235,0.35)",
  },
  emptyBox: {
    border: "1px dashed #475569",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    color: "#94a3b8",
  },
  scannerBox: {
    textAlign: "center",
    padding: "40px",
    color: "#93c5fd",
  },
  loader: {
    width: "48px",
    height: "48px",
    border: "4px solid #1e293b",
    borderTop: "4px solid #38bdf8",
    borderRadius: "50%",
    margin: "0 auto 18px",
    animation: "spin 1s linear infinite",
  },
  resultBox: {
    border: "1px solid",
    borderRadius: "18px",
    padding: "24px",
    background: "rgba(2, 6, 23, 0.85)",
  },
  riskBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "bold",
    marginBottom: "14px",
  },
  prediction: {
    fontSize: "28px",
    margin: "5px 0 18px",
  },
  analytics: {
    position: "relative",
    zIndex: 1,
    marginTop: "24px",
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(148, 163, 184, 0.25)",
    borderRadius: "22px",
    padding: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },
  statCard: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: "18px",
    padding: "20px",
  },
  statTitle: {
    color: "#94a3b8",
    margin: 0,
  },
  statValue: {
    fontSize: "34px",
    color: "#60a5fa",
    margin: "10px 0",
  },
  statLabel: {
    color: "#64748b",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    marginTop: "30px",
    color: "#64748b",
  },
};

export default App;