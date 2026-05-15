import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VKCallback() {
  const navigate = useNavigate();
  const called = useRef(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const device_id = params.get("device_id");
    const error = params.get("error");

    setLogs((prev) => [...prev, `code: ${code ? "есть" : "нет"}`]);
    setLogs((prev) => [...prev, `device_id: ${device_id ? "есть" : "нет"}`]);
    setLogs((prev) => [...prev, `error: ${error || "нет"}`]);

    if (error || !code) {
      setLogs((prev) => [...prev, `ОШИБКА: ${error || "Код не получен"}`]);
      return;
    }

    setLogs((prev) => [...prev, "Перенаправляю на главную..."]);
    setTimeout(() => {
      const qs = device_id
        ? `code=${code}&device_id=${device_id}`
        : `code=${code}`;
      window.location.href = `/?${qs}`;
    }, 3000);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060810",
        color: "#c9a84c",
        fontFamily: "Golos Text, sans-serif",
        padding: "40px",
        fontSize: 16,
      }}
    >
      <h2>Отладка авторизации VK</h2>
      {logs.map((log, i) => (
        <div
          key={i}
          style={{
            marginBottom: 8,
            color: log.includes("ОШИБКА") ? "#ff5555" : "#c9a84c",
          }}
        >
          {log}
        </div>
      ))}
    </div>
  );
}
