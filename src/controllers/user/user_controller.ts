import { NextFunction, Request, Response } from "express";
import { BaseController } from "../base/base_controller";
import { IControllerRoute } from "../base/i-controller_route";
import { injectable, inject } from "inversify";
import { TYPES } from "../../constants/types";
import { ILoggerService } from "../../services/logger/i-logger_service";
import { IUserController } from "./i-user_controller";
import { UserLoginDTO } from "./dto/user-login-dto";
import { UserRegisterDTO } from "./dto/user-register-dto";
import { UserService } from "../../services/user/user-service";
import { ValiidateMiddleware } from "../base/middleweares/validate-middleware";
import { HTTPError } from "../../errors/http_error";
import { sign } from "jsonwebtoken";
import { IConfigService } from "../../services/config/i-config-service";
import { GuardMiddleware } from "../base/middleweares/guard-middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILoggerService) logger: ILoggerService,
		@inject(TYPES.IUserService) private userService: UserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(logger);

		const routes: IControllerRoute[] = [
			{
				path: "/login",
				method: "post",
				func: this.login,
			},
			{
				path: "/register",
				method: "post",
				func: this.register,
				middlewares: [new ValiidateMiddleware(UserRegisterDTO)],
			},
			{
				path: "/info",
				method: "get",
				func: this.info,
				middlewares: [new GuardMiddleware()],
			},
		];
		this.bind(routes);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const validateResult = await this.userService.validateUser(body);
		if (!validateResult) {
			this.send(res, 401, "Неверно указан логин или пароль");
			return;
		}

		const secret = this.configService.get("SECRET");
		const jwt = await this.signJWT(body.email, secret);
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser(body);
		if (!user) {
			this.send(res, 422, "Такой пользователь уже существует");
			return;
		}

		this.ok(res, { id: user.id, email: user.email });
	}

	async info(
		req: Request<{}, {}, UserRegisterDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.getUser(req.user);
		this.ok(res, { email: user?.email, id: user?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: "HS256" },
				(err, token) => {
					if (err) {
						reject(err);
					} else {
						resolve(token as string);
					}
				},
			);
		});
	}
}
