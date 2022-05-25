import fs from "fs";
import {
  InferGetStaticPropsType,
  GetStaticPropsContext,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState, useRef } from "react";
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

const Chapter = ({ text }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isCommentBoxOpen, setIsCommonBoxOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const highlighter = useRef(null);
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>;

  function checkHighlight(event: React.MouseEvent<HTMLDivElement>) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      highlighter.current.removeAllHighlights();
      return setIsCommonBoxOpen(false);
    }
    if (isCommentBoxOpen && window.getSelection()?.toString() === "") {
      return;
    }

    insert();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsCommonBoxOpen(true);
  }
  React.useEffect(() => {
    highlighter.current = rangy.createHighlighter();
    highlighter.current.addClassApplier(rangy.createClassApplier("highlight"));
  }, []);

  function insert() {
    highlighter.current.highlightSelection("highlight");
  }

  return (
    <div className="content" onMouseUp={checkHighlight}>
      {text.split("\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {isCommentBoxOpen && <CommentBox innerRef={ref} position={position} />}
    </div>
  );
};

export default Chapter;
