import fs from "fs";
import { GetStaticProps } from "next";
import Link from "next/link";

type Props = {
  books: string[];
};

const Books = ({ books }: Props) => {
  return (
    <div>
      {books.map((book: string, key: number) => (
        <Link key={key} href={`books/${book}`}>
          {book}
        </Link>
      ))}
    </div>
  );
};
export const getStaticProps: GetStaticProps = () => {
  const books = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return { props: { books } };
};

export default Books;
