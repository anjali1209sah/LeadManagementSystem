import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export default class AuthenticateService {
    private static JWT_SECRET = process.env.JWT_SECRET || "";


    public static authenticateJWT(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        jwt.verify(token, AuthenticateService.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ error: "Forbidden" });
                return;
            }
            req.user = user;
            next();
        });
    }

    // public static validate(req: Request, res: Response, next: NextFunction): void {
    //     const { error } = leadSchema.validate(req.body);
    //     if (error) {
    //         return res.status(400).json({ error: error.details[0].message });
    //     }
    //     next();
    // };

}
