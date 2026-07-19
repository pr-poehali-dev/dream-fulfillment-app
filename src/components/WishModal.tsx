import Icon from "@/components/ui/icon";
import { useWishModal } from "./wish-modal/useWishModal";
import WishFormStep from "./wish-modal/WishFormStep";
import WishPayingStep from "./wish-modal/WishPayingStep";
import WishDoneStep from "./wish-modal/WishDoneStep";

interface Props {
  onClose: () => void;
  onSent: (amount: number, wish: string, x?: number, y?: number) => void;
}

export default function WishModal({ onClose, onSent }: Props) {
  const {
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
    numAmount,
    tier,
    isEmailValid,
    isValid,
    handleAmountInput,
    handleQuick,
    handleSubmit,
    handleCheckStatus,
  } = useWishModal(onSent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,8,16,0.92)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="animate-modal-in w-full max-w-lg glass-panel rounded-3xl p-6 md:p-8 relative"
        style={{
          border: "1px solid rgba(201,168,76,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{
            color: "rgba(200,210,240,0.4)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(200,210,240,0.4)")
          }
        >
          <Icon name="X" size={20} />
        </button>

        {step === "form" && (
          <WishFormStep
            wish={wish}
            setWish={setWish}
            story={story}
            setStory={setStory}
            amountInput={amountInput}
            handleAmountInput={handleAmountInput}
            handleQuick={handleQuick}
            numAmount={numAmount}
            tier={tier}
            email={email}
            setEmail={setEmail}
            isEmailValid={isEmailValid}
            payError={payError}
            isValid={isValid}
            saving={saving}
            user={user}
            handleSubmit={handleSubmit}
          />
        )}

        {step === "paying" && (
          <WishPayingStep
            numAmount={numAmount}
            payError={payError}
            checkingStatus={checkingStatus}
            handleCheckStatus={handleCheckStatus}
            setStep={setStep}
            setPayError={setPayError}
          />
        )}

        {step === "done" && (
          <WishDoneStep tier={tier} numAmount={numAmount} wish={wish} />
        )}
      </div>
    </div>
  );
}
