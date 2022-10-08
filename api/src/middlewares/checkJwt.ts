import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = req.cookies.authorization;
    let jwtPayload: any;    

    //Try to validate the token and get data
    try {
        jwtPayload = <jwt.JwtPayload>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json({
            err: true,
            message: "You're not logged in"
        });
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, isAdmin } = jwtPayload;
    const newToken = jwt.sign({ userId, isAdmin }, config.jwtSecret, {
        expiresIn: 3600
    });
    res.cookie("authorization", newToken);

    //Call the next middleware or controller
    next();
};