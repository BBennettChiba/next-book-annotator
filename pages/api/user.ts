// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import z from "zod";

type Data = Awaited<ReturnType<typeof prisma.user.create>> | { error: string };

const prisma = new PrismaClient();

const newUserData = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
  })
  .strict();

// type NewUserSchema = z.infer<typeof newUserData>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") return;
  let username, password, email;
  try {
    ({ username, email, password } = newUserData.parse(req.body));
    console.log(username, email, password);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ error: e.message });
    }
    return res.status(400).json({ error: "something went wrong" });
  }

  const bcryptedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: bcryptedPassword },
  });
  return res.json(user);
}
