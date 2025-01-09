import { Router } from 'express';
import jwt from "jsonwebtoken";
import passport from "passport";
import AuthenticateService from '../services/auth.service';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

class AuthenticationRouter {
    public router: Router;
    private static GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
    private static GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
    private static JWT_SECRET = process.env.JWT_SECRET || "";


    constructor(ExpressRouter: Router) {
        this.router = ExpressRouter;
        this.getRouter();

        if (
            !AuthenticationRouter.GOOGLE_CLIENT_ID ||
            !AuthenticationRouter.GOOGLE_CLIENT_SECRET ||
            !AuthenticationRouter.JWT_SECRET
        ) {
            throw new Error(
                "Missing Google OAuth Key Variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET"
            );
        }

        this.initializeGoogleStrategy();
    }

     private initializeGoogleStrategy() {
            passport.use(
                new GoogleStrategy(
                    {
                        clientID: AuthenticationRouter.GOOGLE_CLIENT_ID,
                        clientSecret: AuthenticationRouter.GOOGLE_CLIENT_SECRET,
                        callbackURL: "http://localhost:3000/auth/google/callback",
                    },
                    (accessToken, refreshToken, profile, done) => {
                        const user = {
                            id: profile.id,
                            name: profile.displayName,
                            email: profile.emails?.[0]?.value,
                        };
    
                        const token = jwt.sign(user, AuthenticationRouter.JWT_SECRET, {
                            expiresIn: process.env.JWT_EXPIRY || "1h",
                        });
                        return done(null, { user, token });
                    }
                )
            );
        }

    getRouter() {
        console.log("Auth get serive route")
        this.router.get("/", (req: any, res: any, next: any) => {
            res.send("<a href='/auth/google'>Login With Google</a>")
        }
        );

        this.router.get(
            "/auth/google",
            passport.authenticate("google", { scope: ["profile", "email"] })
        );

        this.router.get(
            "/auth/google/callback",
            passport.authenticate("google", {failureRedirect : "/"}),
            (req: any, res: any) => {
                res.redirect("/profile");
            }
        );

        this.router.get(
            "/profile", (req: any, res: any) => {
                res.send(`Welcome ${req.user.displayName}`)
            }
        );

        this.router.get(
            "/logout", (req: any, res: any) => {
                req.logout()
                res.redirect("/")
            }
        );

        this.router.get("/protected", AuthenticateService.authenticateJWT, (req: any, res: any, next: any) => {
            res.send(`Hello ${req.user.name}.`);
        });
    }
}

export default AuthenticationRouter;
