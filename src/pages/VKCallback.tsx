import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import func2url from "../../backend/func2url.json";

const vkAuthUrl = func2url["vk-auth"];

export default function VKCallback() {
  const navigate = useNavigate();
  const { login } = useUser();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const device_id = params.get("device_id") || "";
    const state = params.get("state") || "";
    const error = params.get("error");

    if (error || !code) {
      navigate("/", { replace: true });
      return;
    }

    // Читаем code_verifier из localStorage — сохранили его перед редиректом в HeroHeader
    const code_verifier = localStorage.getItem("vk_code_verifier") || "";

    fetch(vkAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        device_id,
        code_verifier,
        state,
        redirect_uri: "https://zagadai.online/vk-callback",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        localStorage.removeItem("vk_code_verifier");
        if (data && data.id) {
          login({
            id: data.id,
            vk_id: data.vk_id,
            name: data.name,
            avatar_url: data.avatar_url,
          });
        }
        navigate("/", { replace: true });
      })
      .catch(() => navigate("/", { replace: true }));
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