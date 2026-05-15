import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VKCallback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error || !code) {
      navigate("/", { replace: true });
      return;
    }

    // Перенаправляем на главную с кодом
    window.location.href = `/?code=${code}`;
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060810",
        color: "#c9a84c",
        fontFamily: "Golos Text, sans-serif",
        fontSize: 18,
      }}
    >
      Входим через ВКонтакте...
    </div>
  );
}
