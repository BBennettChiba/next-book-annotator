import fs from "fs";
import {
  InferGetStaticPropsType,
  GetStaticPropsContext,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import CommentBox from "../../../components/CommentBox";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-highlighter";

interface Params extends ParsedUrlQuery {
  title: string;
  chapter: string;
}

export const getStaticProps = async (
  context: GetStaticPropsContext<Params>
) => {
  const { title, chapter } = context.params!;
  const text = fs.readFileSync(`./books/${title}/${chapter}.txt`, "utf8");
  return { props: { text } };
};

export const getStaticPaths: GetStaticPaths = () => {
  const books = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
  const paths: { params: { title: string; chapter: string } }[] = [];
  books.forEach((title) => {
    const chapters = fs.readdirSync(`./books/${title}/`);
    chapters.forEach((chapter) => {
      paths.push({ params: { title, chapter } });
    });
  });
  return {
    paths,
    fallback: "blocking",
  };
};

/**
 *
 * @TODO,
 *  setup prisma
 *  have prisma accept saving comments and highlights
 *
 * send comments with props on initial load.
 * in useEffect check document and add highlight classes to commented area
 */
const Chapter = ({ text }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
    if (isCommentBoxOpen && window.getSelection()?.toString() === "") {
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

  async function submit(comment: string) {
    // console.log(router);
    fetch(`/api/books/${router.query.title}/${router.query.chapter}/comment`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...selectionData, comment }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  return (
    <div className="content" onMouseUp={checkHighlight}>
      {text.split("\n").map((paragraph, i) => (
        <p key={i} id={i.toString()}>
          {paragraph}
        </p>
      ))}
      {isCommentBoxOpen && (
        <CommentBox submit={submit} innerRef={ref} position={position} />
      )}
    </div>
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
