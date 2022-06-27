import fs from "fs";
import path from "path";
import {
  InferGetStaticPropsType,
  GetStaticPropsContext,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";
import Chapter from "../../../components/Chapter";
import { server } from "../../../config";
import axios from "axios";
import { Comment } from "@prisma/client";

/**
 * maybe modulize things to make it smaller and easier.
 */

interface Params extends ParsedUrlQuery {
  title: string;
  chapter: string;
}

export const getStaticProps = async (
  context: GetStaticPropsContext<Params>
) => {
  const { title, chapter } = context.params!;
  let text: { text: string; comment?: any }[] = fs
    .readFileSync(path.join(`./books/${title}/${chapter}.txt`), "utf8")
    .split("\n")
    .map((v) => ({ text: v }));
  try {
    const { data: comments } = await axios.get(
      `${server}/api/books/${title}/${chapter}/comment`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    for (const comment of comments) {
      const i = comment.startIndex;
      text[i] = { ...text[i], comment };
    }
    return { props: { text } };
  } catch (e) {
    console.log(e);
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  const books = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
  const paths: { params: { title: string; chapter: string } }[] = [];
  books.forEach((title) => {
    const chapters = fs.readdirSync(path.join(`./books/${title}/`));
    chapters.forEach((chapter) => {
      paths.push({ params: { title, chapter: chapter.replace(".txt", "") } });
    });
  });
  return {
    paths,
    fallback: "blocking",
  };
};

const Index = ({ text }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <Chapter text={text} />;
};

export default Index;
