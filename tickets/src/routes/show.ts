import express, { Request, Response } from "express";
import { authenticate } from "../middlewares/authenticate";
import { body,param } from "express-validator";
import { Ticket } from "../models/ticket";
import createHttpError from "http-errors";

const router = express.Router();

router.get("/api/tickets/:id",[param()], authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw createHttpError(404, 'Not found')
  }

  res.send(ticket)
});

export { router as showTicketRouter };