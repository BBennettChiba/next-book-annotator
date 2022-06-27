// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { User, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import z from "zod";
import { getUserBy, getUserIdFromToken, getUserToken } from "../../lib/utils";
import { prisma } from "../../lib/db";

type Data =
  | Awaited<ReturnType<typeof prisma.user.create>>
  | { error: z.ZodIssue[] | string }
  | User;

const newUserData = z
  .object({
    email: z.string().email(),
    confirmEmail: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    username: z.string().min(3),
  })
  .strict()
  .refine(({ email, confirmEmail }) => email === confirmEmail, {
    message: "Email and confirm email must match",
    path: ["confirmEmail"],
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords must match",
    path: ["password"],
  });

// type NewUserSchema = z.infer<typeof newUserData>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const token = getUserToken(req);
    const id = getUserIdFromToken(token);
    if (!id) {
      return res
        .status(401)
        .json({ error: "Invalid token, please login again" });
    }
    const user = await getUserBy({ id });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  }
  if (req.method !== "POST") return;
  let username, password, email;
  try {
    ({ username, email, password } = newUserData.parse(req.body));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.issues });
    }
    return res.status(400).json({ error: "something went wrong" });
  }

  const bcryptedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, email, password: bcryptedPassword },
    });
    return res.json(user);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: e.message });
    }
    return res.status(400).json({ error: "something went wrong" });
  }
}
