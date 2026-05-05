import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onClose: () => void;
  onSent: () => void;
}

const AMOUNTS = [
  { value: 10, label: "10 ₽", tier: "до 1 000 ₽" },
  { value: 50, label: "50 ₽", tier: "до 5 000 ₽" },
  { value: 100, label: "100 ₽", tier: "до 10 000 ₽" },
  { value: 500, label: "500 ₽", tier: "до 50 000 ₽" },
  { value: 1000, label: "1 000 ₽", tier: "до 100 000 ₽" },
];

export default function WishModal({ onClose, onSent }: Props) {
  const [wish, setWish] = useState("");
  const [story, setStory] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [step, setStep] = useState<"form" | "vk" | "done">("form");

  const handleSubmit = () => {
    if (!wish.trim()) return;
    setStep("vk");
  };

  const handleVkPost = () => {
    setStep("done");
    setTimeout(() => onSent(), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(6,8,16,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="animate-modal-in w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 relative"
        style={{ border: '1px solid rgba(201,168,76,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: 'rgba(200,210,240,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,210,240,0.4)')}>
          <Icon name="X" size={20} />
        </button>

        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🌠</div>
              <h2 className="font-cormorant text-2xl md:text-3xl mb-1" style={{ color: '#f0e8d0' }}>
                Загадай желание
              </h2>
              <p className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.45)' }}>
                Колодец слушает тебя
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-golos text-xs mb-2 block" style={{ color: 'rgba(201,168,76,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Твоё желание
                </label>
                <textarea
                  value={wish}
                  onChange={e => setWish(e.target.value)}
                  placeholder="Опиши своё желание подробно и искренне..."
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-xl px-4 py-3 font-golos text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: 'rgba(20,25,40,0.8)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    color: '#f0e8d0',
                    caretColor: '#c9a84c',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.2)')}
                />
                <div className="text-right mt-1 font-golos text-xs" style={{ color: 'rgba(200,210,240,0.3)' }}>
                  {wish.length}/300
                </div>
              </div>

              <div>
                <label className="font-golos text-xs mb-2 block" style={{ color: 'rgba(201,168,76,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  История (необязательно)
                </label>
                <textarea
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="Расскажи, почему это желание важно для тебя..."
                  rows={2}
                  maxLength={500}
                  className="w-full rounded-xl px-4 py-3 font-golos text-sm resize-none focus:outline-none transition-all"
                  style={{
                    background: 'rgba(20,25,40,0.8)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: '#f0e8d0',
                    caretColor: '#c9a84c',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.5)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.15)')}
                />
              </div>

              <div>
                <label className="font-golos text-xs mb-3 block" style={{ color: 'rgba(201,168,76,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Размер монетки
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AMOUNTS.map(amount => (
                    <button
                      key={amount.value}
                      onClick={() => setSelectedAmount(amount.value)}
                      className="rounded-xl py-2 px-1 text-center transition-all font-golos"
                      style={{
                        background: selectedAmount === amount.value
                          ? 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))'
                          : 'rgba(20,25,40,0.6)',
                        border: `1px solid ${selectedAmount === amount.value ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.12)'}`,
                        color: selectedAmount === amount.value ? '#c9a84c' : 'rgba(200,210,240,0.55)',
                      }}>
                      <div className="text-sm font-semibold">{amount.label}</div>
                      <div className="text-xs mt-0.5 leading-tight" style={{ color: 'rgba(200,210,240,0.35)', fontSize: '10px' }}>
                        {amount.tier}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!wish.trim()}
                className="w-full py-3 rounded-full font-golos font-semibold text-sm transition-all mt-2"
                style={{
                  background: wish.trim()
                    ? 'linear-gradient(135deg, #c9a84c, #8a6a20)'
                    : 'rgba(201,168,76,0.15)',
                  color: wish.trim() ? '#060810' : 'rgba(200,210,240,0.3)',
                  cursor: wish.trim() ? 'pointer' : 'not-allowed',
                }}>
                Бросить монетку · {AMOUNTS.find(a => a.value === selectedAmount)?.label}
              </button>
            </div>
          </>
        )}

        {step === "vk" && (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📢</div>
            <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#f0e8d0' }}>
              Расскажи миру о мечте
            </h2>
            <p className="font-golos text-sm mb-6 leading-relaxed" style={{ color: 'rgba(200,210,240,0.55)' }}>
              Опубликуй пост ВКонтакте — это обязательное условие. Только публичные мечты зажигают звёзды и исполняются.
            </p>
            <div className="glass-panel rounded-xl p-4 mb-6 text-left"
              style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
              <p className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.7)' }}>
                ✨ Я загадал желание на Загадай Онлайн! Мечтаю: <em style={{ color: '#c9a84c' }}>«{wish}»</em>
                <br /><br />
                Помоги исполниться моей мечте 🌠 zagadai.online #загадайонлайн
              </p>
            </div>
            <button
              onClick={handleVkPost}
              className="w-full py-3 rounded-full font-golos font-semibold text-sm mb-3 transition-all"
              style={{ background: '#0077ff', color: '#fff' }}>
              Опубликовать во ВКонтакте
            </button>
            <p className="font-golos text-xs" style={{ color: 'rgba(200,210,240,0.3)' }}>
              После публикации твоя звезда появится на небосводе
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-appear-star">⭐</div>
            <h2 className="font-cormorant text-2xl mb-3" style={{ color: '#f0e8d0' }}>
              Звезда зажглась!
            </h2>
            <p className="font-golos text-sm" style={{ color: 'rgba(200,210,240,0.55)' }}>
              Твоё желание теперь ждёт своего Ангела на небосводе.
              <br />Мечтай громко — тебя услышат.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
