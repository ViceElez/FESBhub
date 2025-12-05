import type {Request} from "express";

export interface logoutRequest extends Request {
    user?: {
        sub: number;
    };
}
