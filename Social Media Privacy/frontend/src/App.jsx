import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = "http://127.0.0.1:8000";

const samples = [
  {
    name: "Low Risk",
    data: {
      username: "aman",
      email: "",
      phone: "",
      bio: "I enjoy reading books and learning cybersecurity.",
    },
  },
  {
    name: "Routine Risk",
    data: {
      username: "rahul",
      email: "",
      phone: "",
      bio: "I leave hostel every day at 7 AM and return around 8 PM.",
    },
  },
  {
    name: "High Exposure",
    data: {
      username: "himanshu",
      email: "himanshu@gmail.com",
      phone: "9876543210",
      bio: "DOB: 04/02/2006. I live near MG Road Pune. Follow @cyber_peter and visit https://example.com",
    },
  },
];

function riskMeta(score = 0) {
  if (score >= 70) return { label: "Critical", className: "critical", note: "Immediate privacy cleanup recommended." };
  if (score >= 45) return { label: "High", className: "high", note: "Several privacy signals detected." };
  if (score >= 20) return { label: "Medium", className: "medium", note: "Some exposure exists." };
  return { label: "Low", className: "low", note: "No major exposure detected." };
}

function normalizeFinding(item) {
  if (typeof item === "string") {
    return {
      category: "RISK",
      item,
      risk_points: null,
      fix: "Review this exposure and remove unnecessary public information.",
    };
  }

  return {
    category: item.category || "RISK",
    item: item.item || "Risk detected",
    risk_points: item.risk_points ?? null,
    fix: item.fix || "Review and reduce public exposure.",
  };
}

export default function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const meta = useMemo(() => riskMeta(result?.risk_score || 0), [result]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function loadSample(sample) {
    setForm(sample.data);
    setResult(null);
  }

  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {
      setStats(null);
    }
  }

  async function analyzeRisk(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      setResult(data);
      await fetchStats();
    } catch {
      setResult({
        error: "Backend connection failed. Make sure FastAPI is running on http://127.0.0.1:8000",
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="app-shell">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="grid-bg"></div>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SMP-RAF</h2>
            <p>Privacy Risk AI</p>
          </div>
        </div>

        <nav>
          <a className="active">Dashboard</a>
          <a>Risk Engine</a>
          <a>ML Analysis</a>
          <a>Assessment History</a>
        </nav>

        <div className="side-card">
          <span>System Status</span>
          <strong>Online</strong>
          <p>Regex + ML hybrid engine active</p>
        </div>
      </aside>

      <main className="main">
        <section className="hero">
          <div>
            <p className="tag">Cybersecurity • AI/ML • Privacy Awareness</p>
            <h1>Social Media Privacy Risk Assessment Framework</h1>
            <p>
              Detect PII exposure, location leaks, unsafe handles, DOB disclosure,
              contextual oversharing, and social-engineering risk using a hybrid
              rule-based and ML-powered backend.
            </p>
          </div>

          <div className="hero-stats">
            <div>
              <span>Total Scans</span>
              <strong>{stats?.total_assessments ?? "—"}</strong>
            </div>
            <div>
              <span>Avg Risk</span>
              <strong>{stats?.average_score ?? "—"}</strong>
            </div>
            <div>
              <span>Highest</span>
              <strong>{stats?.highest_score ?? "—"}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel input-panel">
            <div className="panel-head">
              <div>
                <span className="mini-label">Input</span>
                <h2>Profile Assessment</h2>
              </div>
              <span className="pill">Live API</span>
            </div>

            <div className="sample-row">
              {samples.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  className="sample-btn"
                  onClick={() => loadSample(sample)}
                >
                  {sample.name}
                </button>
              ))}
            </div>

            <form onSubmit={analyzeRisk}>
              <div className="form-grid">
                <label>
                  Username
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="himanshu"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                  />
                </label>

                <label className="wide">
                  Bio / About / Caption
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="I leave hostel every day at 7 AM..."
                    rows="7"
                  />
                </label>
              </div>

              <button className="primary-btn" disabled={loading}>
                {loading ? "Analyzing Privacy Signals..." : "Analyze Privacy Risk"}
              </button>
            </form>
          </div>

          <div className="panel result-panel">
            <div className="panel-head">
              <div>
                <span className="mini-label">Output</span>
                <h2>Risk Intelligence</h2>
              </div>
              {result && !result.error && (
                <span className={`status-pill ${meta.className}`}>{meta.label}</span>
              )}
            </div>

            {!result && (
              <div className="empty-state">
                <div className="empty-icon">◉</div>
                <h3>No scan yet</h3>
                <p>Submit a profile to generate risk score, ML prediction, and remediation steps.</p>
              </div>
            )}

            {result?.error && <div className="error-box">{result.error}</div>}

            {result && !result.error && (
              <>
                <div className="score-zone">
                  <div
                    className="score-ring"
                    style={{
                      "--score": `${Math.min(result.risk_score || 0, 100) * 3.6}deg`,
                    }}
                  >
                    <div>
                      <strong>{result.risk_score}</strong>
                      <span>/100</span>
                    </div>
                  </div>

                  <div className="risk-copy">
                    <span>Risk Level</span>
                    <h3 className={meta.className}>{meta.label}</h3>
                    <p>{meta.note}</p>
                    <div className="ml-chip">
                      ML Prediction: <b>{result.ml_prediction || "N/A"}</b>
                    </div>
                  </div>
                </div>

                <div className="findings-section">
                  <div className="section-title">
                    <h3>Detected Findings</h3>
                    <span>{result.findings?.length || 0} items</span>
                  </div>

                  {result.findings?.length === 0 && (
                    <div className="success-box">
                      No major privacy risk detected in this input.
                    </div>
                  )}

                  <div className="findings-list">
                    {result.findings?.map((raw, index) => {
                      const item = normalizeFinding(raw);
                      return (
                        <div className="finding-card" key={index}>
                          <div className="finding-main">
                            <span>{item.category}</span>
                            <h4>{item.item}</h4>
                            <p>{item.fix}</p>
                          </div>

                          {item.risk_points !== null && (
                            <div className="points">+{item.risk_points}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="panel history-panel">
          <div className="panel-head">
            <div>
              <span className="mini-label">Database</span>
              <h2>Assessment History</h2>
            </div>
            <button className="ghost-btn" onClick={fetchStats}>Refresh</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Risk Score</th>
                  <th>Findings</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.top_risks?.length ? (
                  stats.top_risks.map((row, index) => (
                    <tr key={index}>
                      <td>{row.username}</td>
                      <td>
                        <span className={`score-badge ${riskMeta(row.risk_score).className}`}>
                          {row.risk_score}
                        </span>
                      </td>
                      <td>{row.findings?.length || 0}</td>
                      <td>
                        {row.created_at
                          ? new Date(row.created_at * 1000).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data">No database records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <footer className="credit-footer">
       <div>
       <strong>Social Media Privacy Risk Assessment Framework</strong>
       <p>Designed & Developed by Himanshu Sahu</p>
       </div>

        <span>Cybersecurity • AI/ML • Privacy Awareness</span>
       </footer>
      </main>
    </div>
  );
}