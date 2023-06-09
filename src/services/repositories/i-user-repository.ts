import { User } from "../../entities/user";
import { UserModel } from "@prisma/client";

export interface IUserRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
