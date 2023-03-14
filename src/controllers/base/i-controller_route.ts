import { NextFunction, Request, Response } from "express";
import { IMiddleware } from "./middleweares/i-middleware";

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: "get" | "post" | "delete" | "patch" | "put";
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
