import Link from "next/link";
import { FC, ReactNode } from "react";
import { useUser } from "../hooks/customHooks";
interface Props {
  children: ReactNode;
}

const Navbar: FC<Props> = ({ children }) => {
  const { user } = useUser();
  console.log(user);
  return (
    <>
      <nav>
        <Link href="/">home</Link>
        {user && <Link href="/books">books</Link>}
        {!user && <Link href="/login">login</Link>}
        {user && <Link href="/upload">upload</Link>}
        {!user && <Link href="/signup">signup</Link>}
      </nav>
      {children}
    </>
  );
};
export default Navbar;
