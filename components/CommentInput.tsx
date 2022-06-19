import { useState } from "react";
import styles from "../styles/CommentInput.module.css";

type Props = {
  position: { x: number; y: number };
  innerRef: React.MutableRefObject<HTMLDivElement>;
  submit: (comment: string) => void;
};

export default function CommentBox({ position, innerRef, submit }: Props) {
  const [text, setText] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.currentTarget.value);
  }

  return (
    <div ref={innerRef}>
      <div
        className={styles.container}
        style={{ top: position.y, left: position.x }}
      >
        <div>Please input your comment</div>
        <textarea
          className={styles.text}
          value={text}
          onChange={handleInput}
        ></textarea>
        <button onClick={() => submit(text)} className={styles.button}>
          Submit
        </button>
      </div>
    </div>
  );
}
