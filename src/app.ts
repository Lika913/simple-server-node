import express, { Express } from "express";
import { Server } from "http";
import { UserController } from "./controllers/user/user_controller";
import { IExeptionFilter } from "./errors/i-exception_filter";
import { ILoggerService } from "./services/logger/i-logger_service";
import { injectable, inject } from "inversify";
import { TYPES } from "./constants/types";
import { json } from "body-parser";
import { IConfigService } from "./services/config/i-config-service";
import { PrismaService } from "./services/prisma/prisma-service";
import { AuthMiddleware } from "./controllers/base/middleweares/auth-middleware";

@injectable()
export class App {
	app: Express;
	private port: number;
	private server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExeptionFilter) private exceptionFilter: IExeptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 7777;
		this.logger = logger;
		this.userController = userController;
		this.exceptionFilter = exceptionFilter;
	}

	private initMiddleware = (): void => {
		const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));

		this.app.use(json());
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	};

	private initRouters = (): void => {
		this.app.use("/users", this.userController.router);
	};

	private initExeptionFilters = (): void => {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	};

	init = async (): Promise<void> => {
		this.initMiddleware();
		this.initRouters();
		this.initExeptionFilters();

		await this.prismaService.connect();

		this.server = this.app.listen(this.port, () => this.logger.log("Сервер запущен"));
	};

	close(): void {
		this.server.close();
	}
}
