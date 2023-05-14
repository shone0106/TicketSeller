import express, { Request, Response, Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get('/api/tickets', authenticate, async (req: Request, res: Response) => {
    const tickets = await Ticket.find({})

    res.status(200).send(tickets)
})


export {router as indexTicketRouter}