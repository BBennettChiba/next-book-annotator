import "../styles/globals.css";
import Navbar from "../components/Navbar";
import type { AppProps } from "next/app";
import { UserProvider } from "../hooks/customHooks";
import { NextPageContext } from "next";
import { User } from "@prisma/client";

/**@TODO middleware on routes to disallow people not logged in*/

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const { req } = ctx;
  if (!req) return { user: null };
  if (!req.headers.cookie) return { user: null };
  const headers = new Headers();
  headers.set("Cookie", req.headers.cookie);
  const res = await await fetch("http://localhost:3000/api/user", {
    credentials: "include",
    headers,
  });
  const user = res.status === 200 ? await res.json() : null;
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
