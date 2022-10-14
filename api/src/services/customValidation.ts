import { ValidationOptions, ValidationArguments, registerDecorator, buildMessage } from "class-validator";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { BookCategory } from "../entity/BookCategory";
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
                    const user= await userRepository.find({
                        select: ['mail'],
                        where: {mail: value}
                    })
                    return (user.length<=1);
                },
                defaultMessage: buildMessage(()=>'this mail address is already used by another user')
            }
        })
    }
}

export function CategoryNameIsUnique(validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        registerDecorator({
            name: 'categoryNameIsUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                async validate(value, arg?: ValidationArguments){
                    const categoryRepository= AppDataSource.getRepository(BookCategory);
                    const category= await categoryRepository.find({
                        select: ['name'],
                        where: {
                            name: value,
                        }
                    })
                    console.log(category.length);
                    
                    return (category.length<=1);
                },
                defaultMessage: buildMessage(()=>'this name is already used by another category')
            }
        })
    }
}

//!PROBLEME: rehefa manao maj de kotiny ko le zavatra ho atao maj rehefa manao verif unicité