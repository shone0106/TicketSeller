import { Express } from "express-serve-static-core";
import { Types } from 'mongoose'

export interface Payload {
    id: string;
    email: string;
}
declare module "express-serve-static-core" {
  interface Request {
    user?: Payload;
  }
}
