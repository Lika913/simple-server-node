import { config, DotenvConfigOutput, DotenvParseOutput } from "dotenv";
import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/types";
import { ILoggerService } from "../logger/i-logger_service";
import { IConfigService } from "./i-config-service";

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error("[ConfigService] Не удалось прочитать файл .env или он отсутствует");
		} else {
			this.logger.log("[ConfigService] Успешно прочитан файл .env");
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
