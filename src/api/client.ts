import { User } from "@/types";

export interface Client {
    getUsers(): Promise<User[]>
}