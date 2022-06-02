import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { exec } from "child_process";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @TODO error handling, error handling, error handling 
 */

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(400).json({ err: "Bad Request" });
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (Array.isArray(files)) files = files[0];
    await saveFile(files.file as formidable.File);
    res.unstable_revalidate('/books');
  });
  return res.json({ name: "john doe" });
};

const saveFile = async (file: formidable.File) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./books/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  exec(
    `cd books && ebook-convert "./${file.originalFilename}" .txt --chapter-mark both --inline-toc`,
    (_, __,___ ) => {
      if (fs.existsSync(`./books/${file.originalFilename}`)) {
        exec("cd chapter-break && cargo run");
      }
    }
  );

  return;
};

export default handler;
