import { ValidationError } from "class-validator";

export default function getErrorObject(errors: ValidationError[] ){
    const msgError: {[key: string]: string}= {};
    errors.forEach((singleError)=>{
        const breakedRules: string[]= [];
        for(let rule in singleError.constraints)
            breakedRules.push(singleError.constraints[rule])

        msgError[singleError.property]= `${breakedRules.join(', ')}.`
    });

    return msgError;
}