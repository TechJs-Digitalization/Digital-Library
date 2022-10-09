import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { validate } from "class-validator";

export class UserController {

    static listAll = async (req: Request, res: Response) => {
        //get user from database
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find(
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
        const userRepository = AppDataSource.getRepository(User);
        try {
            let user = await userRepository.findOneOrFail({
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
            if (errors.length > 0) {
                const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                    m+=`${singleError.property}: ${breakedRules.join(', ')}. `;
                    return m;
                }, '');
                return res.status(400).json({err: true, msg: msg});
            }
    
            //hash the password, to securely store on Db
            user.hashPassword();
    
            //try to save. If fails, the username is alreadry in use
            const userRepository = AppDataSource.getRepository(User);
            try {
                await userRepository.save(user);
            } catch (e) {
                return res.status(409).json({err: true, msg: "email already in used by an user"});
            }
    
            //If all Ok send 201 response
            res.status(201).json({err: true, msg:`${(isAdmin)?'Admin':'User'} account created`});
        };
    }

    static editUser = async (req: Request, res: Response) => {
        //get the id from the url
        const id: number = parseInt(req.params.body, 10);

        //get values from the body
        const { firstName, lastName, dateOfBirth, mail, isAdmin } = req.body;

        //try to find user on database
        const userRepository = AppDataSource.getRepository(User);
        let user;
        try {
            user = await userRepository.findOneBy({ id: id });
        } catch (error) {
            //if not found, send 404 erros response
            return res.status(404).json({err: true, msg:"user not found"});
        }

        //validate the new values on model
        user = new User(firstName, lastName, dateOfBirth, mail, isAdmin)
        const errors = await validate(user);
        if (errors.length > 0){
            const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                m+=`${singleError.property}: ${breakedRules.join(', ')}. `;
                return m;
            }, '');
            return res.status(400).json({err: true, msg: msg})

        }

        //try to save, if failsn that means mail already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({err: true, msg: "email already in used by an user"});
        }

        //after all send a 204(no content, but accepter response)
        res.status(204).json({err: false, msg: "User updated"});
    };

    static deleteUser = async (req: Request, res: Response) => {
        //get the id from the url
        const id = parseInt(req.params.body, 10);
        const userRepository = AppDataSource.getRepository(User);
        try {
            await userRepository.findOne({where: {id: id} , select: ['id']});
        } catch (error) {
            return res.status(404).json({err: true, msg:"user not found"});
        }
        userRepository.delete(id);

        //after all, send a 204 status(no content but acceptes) response
        res.status(204).json({err: false, msg: "User deleted"});
    };
};
export default UserController;