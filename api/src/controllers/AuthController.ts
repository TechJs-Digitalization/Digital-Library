import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";
import config from "../config/config";
import { AppDataSource } from "../data-source";

class AuthController {

    static login = async (req: Request, res: Response) => {
        //check if username and password are set
        let { email, password } = req.body;
        if (!(email && password)) {
            res.status(401).send();
        }

        //get user from databasse
        const userRepository = AppDataSource.getRepository(User);
        let user!: User;
        try {
            user = await userRepository.findOneOrFail({ where: { email: email } });
        } catch (error) {
            res.status(401).send();
        }

        //check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        //sign JWT, valid for 1 hour
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.jwtSecret,
            { expiresIn: 3600 }
        );

        //send the jwt in the response
        //res.send(token);
        res.status(200)
            .json({
                user: {
                    id: user.id,
                    email: user.email
                },
                message: "Login successfull",
                accessToken: token,
            });
    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = parseInt(res.locals.jwtPayload.userId);

        //get parameters from body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(401).send();
        }
        //Get user from the database
        const userRepository = AppDataSource.getRepository(User);
        let user!: User;
        try {
            user = await userRepository.findOneOrFail({ where: { id } });
        } catch (id) {
            res.status(401).send();
        }

        //check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //validate de model(password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            return;
        }

        //hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(204).send();
    };
}
export default AuthController;