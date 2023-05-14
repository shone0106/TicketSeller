import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { body, validationResult } from "express-validator"

import { authenticate } from "../middlewares/authenticate";
import { Ticket } from "../models/ticket";
// import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publish";
// import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
    "/api/tickets",
    authenticate,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                throw createHttpError(400, "Invalid parameters")
            }

            const { title, price } = req.body;

            const ticket = Ticket.build({
                title,
                price,
                userId: req.user!.id,
            });

            await ticket.save();
            // await new TicketCreatedPublisher(natsWrapper.client).publish({
            //     id: ticket.id,
            //     title: ticket.title,
            //     price: ticket.price,
            //     userId: ticket.userId,
            //     version: ticket.version,
            // });

            res.status(201).send(ticket);
        }
      catch(error){
        next(error)
      }  
    
}
);

export { router as createTicketRoute };