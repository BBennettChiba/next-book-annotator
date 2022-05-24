import Link from "next/link";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Navbar: FC<Props> = ({ children }) => {
  return (
    <>
      <nav>
        <Link href="/">home</Link>
        <Link href="/books">books</Link>
        <Link href="/login">login</Link>
      </nav>
      {children}
    </>
  );
};
export default Navbar;
