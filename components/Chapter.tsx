import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import CommentBox from "./CommentBox";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import Highlight from "./Highlight";

type Props = {
  text: Text[];
};
type Text = { text: string; comment?: Comment };
type Comment = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  chapter: number;
  startIndex: number;
  endIndex: number;
  startOffset: number;
  endOffset: number;
};

const Chapter = ({ text }: Props) => {
  const router = useRouter();
  const [isCommentBoxOpen, setIsCommonBoxOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const highlighter = useRef<Highlighter | null>(null);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [selectionData, setSelectionData] = useState<Selection>({
    startIndex: 0,
    endIndex: 0,
    startOffset: 0,
    endOffset: 0,
  });

  function checkHighlight(event: React.MouseEvent<HTMLDivElement>) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      highlighter.current?.removeAllHighlights();
      return setIsCommonBoxOpen(false);
    }
    if (isCommentBoxOpen || window.getSelection()?.toString() === "") {
      return;
    }
    createSelection();
    insert();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsCommonBoxOpen(true);
  }

  function createSelection() {
    const range = window.getSelection();
    if (!range) return;
    const startIndex = Number(
      range.anchorNode?.parentElement?.getAttribute("id")
    );
    if (!startIndex) return;
    const endIndex = Number(range.focusNode?.parentElement?.getAttribute("id"));
    if (!endIndex) return;
    const startOffset = range.anchorOffset;
    const endOffset = range.focusOffset;
    setSelectionData({
      startIndex,
      endIndex,
      startOffset,
      endOffset,
    });
  }

  useEffect(() => {
    highlighter.current = rangy.createHighlighter();
    highlighter.current.addClassApplier(rangy.createClassApplier("highlight"));
  }, []);

  function insert() {
    highlighter.current?.highlightSelection("highlight");
  }

  async function submit(content: string) {
    fetch(`/api/books/${router.query.title}/${router.query.chapter}/comment`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...selectionData, content }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
    setIsCommonBoxOpen(false);
  }
  /**
   *
   * @TODO fix multiple comments in one paragraph
   */
  function addHighlight(paragraph: Required<Text>) {
    const start = paragraph.comment.startOffset;
    const endOffset = paragraph.comment.endOffset;

    const [splitTextA, splitTextB, splitTextC] = [
      paragraph.text.slice(0, start),
      paragraph.text.slice(start, endOffset),
      paragraph.text.slice(endOffset),
    ];
    console.log(splitTextA, splitTextB);
    return (
      <>
        {splitTextA}
        <Highlight text={splitTextB} />
        {splitTextC}
      </>
    );
  }

  function addMultipleParagaphHighlight(paragraphs: [Required<Text>, Text], output:JSX.Element[] ) {
    const firstComment = paragraphs[0].comment;
    const startIndex = firstComment.startIndex;
    const startOffset = firstComment.startOffset;
    const endIndex = firstComment.endIndex;
    const endOffset = firstComment.endOffset;
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      const isFirst = i === 0;
      const isLast = i === paragraphs.length - 1;
      const text = paragraph.text;
      if (isFirst) {
        const [noHighlight, highlighted] = [
          text.slice(0, startOffset),
          text.slice(startOffset),
        ];
        output.push(
          <p key={startIndex} id={startIndex.toString()}>
            {noHighlight}
            <Highlight text={highlighted} />
          </p>
        );
      } else if (isLast) {
        const [highlight, noHighlight] = [
          text.slice(0, endOffset),
          text.slice(endOffset),
        ];
        output.push(
          <p key={endIndex} id={endIndex.toString()}>
            <Highlight text={highlight} />
            {noHighlight}
          </p>
        );
      } else {
        output.push(
          <p key={startIndex + i} id={(startIndex + 1).toString()}>
            <Highlight text={text} />
          </p>
        );
      }
    }
  }

  /**
   * @TODO output tabs correctly
   * @TODO on hover change color entire comment
   * @todo on click of highlighted area see comment and metadata
   * @todo make submit prettier
   * @todo fix click issues
   * @todo allow for multiple comments on one paragraph
   */

  function addText(textToParse: typeof text) {
    const hasComment = (paragraph: Text): paragraph is Required<Text> =>
      "comment" in paragraph;
    const output: JSX.Element[] = [];
    for (let i = 0; i < textToParse.length; i++) {
      const paragraph = textToParse[i];
      const paragraphHasComment = hasComment(paragraph);
      if (!paragraphHasComment) {
        output.push(
          <p key={i} id={i.toString()}>
            {paragraph.text}
          </p>
        );
        continue;
      }
      const commentInOneParagraph =
        paragraph.comment.startIndex === paragraph.comment.endIndex;
      if (commentInOneParagraph) {
        output.push(
          <p key={i} id={i.toString()}>
            {addHighlight(paragraph)}
          </p>
        );
        continue;
      }
      const numberOfParagraphs =
        paragraph.comment.endIndex - paragraph.comment.startIndex + 1;
      const paragraphs  = textToParse.slice(
        i,
        i + numberOfParagraphs
      );
      addMultipleParagaphHighlight(paragraphs as [Required<Text>, Text], output);
      i += numberOfParagraphs; -1;
    }
    return output;
  }

  return (
    <>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <div className="content" onMouseUp={checkHighlight}>
        {addText(text)}
        {isCommentBoxOpen && (
          <CommentBox submit={submit} innerRef={ref} position={position} />
        )}
      </div>
    </>
  );
};

declare global {
  interface Node {
    data: string;
  }
  interface RangyStatic {
    createHighlighter(): Highlighter;
    createClassApplier(className: string): ClassApplier;
  }
  interface Highlighter {
    highlightSelection(className: string): void;
    removeAllHighlights(): void;
    addClassApplier(applier: ClassApplier): void;
  }
  interface ClassApplier {
    addClass(element: Element, className: string): void;
  }
}
type Selection = {
  startIndex: number;
  endIndex: number;
  startOffset: number;
  endOffset: number;
};
export default Chapter;
