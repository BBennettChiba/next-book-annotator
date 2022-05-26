import type { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return;
  const { title, chapter } = req.query;
  const { startIndex, endIndex, startOffset, endOffset, comment } = req.body;
  res.status(200).json({
    title,
    chapter,
    startIndex,
    endIndex,
    startOffset,
    endOffset,
    comment,
  });
};
export default handler;
