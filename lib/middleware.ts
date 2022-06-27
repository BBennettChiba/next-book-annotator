import { getUserBy, getUserToken, getUserIdFromToken } from "./utils";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";

declare module "next" {
  interface NextApiRequest {
    user?: User;
  }
}

export const getUserMiddleware =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userToken = getUserToken(req);
    if (!userToken) return handler(req, res);
    const userId = getUserIdFromToken(userToken);
    if (!userId) return handler(req, res); 
    const user = await getUserBy({ id: userId });
    if (!user) return handler(req, res); 
    req.user = user;
    return handler(req, res);
  };
