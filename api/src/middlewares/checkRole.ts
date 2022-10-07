import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const checkIfAdmin = async (req: Request, res: Response, next: NextFunction) => {
    //get the user ID from previous middleware
    const isAdmin = res.locals.jwtPayload.isAdmin;

    //get user role from the database
    // const userRepository = AppDataSource.getRepository(User);
    // let user!: User;
    // try {
    //     user = await userRepository.findOneOrFail({ where: { id: id } });
    // } catch (err) {
    //     return res.status(401).json({err: true, msg: 'Unauthorized'});
    // }
    
    //check if array of authorized roles includes the user's role
    if (isAdmin) next();
    else res.status(401).json({err: true, msg: 'Unauthorized'});
};
