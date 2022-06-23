import styles from "../styles/CommentBox.module.css";
export default function CommentBox({ comment }: { comment: any }) {
  return (
    <div className={styles.comment}>
      <div>author: {comment.user.name}</div>
      <div>content: {comment.content}</div>
    </div>
  );
}
