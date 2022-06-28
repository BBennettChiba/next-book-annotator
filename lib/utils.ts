import nookies from "nookies";
import { NextApiRequest } from "next";
import { User, Comment } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/db";

interface Payload extends JwtPayload {
  id: User["id"];
}

export const getUserToken = (req: NextApiRequest) => {
  const { userToken } = nookies.get({ req });
  return userToken;
};

export const getUserIdFromToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, "secret");
    return (decoded as Payload).id;
  } catch {
    return null;
  }
};

type UniqueUserField = Partial<Pick<User, "username" | "email" | "id">>;

export const getUserBy = async (obj: UniqueUserField) => {
  return await prisma.user.findFirst({
    where: obj,
  });
};

type CommentFields = Partial<
  Pick<Comment, "title" | "chapter" | "id" | "userId">
>;

export const getCommentsBy = async (obj: CommentFields) => {
  return await prisma.comment.findMany({
    where: obj,
    include: {
      user: true,
    },
  });
};
