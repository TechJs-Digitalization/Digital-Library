import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../entity/User";
import config from "../config/config";
import { AppDataSource } from "../data-source";

class AuthController {

    static login = async (req: Request, res: Response) => {
        //check if username and password are set
        let { mail, password } = req.body;
        if (!mail || !password)
            return res.status(401).json({err: true, msg: 'You should provide a value to "mail" and "password" field'});

        //get user from databasse
        const userRepository = AppDataSource.getRepository(User);
        let user!: User;
        try {
            user = await userRepository.findOneOrFail({ where: { mail: mail }, select: ['id','password','isAdmin'] });
        } catch (error) {
            return res.status(404).json({err: true, msg:'User not found'});
        }

        //check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password))
            return res.status(401).json({err: true, msg: 'Wrong password'});

        //sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            config.jwtSecret,
            { expiresIn: 7200 }
        );

        //send the jwt in the response
        //res.send(token);
        res.cookie("authorization", token)
            .status(200)
            .json({
                err: false,
                message: "Login successfull"
            });
    };

    static logout(req: Request, res:Response){
        return res.clearCookie('authorization').status(200).json({err: false, msg: 'Successfully logout'})
    }

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = parseInt(res.locals.jwtPayload.userId);
        
        //get parameters from body
        const { oldPassword, newPassword, newPasswordVerif } = req.body;
        if (!(oldPassword && newPassword && newPasswordVerif)) 
            return res.status(401).json({err: true, msg: 'You should provide a value to "oldPassword", "newPassword" and "newPasswordVerif" field'});
            
        if(newPassword!=newPasswordVerif)
            return res.status(401).json({err: true, msg: '"newPassword" and "newPasswordVerif" doesn\'t match'});
            
        if(oldPassword==newPasswordVerif)
            return res.status(401).json({err: true, msg: '"oldPassword" and "newPasswordVerif" can\'t be the same'});

        //Get user from the database
        const userRepository = AppDataSource.getRepository(User);
        let user!: User;
        try {
            user = await userRepository.findOneOrFail({ where: { id }, select:['password']});
        } catch (err) {
            return res.status(401).json({err: true, msg: 'Please connect to your account first'});
        }

        //check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword))
            return res.status(401).json({err: true, msg: 'Wrong old password'});

        //validate de model(password length)
        user.password = newPassword;
        const errors = await validate(user, {skipMissingProperties: true});
        if (errors.length > 0) {
            const msg= errors.reduce((m, singleError)=>{
                const breakedRules= [];
                for(let rule in singleError.constraints)
                    breakedRules.push(`${singleError.constraints[rule]}`)
                m+=`${singleError.property}: ${breakedRules.join(', ')}. `;
                return m;
            }, '');
            return res.status(401).json({err: true, msg: msg});
        }

        //hash the new password and save
        user.hashPassword();
        userRepository.update({id}, {password: user.password});

        return res.status(200).json({err: false, msg: 'Password changed'});
    };
}
export default AuthController;