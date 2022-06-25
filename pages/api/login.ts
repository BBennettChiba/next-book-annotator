// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { User, PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
// import z from "zod";
import jwt from "jsonwebtoken";
import nookies from "nookies";
import { getUserBy } from "../../utils/utils";

interface JwtPayload {
  id: User["id"];
}

interface Error {
  error: string;
}

interface Message {
  message: string;
}

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | Error | Message>
) {
  if (req.method === "DELETE") {
    console.log(req.headers);
    nookies.destroy({ res }, "userToken", { path: "/" });
    return res.status(200).json({ message: "logged out" });
  }
  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" });
  }
  const { username, password } = req.body;
  const user = await getUserBy({ username });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ id: user.id }, "secret");
  nookies.set({ res }, "userToken", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.json(user);
}
/**@TODO decide to send user back or just sucess response */
/**@TODO use zod to check request body */
/**@TODO think should I just find user by encrypted password? */
