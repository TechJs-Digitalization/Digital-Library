import { IsDate, IsNotEmpty, IsString, MaxLength, MinDate } from "class-validator";
import { Column } from "typeorm";

export abstract class Person {
    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    firstName: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @Column({
        type: "varchar",
        length: 30,
        nullable: false
    })
    lastName: string

    @Column({
        type: "date"
    })
    @IsNotEmpty()
    @IsDate()
    //Should be at leat 12yo
    //12years= 378 432 000s
    @MinDate(new Date(Date.now()-378432000), {message: 'Should be at least 12 years old'})
    dateOfBirth: Date;

    constructor(firstName: string, lastName: string, BirthDate: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateOfBirth = BirthDate;
    }
}