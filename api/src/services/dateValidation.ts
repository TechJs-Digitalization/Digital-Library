import { buildMessage, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

// export function MinYearDifferenceFromNow(nbrYear: number, validationOptions?: ValidationOptions){
//     return function(object: Object, propertyName: string){
//         registerDecorator({
//             name: 'maxYearDifferenceFromNow',
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             validator: {
//                 validate(value, arg?: ValidationArguments) {
//                     const currentDate= new Date();
//                     const maxValidDate= new Date(currentDate.getFullYear() - nbrYear, currentDate.getMonth(), currentDate.getDate());
//                     return new Date(value) <= maxValidDate;
//                 },
//                 defaultMessage: buildMessage((eachPrefix)=>`${eachPrefix} should have at least ${nbrYear + ((nbrYear>1)?'years':'year')} difference from now`)
//             }
//         })
//     }
// }

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