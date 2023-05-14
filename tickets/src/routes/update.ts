import express, { NextFunction, Request, Response } from "express";
import { authenticate } from "../middlewares/authenticate";
import { body, validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Ticket } from "../models/ticket";
// import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
// import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
    "/api/tickets/:id",
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

            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                throw createHttpError(400, 'cannot find ticket')
            }

            if (ticket.orderId) {
                throw createHttpError(400,'Ticket is reserved');
            }

            if (ticket.userId !== req.user!.id) {
                throw createHttpError(409, 'Not autherized');
            }

            ticket.set({
                title,
                price,
            });

            await ticket.save();

            // new TicketUpdatedPublisher(natsWrapper.client).publish({
            //     id: ticket.id,
            //     title: ticket.title,
            //     price: ticket.price,
            //     userId: ticket.userId,
            //     version: ticket.version
            // });

            res.send(ticket);
        }
        catch (error) {
            next(error)
        }

    }
);

export { router as updateTicketRouter };