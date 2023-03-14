import { compare, hash } from "bcryptjs";

export class User {
	private readonly _name: string;
	private readonly _email: string;
	private _password: string;

	constructor(name: string, email: string, passwordHash?: string) {
		this._email = email;
		this._name = name;
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}

	async passwordIsCorrect(password: string): Promise<boolean> {
		return await compare(password, this._password);
	}

	get name(): string {
		return this._name;
	}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}
}
