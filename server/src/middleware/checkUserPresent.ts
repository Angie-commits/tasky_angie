import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types";

export function checkUserPresent(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { angietoken } = req.cookies;

  if (!angietoken) {
    res.status(401).send({ message: "Unauthorized login, Please Login!" });
    return;
  }

  jwt.verify(
    angietoken,
    process.env.JWT_SECRET!,
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (
        err ||
        !decoded ||
        typeof decoded !== "object" ||
        !("id" in decoded)
      ) {
        res.status(401).send({ message: "Unauthorized login, Please Login!" });
        return;
      }
      req.user = { id: (decoded as JwtPayload).id } as UserPayload;
      next();
    },
  );
}
