type UserPayload = {
  id: string;
};

export declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
