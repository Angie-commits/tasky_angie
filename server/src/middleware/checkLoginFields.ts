import { NextFunction, Request, Response } from "express";

export function checkLoginFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send({ message: "email is required" });
    return;
  }
  if (!password) {
    res.status(400).send({ message: "password is required" });
    return;
  }
  next();
}
