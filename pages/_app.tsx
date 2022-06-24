import "../styles/globals.css";
import Navbar from "../components/Navbar";
import type { AppProps } from "next/app";
import { UserProvider } from "../hooks/customHooks";
import { NextPageContext } from "next";
import { User } from "@prisma/client";

/**@TODO setup cookies to save user with jwt or something  */

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const { req } = ctx;
  if (!req) return { user: null };
  // if (!userToken) return { user: null };
  // const payload = jwt.decode(userToken);
  // if (typeof payload === "string" || payload === null) return { user: null };
  // if (!("id" in payload)) return { user: null };
  // const { id }: { id: User["id"] } = payload as JwtPayload;
  if (!req.headers.cookie) return { user: null };
  const headers = new Headers();
  headers.set("Cookie", req.headers.cookie);
  const user: User | null = await (
    await fetch("http://localhost:3000/api/user", {
      credentials: "include",
      headers,
    })
  ).json();
  // const token = await jwt.sign({ id: user?.id }, "secret");
  // nookies.set(ctx, "userToken", token, {
  //   maxAge: 30 * 24 * 60 * 60,
  //   path: "/",
  // });
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
