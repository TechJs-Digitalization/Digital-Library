import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { validate } from "class-validator";
import getErrorObject from "../services/errorInClassValidator";

export class UserController {
    static repository= AppDataSource.getRepository(User);

    static listAll = async (req: Request, res: Response) => {
        //get user from database
        const users = await UserController.repository.find(
            { 
                select: ["id", "firstName", "lastName", "dateOfBirth", "mail"],
                where: {isAdmin: false}
            }
        );

        //send the users object
        return res.status(200).json(users);
    }

    static getOneById = async (req: Request, res: Response) => {
        //get the ID from the url
        const id: number = parseInt(req.params.id, 10);

        //get the user from database
        
        try {
            let user = await UserController.repository.findOneOrFail({
                select: ["id", "firstName", "lastName", "dateOfBirth", "mail"],
                where: { id: id }
            });

            res.status(200).json(user);
        } catch (error) {
            res.status(401).send("User not found");
        }

    };

    static newUser = (isAdmin: boolean)=>{
        return async (req: Request, res: Response) => {
            //get parameters from the body
            const { firstName, lastName, dateOfBirth, mail, password } = req.body;
            
            let user = new User(
                (firstName) ? firstName.trim() : firstName, 
                (lastName) ? lastName.trim() : lastName, 
                new Date(dateOfBirth), 
                (mail) ? mail.trim() : mail, 
                isAdmin, 
                password);
    
            //validate if the parameters are ok
            const errors = await validate(user);
            if (errors.length > 0) 
                return res.status(400).json({err: true, msg: getErrorObject(errors)});
    
            //hash the password, to securely store on Db
            user.hashPassword();
    
            //try to save. If fails, the username is alreadry in use
            
            try {
                await UserController.repository.save(user);
            } catch (e) {
                return res.status(409).json({err: true, msg: "email already in used by an user"});
            }
    
            //If all Ok send 201 response
            res.status(201).json({err: true, msg:`${(isAdmin)?'Admin':'User'} account created`});
        };
    }

    static editUser = async (req: Request, res: Response) => {
        //get the id from the url
        const id: number = parseInt(req.params.id);
        //try to find user on database
        try {
            await UserController.repository.findOneOrFail({ 
                select: ['id'],
                where: {id: id} 
            });
        } catch (error) {
            //if not found, send 404 erros response
            return res.status(404).json({err: true, msg:"user not found"});
        }

        let userUpdate: {[keys: string]: any}= {};
        const tmp= new User();
        
        for(let prop in req.body){
            if(prop in tmp){
                switch (prop) {
                    case "firstName":
                    case "lastName":
                    case 'mail':
                    case 'dateOfBirth':
                        userUpdate[prop]= req.body[prop].trim();
                        break;
                }
            }
        }

        //validate the new values on model
        const errors = await validate(userUpdate);
        if (errors.length > 0)
            return res.status(400).json({err: true, msg: getErrorObject(errors)})

        //try to save, if failsn that means mail already in use
        try {
            await UserController.repository.update({id:id},userUpdate);
        } catch (e) {
            return res.status(401).json({err: true, msg: 'the provided email is already used by another user'});
        }

        res.status(200).json({err: false, msg: "User updated"});
    };

    static deleteUser = async (req: Request, res: Response) => {
        //get the id from the url
        const id = parseInt(req.params.body, 10);
        
        try {
            await UserController.repository.findOne({where: {id: id} , select: ['id']});
        } catch (error) {
            return res.status(404).json({err: true, msg:"user not found"});
        }
        UserController.repository.delete(id);

        //after all, send a 204 status(no content but acceptes) response
        res.status(204).json({err: false, msg: "User deleted"});
    };
};
export default UserController;