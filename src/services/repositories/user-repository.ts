import { inject, injectable } from "inversify";
import { TYPES } from "../../constants/types";
import { User } from "../../entities/user";
import { PrismaService } from "../prisma/prisma-service";
import { IUserRepository } from "./i-user-repository";
import { UserModel } from "@prisma/client";

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
