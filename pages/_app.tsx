import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../hooks/customHooks";
import { NextApiRequest, NextPageContext } from "next";
import NotAuthed from "../components/NotAuthed";

/**@TODO middleware on routes to disallow people not logged in*/

type CustomAppProps = AppProps &
  Awaited<ReturnType<typeof MyApp.getInitialProps>> & {
    Component: { isProtected: boolean | undefined };
  };

function MyApp({ Component, pageProps, user }: CustomAppProps) {
  const isProtected = !!Component.isProtected;
  return (
    <UserProvider user={user}>
      {isProtected && user === null ? (
        <NotAuthed />
      ) : (
        <Component {...pageProps} />
      )}
    </UserProvider>
  );
}

export default MyApp;

MyApp.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const { req } = ctx;
  if (!req) return { user: null };
  if (!req.headers.cookie) return { user: null };
  const { getUserToken, getUserIdFromToken, getUserBy } = await import(
    "../lib/utils"
  );
  const token = getUserToken(req as NextApiRequest);
  const id = getUserIdFromToken(token);
  if (!id) return { user: null };
  const user = await getUserBy({ id });
  return { user };
};
