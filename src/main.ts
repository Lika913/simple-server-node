import "reflect-metadata";
import { Container, ContainerModule, interfaces } from "inversify";
import { TYPES } from "./constants/types";
import { App } from "./app";
import { UserController } from "./controllers/user/user_controller";
import { ExeptionFilter } from "./errors/exeption_filter";
import { ILoggerService } from "./services/logger/i-logger_service";
import { LoggerService } from "./services/logger/logger_service";
import { IExeptionFilter } from "./errors/i-exception_filter";
import { IUserController } from "./controllers/user/i-user_controller";
import { IUserService } from "./services/user/iuser-service";
import { UserService } from "./services/user/user-service";
import { ConfigService } from "./services/config/config-service";
import { IConfigService } from "./services/config/i-config-service";
import { PrismaService } from "./services/prisma/prisma-service";
import { UserRepository } from "./services/repositories/user-repository";
import { IUserRepository } from "./services/repositories/i-user-repository";

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.IUserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
});

async function bootstrap(): Promise<{ app: App; appContainer: Container }> {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	await app.init();

	return { appContainer, app };
}

export const boot = bootstrap();
