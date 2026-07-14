const STEPS = ["Basics", "Details", "Ingredients", "Instructions", "Review"];

type Props = {
    currentStep: number;
    onGoTo: (step: number) => void;
};

const WizardProgress = ({ currentStep, onGoTo }: Props) => (
    <div className="wz__progress">
        {STEPS.map((label, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
                <div
                    key={i}
                    className={`wz__progress__step${isActive ? " wz__progress__step--active" : ""}${isDone ? " wz__progress__step--done" : ""}`}
                    onClick={() => isDone && onGoTo(i)}
                    title={isDone ? `Go back to ${label}` : undefined}
                >
                    <div className="wz__progress__dot">{isDone ? "✓" : i + 1}</div>
                    <span className="wz__progress__label">{label}</span>
                </div>
            );
        })}
    </div>
);

export default WizardProgress;
