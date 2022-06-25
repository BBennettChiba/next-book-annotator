import nookies from "nookies";
import { NextApiRequest } from "next";
import { PrismaClient, User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { decode } from "punycode";

interface Payload extends JwtPayload {
  id: User["id"];
}

const prisma = new PrismaClient();
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
