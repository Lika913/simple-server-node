import { Logger } from "tslog";
import { injectable } from "inversify";
import { ILoggerService } from "./i-logger_service";

@injectable()
export class LoggerService implements ILoggerService {
	private readonly logger;

	constructor() {
		this.logger = new Logger();
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
