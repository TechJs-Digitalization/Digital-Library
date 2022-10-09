import { ValidationOptions, ValidationArguments, registerDecorator, buildMessage } from "class-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export function MailIsUnique(validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        registerDecorator({
            name: 'mailIsUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value, arg?: ValidationArguments){
                    const userRepository= AppDataSource.getRepository(User);
                    const user= await userRepository.findOne({
                        select: ['mail'],
                        where: {mail: value}
                    })
                    return (user==null);
                },
                defaultMessage: buildMessage(()=>'this mail address is already used by another user')
            }
        })
    }
}