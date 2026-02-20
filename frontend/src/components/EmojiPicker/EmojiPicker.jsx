import { useEffect, useRef } from "react";
import styles from "./EmojiPicker.module.css";

const EMOJI_LIST = [
  "👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🙏",
  "🔥", "👏", "✅", "❌", "😊", "🎉", "💯", "✨",
  "🤔", "👀", "💪", "🙌", "😍", "🥳", "😎", "🤝"
];

const EmojiPicker = ({ onSelect, onClose, position = "above", anchorRef }) => {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={pickerRef}
      className={`${styles.picker} ${position === "above" ? styles.above : styles.below}`}
      role="listbox"
      aria-label="Pick an emoji"
    >
      <div className={styles.grid}>
        {EMOJI_LIST.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className={styles.emojiBtn}
            onClick={() => onSelect(emoji)}
            aria-label={`Emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
export { EMOJI_LIST };
