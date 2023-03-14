import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../services/logger/logger_service";
import { HTTPError } from "./http_error";
import { IExeptionFilter } from "./i-exception_filter";
import { injectable, inject } from "inversify";
import { TYPES } from "../constants/types";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	private readonly logger: LoggerService;

	constructor(@inject(TYPES.ILoggerService) logger: LoggerService) {
		this.logger = logger;
	}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(
				`${err.context ? "[" + err.context + "]" : ""}Ошибка ${err.code}: ${err.message}`,
			);
			res.status(err.code).send({ err: err.message });
		} else {
			this.logger.error(err.message);
			res.status(500).send({ err: err.message });
		}
	}
}
