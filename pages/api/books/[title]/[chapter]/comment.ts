import type { NextApiRequest, NextApiResponse } from "next";
import { getUserMiddleware } from "../../../../../lib/middleware";
import { prisma } from "../../../../../lib/db";
import { getCommentsBy } from "../../../../../lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { title, chapter } = req.query;
  if (Array.isArray(title)) title = title[0];
  if (Array.isArray(chapter)) chapter = chapter[0];

  if (req.method == "GET") {
    const comments = await getCommentsBy({ title, chapter });
    return res.status(200).json(comments);
  }

  if (req.method !== "POST") return;
  if (!req.user) return res.status(404).json({ error: "User not found" });
  const { id } = req.user;

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
      user: { connect: { id } },
    },
  });
  res.unstable_revalidate(`/books/${title}/${chapter}`);
  res.status(200).json(comment);
};

export default getUserMiddleware(handler);
