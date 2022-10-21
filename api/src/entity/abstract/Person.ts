import { IsDate, IsNotEmpty, IsString, Matches, MaxDate, MaxLength, MinDate } from "class-validator";
import { Column } from "typeorm";
import { MinAge } from "../../services/dateValidation";

export abstract class Person {
    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    @MaxLength(30)
    @Matches(/^\D+$/, {message: 'couldn\'t contain number'})
    @IsNotEmpty()
    @IsString()
    firstName: string
    
    @MaxLength(30)
    @Matches(/^\D+$/, {message: 'couldn\'t contain number'})
    @IsNotEmpty()
    @IsString()
    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    lastName: string

    @Column({
        type: "date"
    })
    //Should be at leat 12yo
    // @MaxDate(new Date(Date.now()-3784320000), {message: 'Should be at least 12 years old'})
    @MinAge(12)
    @IsDate({message: 'dateOfBirth should not be empty, dateOfBirth must be a valid date, and respect format'})
    @IsNotEmpty()
    dateOfBirth?: Date;

    constructor(firstName?: string, lastName?: string, BirthDate?: Date) {
        this.firstName = (firstName)?firstName:'';
        this.lastName = (lastName)?lastName:'';
        this.dateOfBirth = BirthDate;
    }
}