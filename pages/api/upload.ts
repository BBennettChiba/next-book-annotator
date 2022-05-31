import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";

import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(400).json({ err: "Bad Request" });
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(files);
    //@ts-ignore
    await saveFile(files.file);
    //return res.status(200).json({ name: "John Doe" });
  });
  return res.json({ name: "john doe" });
};

const saveFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./books/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return;
};

export default handler;
