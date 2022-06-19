import { useState } from "react";
import CommentBox from "./CommentBox";

/**
 * @TODO add real highlighting for hover
 * @TODO add click to show
 */
export default function Highlight({
  text,
  comment,
}: {
  text: string;
  comment: any;
}) {
  const [commentBoxIsOpen, setCommentBoxIsOpen] = useState(false);

  /**@todo figure out how to get fixed div insside p tag without errors */
  return (
    <>
      <span onClick={() => setCommentBoxIsOpen(true)} className="highlight">
        {text}
      </span>
      {commentBoxIsOpen && <CommentBox comment={comment} />}
    </>
  );
}
