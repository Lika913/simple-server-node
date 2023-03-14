import { UserLoginDTO } from "../../controllers/user/dto/user-login-dto";
import { UserRegisterDTO } from "../../controllers/user/dto/user-register-dto";
import { UserModel } from "@prisma/client";

export interface IUserService {
	createUser: (dto: UserRegisterDTO) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDTO) => Promise<boolean>;
	getUser: (email: string) => Promise<UserModel | null>;
}
