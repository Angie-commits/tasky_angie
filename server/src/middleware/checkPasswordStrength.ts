import { NextFunction, Request, Response } from "express";
import zxcvbn from "zxcvbn";

export function checkPasswordStrength(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { password } = req.body;
  const strength = zxcvbn(password);

  if (strength.score < 3) {
    res.status(401).send({ message: "please choose a stronger password" });
    return;
  }
  next();
}
