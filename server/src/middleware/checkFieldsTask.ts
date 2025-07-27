import { Request, Response, NextFunction } from "express";

export function checkFieldsTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { title, description } = req.body;
  if (!title) {
    res.status(400).send({ message: "title is required" });
    return;
  }
  if (!description) {
    res.status(400).send({ message: "description is required " });
    return;
  }
  next();
}
