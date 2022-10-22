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
        return  next({})
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, isAdmin } = jwtPayload;
    const newToken = jwt.sign({ userId, isAdmin }, config.jwtSecret, {
        expiresIn: 7200
    });
    res.cookie("authorization", newToken);

    //Call the next middleware or controller
    next();
};

export const checkLogedOut= (req: Request, res: Response, next: NextFunction)=>{
    const token = req.cookies.authorization;
    let jwtPayload: any;    

    try {
        jwtPayload = <jwt.JwtPayload>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //if the token is'nt valid or doesn't exist then we can create an account
        return next();
    }
    //If token is valid, make them logout first
    res.status(401).json({
        err: true,
        message: "Logout First"
    });
}