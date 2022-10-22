import { buildMessage, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function MinAge(nbrYear: number, validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        registerDecorator({
            name: 'maxYearDifferenceFromNow',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, arg?: ValidationArguments) {
                    const currentDate= new Date();
                    const maxValidDate= new Date(currentDate.getFullYear() - nbrYear, currentDate.getMonth(), currentDate.getDate());
                    return new Date(value) <= maxValidDate;
                },
                defaultMessage: buildMessage(()=>`minimum age is ${nbrYear + ((nbrYear>1)?'years':'year')}`)
            }
        })
    }
}

export function DateIsSupThan(dateField: string,validationOptions?: ValidationOptions){
    return function(object: Object, propertyName: string){
        registerDecorator({
            name: 'DateIsSupThan',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, arg: ValidationArguments){
                    return (new Date(value) > (arg.object as any)[dateField] || value==undefined)
                },
                defaultMessage: ()=>`This date field must have a date value greater than ${dateField}`
            }
        })
    }
}