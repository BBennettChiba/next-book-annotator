import React from "react";
import fs from "fs";
import { GetStaticProps, GetStaticPaths } from "next";

type Props = {
  text: string;
};

const Chapter = ({ text }: Props) => {
  return <div>{text}</div>;
};

/**@TODO figure out how to not have to ! this */
export const getStaticProps: GetStaticProps = (props) => {
  //get title of book and chapter from props and return the text in props
  const { title, chapter } = props.params!;
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
export default Chapter;
