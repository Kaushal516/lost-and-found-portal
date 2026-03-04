import styles from "./StatusTimeline.module.css";
import { Check } from "lucide-react";

const StatusTimeline = ({ steps, currentStepIndex }) => {
    return (
        <div className={styles.timelineContainer}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;

                return (
                    <div
                        key={index}
                        className={`
              ${styles.stepWrapper} 
              ${isCompleted ? styles.completed : ""} 
              ${isActive ? styles.active : ""}
            `}
                    >
                        <div className={styles.circle}>
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : (index + 1)}
                        </div>

                        <div className={styles.label}>{step}</div>

                        {/* Line connecting to the next step */}
                        {index < steps.length - 1 && (
                            <div className={`${styles.line} ${isCompleted ? styles.lineCompleted : ""}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default StatusTimeline;
