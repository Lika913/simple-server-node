import { ClassConstructor, plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./i-middleware";
import { validate } from "class-validator";

export class ValiidateMiddleware<T> implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance)
			.then((errors) => {
				if (errors.length > 0) {
					res.status(422).send(errors);
				} else {
					next();
				}
			})
			.catch((e) => res.status(401).send("sss"));
	}
}
