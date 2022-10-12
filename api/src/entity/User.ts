import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
} from "typeorm";
import { Person } from "./abstract/Person";
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import * as bcrypt from "bcrypt";
import { Subscription } from './Subscription';
// import { NumTel } from './NumTel';
import { BookCheckout } from "./BookCheckout";
import { MailIsUnique } from "../services/customValidation";

@Entity({ name: 'users' })
@Unique(["mail"])
export class User extends Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @MailIsUnique()
    @IsEmail(undefined, {message: 'the provided mail isn\'t a valid mail'})
    mail?: string;

    @Column()
    @Length(6, 100)
    @IsString()
    password: string;
    
    @Column({type: 'boolean', default: false})
    isAdmin!: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.user, { cascade: ['remove'] })
    subscriptions: Subscription[];

    // @OneToMany(() => NumTel, (num: NumTel) => num.user, { cascade: ['remove'] })
    // numTel!: NumTel[];

    @OneToMany(() => BookCheckout, (checkout: BookCheckout) => checkout.user, {cascade: ['remove']})
    checkouts: BookCheckout[];
    
    hashPassword(){
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }


    constructor(firstName?: string, lastName?: string, BirthDate?: Date, email?: string, isAdmin?: boolean, pswd?: string) {
        super(firstName, lastName, BirthDate);
        this.mail = email;
        this.isAdmin = (isAdmin) ? isAdmin : false;
        if(pswd)
            this.password= pswd;
    }
}
//subscription tkn entité hafa