import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../src/constants/types";
import { User } from "../src/entities/user";
import { IConfigService } from "../src/services/config/i-config-service";
import { IUserRepository } from "../src/services/repositories/i-user-repository";
import { IUserService } from "../src/services/user/iuser-service";
import { UserService } from "../src/services/user/user-service";
import { UserModel } from "@prisma/client";

const container = new Container();
let userService: IUserService;
let configService: IConfigService;
let userRepository: IUserRepository;

const configServiceMock: IConfigService = {
	get: jest.fn(),
};
const userRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(configServiceMock);
	container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(userRepositoryMock);

	userService = container.get<IUserService>(TYPES.IUserService);
	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
});

let user: UserModel | null;

describe("User Service", () => {
	it("create user", async () => {
		configService.get = jest.fn().mockReturnValueOnce(1);
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				email: user.email,
				password: user.password,
				name: user.name,
				id: 1,
			}),
		);

		user = await userService.createUser({
			email: "pogon@ya.ru",
			name: "anton",
			password: "qwerty",
		});

		expect(user?.id).toBe(1);
		expect(user?.password).not.toBe("qwerty");
	});

	it("validate user (password)", async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(user);

		const success = await userService.validateUser({ email: "pogon@ya.ru", password: "qwerty" });
		const error = await userService.validateUser({ email: "pogon@ya.ru", password: "aaa" });

		expect(success).toBe(true);
		expect(error).toBe(false);
	});

	it("validate user (user not found)", async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);

		const error = await userService.validateUser({ email: "pogon@ya.ru", password: "qwerty" });

		expect(error).toBe(false);
	});
});
