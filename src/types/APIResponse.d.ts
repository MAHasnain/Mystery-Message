import { Message } from "./schema";

export interface APIResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?:boolean;
    messages?: Array<Message>
}