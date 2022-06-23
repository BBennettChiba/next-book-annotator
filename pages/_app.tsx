import "../styles/globals.css";
import Navbar from "../components/Navbar";
import type { AppProps } from "next/app";
import { UserProvider } from "../hooks/customHooks";
import { NextPageContext } from "next";
import { User, PrismaClient } from "@prisma/client";

/**@TODO setup cookies to save user with jwt or something  */

MyApp.getInitialProps = async (ctx: NextPageContext) => {
  const prisma = new PrismaClient();
  // const user = await prisma.user.findFirst({ where: { username: "Bennett" } });
  const user = null;
  return { user };
};

type CustomAppProps = AppProps &
  Awaited<ReturnType<typeof MyApp.getInitialProps>>;

function MyApp({ Component, pageProps, user }: CustomAppProps) {
  return (
    <UserProvider user={user}>
      <Navbar>
        <Component {...pageProps} />
      </Navbar>
    </UserProvider>
  );
}

export default MyApp;
