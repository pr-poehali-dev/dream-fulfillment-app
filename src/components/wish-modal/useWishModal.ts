import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import func2url from "../../../backend/func2url.json";
import { getStarTier } from "./constants";

export function useWishModal(onSent: (amount: number, wish: string, x?: number, y?: number) => void) {
  const { user } = useUser();
  const [wish, setWish] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState<number | "">(100);
  const [amountInput, setAmountInput] = useState("100");
  const [step, setStep] = useState<"form" | "paying" | "done">("form");
  const [saving, setSaving] = useState(false);
  const [pendingStarId, setPendingStarId] = useState<number | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [payError, setPayError] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [agreeToRules, setAgreeToRules] = useState(false);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user?.email]);

  const numAmount = typeof amount === "number" ? amount : 0;
  const tier = getStarTier(numAmount);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = wish.trim() && numAmount >= 10 && isEmailValid && agreeToRules;

  const handleAmountInput = (val: string) => {
    setAmountInput(val);
    const n = parseInt(val, 10);
    setAmount(isNaN(n) ? "" : n);
  };

  const handleQuick = (val: number) => {
    setAmount(val);
    setAmountInput(String(val));
  };

  const handleSubmit = async () => {
    if (!isValid || !user) return;
    setSaving(true);
    setPayError("");
    try {
      const res = await fetch(func2url["save-wish"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          wish,
          story,
          amount: numAmount,
          email,
        }),
      });
      const data = await res.json();
      if (data.id && data.payment) {
        setPendingStarId(data.id);
        setPendingCoords({ x: data.x, y: data.y });

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://wl.walletone.com/checkout/checkout/Index";
        form.acceptCharset = "UTF-8";
        form.target = "_blank";
        Object.entries(data.payment as Record<string, string>).forEach(
          ([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            form.appendChild(input);
          },
        );
        document.body.appendChild(form);
        form.submit();
        form.remove();

        setStep("paying");
      } else {
        setPayError(data.error || "Не удалось создать звезду");
      }
    } catch {
      setPayError("Ошибка соединения. Попробуй ещё раз.");
    }
    setSaving(false);
  };

  const handleCheckStatus = async () => {
    if (!pendingStarId) return;
    setCheckingStatus(true);
    try {
      const res = await fetch(func2url["save-wish"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", star_id: pendingStarId }),
      });
      const data = await res.json();
      if (data.status === "active") {
        setStep("done");
        setTimeout(
          () => onSent(numAmount, wish, pendingCoords?.x, pendingCoords?.y),
          1500,
        );
      } else {
        setPayError(
          "Оплата ещё не подтверждена. Подожди немного и попробуй снова.",
        );
      }
    } catch {
      setPayError("Ошибка проверки. Попробуй ещё раз.");
    }
    setCheckingStatus(false);
  };

  return {
    user,
    wish,
    setWish,
    story,
    setStory,
    amountInput,
    step,
    setStep,
    saving,
    checkingStatus,
    payError,
    setPayError,
    email,
    setEmail,
    agreeToRules,
    setAgreeToRules,
    numAmount,
    tier,
    isEmailValid,
    isValid,
    handleAmountInput,
    handleQuick,
    handleSubmit,
    handleCheckStatus,
  };
}