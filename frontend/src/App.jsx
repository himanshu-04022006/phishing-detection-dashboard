import { useEffeccd frontend, useState } from "react";
import axios from "axios";

function App() {

  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    subject: "",
    body_text: "",
    from_addr: "",
    urls: ""
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {

    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/stats"
      );

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/predict",
        form
      );

      setResult(res.data);

      fetchStats();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        fontFamily: "Arial"
      }}
    >

      <h1>Phishing Detection Dashboard</h1>

      <div
        style={{
          border: "1px solid gray",
          padding: 20,
          borderRadius: 10,
          marginBottom: 30
        }}
      >

        <h2>Scan Email</h2>

        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) =>
            setForm({
              ...form,
              subject: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <textarea
          placeholder="Email Body"
          value={form.body_text}
          onChange={(e) =>
            setForm({
              ...form,
              body_text: e.target.value
            })
          }
          style={{
            width: "100%",
            height: 120,
            padding: 10,
            marginBottom: 10
          }}
        />

        <input
          type="text"
          placeholder="Sender"
          value={form.from_addr}
          onChange={(e) =>
            setForm({
              ...form,
              from_addr: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <input
          type="text"
          placeholder="URLs"
          value={form.urls}
          onChange={(e) =>
            setForm({
              ...form,
              urls: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Scan Email
        </button>

      </div>

      {result && (

        <div
          style={{
            border: "1px solid gray",
            padding: 20,
            borderRadius: 10,
            marginBottom: 30
          }}
        >

          <h2>Prediction Result</h2>

          <p>
            <b>Phish Score:</b> {result.phish_score}
          </p>

          <p>
            <b>Label:</b> {result.label}
          </p>

          <h3>Signals</h3>

          <ul>
            {result.signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>

        </div>
      )}

      {stats && (

        <div
          style={{
            border: "1px solid gray",
            padding: 20,
            borderRadius: 10
          }}
        >

          <h2>Dashboard Stats</h2>

          <p>
            <b>Total Emails Scanned:</b> {stats.total_scanned}
          </p>

          <p>
            <b>High Risk Emails:</b> {stats.high_risk}
          </p>

          <h3>Awareness Tip</h3>

          <p>{stats.lesson}</p>

          <h3>Recent Alerts</h3>

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >

            <thead>

              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Label</th>
              </tr>

            </thead>

            <tbody>

              {stats.alerts.map((a, i) => (

                <tr key={i}>
                  <td>{a.sender}</td>
                  <td>{a.subject}</td>
                  <td>{a.score}</td>
                  <td>{a.label}</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default App;