import fs from "fs";
import path from 'path'
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

type Props = {
  chapters: string[];
};
const Title = ({ chapters }: Props) => {
  const router = useRouter();
  console.log()
  
  return (
    <div>
      {chapters.map((chap: any, key: number) => (
        <li key={key}>
          <Link
            passHref
            href={`/books/${router.query.title!}/${encodeURIComponent(chap)}`}
          >
            {chap}
          </Link>
        </li>
      ))}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const files = fs
    .readdirSync("./books/", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({ params: { title: dirent.name } }));
  return { paths: files, fallback: false };
};

export const getStaticProps: GetStaticProps = (context) => {
  const chapters = fs.readdirSync(path.join(`./books/${context.params!.title}`)).map((chapter) => chapter.replace(".txt", "")).sort((a,b) => Number(a) - Number(b)); ;
  return { props: { chapters } };
};

export default Title;