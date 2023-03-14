import { inject, injectable } from "inversify";
import { IConfigService } from "../config/i-config-service";
import { TYPES } from "../../constants/types";
import { UserLoginDTO } from "../../controllers/user/dto/user-login-dto";
import { UserRegisterDTO } from "../../controllers/user/dto/user-register-dto";
import { User } from "../../entities/user";
import { IUserService } from "./iuser-service";
import { IUserRepository } from "../repositories/i-user-repository";
import { UserModel } from "@prisma/client";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IUserRepository) private userRepository: IUserRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDTO): Promise<UserModel | null> {
		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}

		const user = new User(name, email);

		const salt = this.configService.get("SALT");
		await user.setPassword(password, Number(salt));

		return await this.userRepository.create(user);
	}

	async validateUser({ email, password }: UserLoginDTO): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}

		const user = new User(existedUser.name, existedUser.email, existedUser.password);
		return user.passwordIsCorrect(password);
	}

	getUser(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
