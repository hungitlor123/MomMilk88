export interface ILoginResponse {
    data: IUser;
    success: boolean;
    errors: string[] | null
}

export interface IUser {
    accessToken: string;
    user: IUserResult;
}

interface IUserResult {
    id: string,
    username: string,
    name: string,
    phone: null,
    role: string,
    status: string,
    createAt: Date,
}
export interface ILogin {
    username: string;
    password: string;
}
export interface IRegister {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface IUserInfo {
    name: string;
    phone: string;
    rank: string,
    id: string,
    status: string,
    address: string,
    createAt: string
}

export interface IChangePassword {
    oldPassword: string,
    newPassword: string,
}

export interface IChangePasswordResponse {
    message: string,
    status: number,
    success: boolean;
    errors: string[] | null
}