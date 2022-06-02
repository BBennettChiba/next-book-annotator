import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import CommentBox from "./CommentBox";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";
import Highlight from './Highlight'

type Props = {
    text: { text: string; comment?: any }[];
}

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

  function addHighlight(paragraph: typeof text[number]) {
    const start = paragraph.comment.startoffset;
    const [splitTextA, splitTextB] = [
      paragraph.text.slice(0, start),
      paragraph.text.slice(start),
    ];
    return (
      <>
        {splitTextA}
        <Highlight text={splitTextB}/>
      </>
    );
  }

  function addMultipleParagaphHighlight(
    paragraphs: typeof text[number][],
    output: any[]
  ) {
      console.log(paragraphs);
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
            <Highlight text={highlighted}/>
          </p>
        );
      } else if (isLast) {
        const [highlight, noHighlight] = [
          text.slice(0, endOffset),
          text.slice(endOffset),
        ];
        output.push(
          <p key={endIndex} id={endIndex.toString()}>
            <Highlight text={highlight}/>
            {noHighlight}
          </p>
        );
      } else {
        output.push(
          <p key={startIndex + i} id={(startIndex + 1).toString()}>
            <Highlight text={text}/>
          </p>
        );
      }
    }
  }

  /**
   * @TODO output tabs correctly
   * @TODO on hover change color
   * @todo on click of highlighted area see comment and metadata
   * @todo make submit prettier
   * @todo fix click issues
   */

  function addText(textToParse: typeof text) {
    const output = [];
    for (let i = 0; i < textToParse.length; i++) {
      const paragraph = textToParse[i];
      const paragraphHasComment = "comment" in paragraph;
      const commentInOneParagraph =
        paragraph?.comment?.startIndex === paragraph?.comment?.endIndex;
      if (paragraphHasComment && commentInOneParagraph) {
        output.push(
          <p key={i} id={i.toString()}>
            {addHighlight(paragraph)}
          </p>
        );
      }
      if (paragraphHasComment && !commentInOneParagraph) {
        const numberOfParagraphs =
          paragraph.comment.endIndex - paragraph.comment.startIndex + 1;
        const paragraphs = [];
        for (let n = 0; n < numberOfParagraphs; n++) {
          paragraphs.push(textToParse[i + n]);
        }
        addMultipleParagaphHighlight(paragraphs, output);
        i += numberOfParagraphs - 1;
      }
      if (!paragraphHasComment) {
        output.push(
          <p key={i} id={i.toString()}>
            {paragraph.text}
          </p>
        );
      }
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
