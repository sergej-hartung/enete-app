import { UserStatus } from "./user-status";

export interface UserLogin {
    id: number;
    login_name: string;
    role_id: number;
    status: UserStatus;
}
