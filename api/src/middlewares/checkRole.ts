import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //get the user ID from previous middleware
        const id = res.locals.jwtPayload.userId;

        //get user role from the database
        const userRepository = AppDataSource.getRepository(User);
        let user!: User;
        try {
            user = await userRepository.findOneOrFail({ where: { id: id } });
        } catch (id) {
            res.status(401).send();
        }

        //check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else res.status(401).send();
    }
};
