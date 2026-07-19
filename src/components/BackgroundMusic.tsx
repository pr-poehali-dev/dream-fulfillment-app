import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const MUSIC_URL =
  "https://cdn.poehali.dev/projects/f2ec5eb9-318b-4d91-873e-4b30179226d6/bucket/940a700a-f572-448e-a76b-adeac2ef1997.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.05;
    audio.preload = "auto";
    audioRef.current = audio;

    const attemptPlay = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    const startOnInteraction = () => {
      attemptPlay();
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };
    window.addEventListener("click", startOnInteraction);
    window.addEventListener("touchstart", startOnInteraction);
    window.addEventListener("keydown", startOnInteraction);

    // Перезагружаем файл как Blob с корректным MIME-типом —
    // сервер хранилища отдаёт audio/mpeg как application/octet-stream,
    // из-за чего некоторые браузеры отказываются воспроизводить <audio>.
    fetch(MUSIC_URL)
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return;
        const typed = new Blob([blob], { type: "audio/mpeg" });
        objectUrl = URL.createObjectURL(typed);
        audio.src = objectUrl;
        attemptPlay();
      })
      .catch(() => {
        if (cancelled) return;
        audio.src = MUSIC_URL;
        attemptPlay();
      });

    return () => {
      cancelled = true;
      audio.pause();
      audioRef.current = null;
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Выключить музыку" : "Включить музыку"}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 300,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(6,8,16,0.7)",
        border: "1px solid rgba(201,168,76,0.3)",
        color: playing ? "#c9a84c" : "rgba(200,210,240,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(6px)",
      }}
    >
      <Icon name={playing ? "Volume2" : "VolumeX"} size={20} />
    </button>
  );
}