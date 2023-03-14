import { IMiddleware } from "./i-middleware";
import { NextFunction, Request, Response } from "express";

export class GuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (!req.user) {
			res.status(401).send("Пользователь не атворизован");
		} else {
			next();
		}
	}
}
