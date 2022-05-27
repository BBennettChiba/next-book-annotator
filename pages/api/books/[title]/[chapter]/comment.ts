import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = "cl3nwe8h20000l0i0gnvkbs8l";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { title, chapter } = req.query;
  if (Array.isArray(title)) title = title[0];
  if (Array.isArray(chapter)) chapter = chapter[0];

  if (req.method == "GET") {
    const comments = await prisma.comment.findMany({
      where: {
        title,
        chapter,
      },
    });
    console.log(comments)
    return res.status(200).json(comments);
  }
  if (req.method !== "POST") return;
  const { startIndex, endIndex, startOffset, endOffset, content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content,
      startIndex,
      endIndex,
      title,
      chapter,
      endOffset,
      startOffset,
      user: { connect: { id: userId } },
    },
  });
  res.status(200).json(comment);
};

export default handler;
