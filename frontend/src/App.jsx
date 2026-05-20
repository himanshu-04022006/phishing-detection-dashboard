import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sender, setSender] = useState("");
  const [url, setUrl] = useState("");

  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    "https://phishing-detection-dashboard.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/stats`)
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Stats Error:", err);
      });
  }, []);

  const scanEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/predict`,
        {
          subject: subject,
          body_text: body,
          from_addr: sender,
          urls: url,
        }
      );

      setResult(response.data);

      axios
        .get(`${API_BASE_URL}/stats`)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.error("Stats Refresh Error:", err);
        });

    } catch (error) {
      console.error("Prediction Error:", error);

      alert(
        "Backend connection failed. Please check Render backend URL"
      );
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="hero">
        <div className="hero-left">
          <h1>Detect Suspicious Emails Before They Attack</h1>

          <p>
            Analyze email subject, body, sender, and suspicious
            links using a machine-learning powered phishing
            detection system.
          </p>
        </div>

        <div className="hero-right">
          <div className="status-card">
            <h2>Threat Engine</h2>

            <h1 className="active">Active</h1>

            <p>Backend connected via Render API</p>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="scan-card">
          <h2>Scan Email</h2>

          <input
            type="text"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <textarea
            placeholder="Paste email body/message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <input
            type="text"
            placeholder="Sender Email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />

          <input
            type="text"
            placeholder="Suspicious URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={scanEmail} disabled={loading}>
            {loading ? "Scanning Threat..." : "Scan Email"}
          </button>
        </div>

        <div className="result-card">
          <h2>Detection Result</h2>

          {!result ? (
            <div className="empty-result">
              <p>No scan result yet.</p>
              <p>Submit an email to analyze phishing risk.</p>
            </div>
          ) : (
            <div className="result-box">
              <h1
                className={
                  result.label === 1
                    ? "phishing"
                    : "safe"
                }
              >
                {result.result}
              </h1>

              <p>
                Confidence Score:{" "}
                {(result.score * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="analytics">
        <h2>Threat Analytics</h2>

        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Total Scans</h3>

            <h1>
              {stats ? stats.total_scans : 0}
            </h1>

            <p>Emails analyzed</p>
          </div>

          <div className="analytics-card">
            <h3>Phishing Detected</h3>

            <h1>
              {stats ? stats.phishing_detected : 0}
            </h1>

            <p>Threats found</p>
          </div>

          <div className="analytics-card">
            <h3>Safe Emails</h3>

            <h1>
              {stats ? stats.safe_emails : 0}
            </h1>

            <p>Clean results</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;