import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
    //get the user ID from previous middleware
    const isAdmin = res.locals.jwtPayload.isAdmin;
    
    //check if current user is an admin
    if (isAdmin) return next();
    
    res.status(401).json({err: true, msg: 'Unauthorized'});
    next({})
};
