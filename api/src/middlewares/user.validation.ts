import { NextFunction, Request, Response } from "express";
import { FindManyOptions, Not } from "typeorm";
import UserController from "../controllers/UserController";
import { User } from "../entity/User";

export async function verify(req: Request, res: Response, next: NextFunction){
    const {id}= req.params;

    let findOptions: FindManyOptions<User>= {
        select: ['mail'],
        where: {
            mail: req.body.mail,
        }
    }

    if(id!=undefined && Number(id)>0)
        findOptions.where= {...findOptions.where, id: Not(Number(id))};
    else
        return res.status(400).json({err: true, msg: 'invalid category ID'})


    const category= await UserController.repository.find(findOptions)
    
    if(category.length>0)
        return res.status(401).json({err: true, msg: 'this name is already used by another category'})
    
    next();
}