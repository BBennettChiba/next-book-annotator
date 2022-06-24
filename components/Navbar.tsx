import Link from "next/link";
import { FC, ReactNode } from "react";
import { useUser } from "../hooks/customHooks";
interface Props {
  children: ReactNode;
}

const Navbar: FC<Props> = ({ children }) => {
  const { user } = useUser();
  return (
    <>
      <nav className="mt-2 mr-auto mb-20 pt-2 flex justify-end items-end border-b-2 border-b-gray-400">
        <Link href="/">home</Link>
        {user && (
          <Link href="/books">
            <a className="ml-3">books</a>
          </Link>
        )}
        {!user && (
          <Link href="/login">
            <a className="ml-3">login</a>
          </Link>
        )}
        {user && (
          <Link href="/upload">
            <a className="ml-3">upload</a>
          </Link>
        )}
        {!user && (
          <Link href="/signup">
            <a className="ml-3">signup</a>
          </Link>
        )}
      </nav>
      {children}
    </>
  );
};
export default Navbar;
