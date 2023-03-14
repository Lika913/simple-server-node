import { PrismaClient, UserModel } from "@prisma/client";
import { injectable, inject } from "inversify";
import { TYPES } from "../../constants/types";
import { ILoggerService } from "../logger/i-logger_service";

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log("[PrismaService] Успешное подключение к БД");
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error("[PrismaService] Ошибка подключения к БД: " + error?.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
