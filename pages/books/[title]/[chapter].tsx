import fs from "fs";
import {
  InferGetStaticPropsType,
  GetStaticPropsContext,
  GetStaticPaths,
} from "next";
import { ParsedUrlQuery } from "querystring";

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
  return (
    <div className="content">
      {text.split("\n").map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
};

export default Chapter;
