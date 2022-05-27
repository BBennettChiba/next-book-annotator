// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

type Data = Awaited<ReturnType<typeof prisma.user.create>> | { error: string };

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") return;
  const { name, email } = req.body;
  let { password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Invalid name or email or password" });
  }
  password = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password } });
  return res.json(user);
}
