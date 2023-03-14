import { Response, Router } from "express";
import { ILoggerService } from "../../services/logger/i-logger_service";
import { ExpressReturnType, IControllerRoute } from "./i-controller_route";
import { injectable } from "inversify";

@injectable()
export abstract class BaseController {
	private readonly _router;
	private logger;

	constructor(logger: ILoggerService) {
		this.logger = logger;
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	send<T>(res: Response, code: number, message?: T): ExpressReturnType {
		res.type("application/json");
		return res.status(code).send(message ?? "ok");
	}

	ok<T>(res: Response, message?: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	protected bind(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);

			const handler = route.func.bind(this);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(this));

			this.router[route.method](route.path, middlewares ? [...middlewares, handler] : handler);
		}
	}
}
