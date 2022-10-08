import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Person } from "./abstract/Person";
import { IsNotEmpty, Length } from 'class-validator';
import * as bcrypt from "bcrypt";
import { Subscription } from './Subscription';
import { NumTel } from './NumTel';
import { BookCheckout } from "./BookCheckout";

@Entity({ name: 'users' })
@Unique(["mail"])
export class User extends Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mail: string;

    @Column()
    @Length(6, 100)
    password: string;

    @Column()
    isAdmin: boolean;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.user, { cascade: ['remove'] })
    subscriptions: Subscription[];

    @OneToMany(() => NumTel, (num: NumTel) => num.user, { cascade: ['remove'] })
    numTel!: NumTel[];

    @OneToMany(() => BookCheckout, (checkout: BookCheckout) => checkout.user, {cascade: ['remove']})
    checkouts: BookCheckout[];
    
    hashPassword(){
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }


    constructor(firstName: string, lastName: string, BirthDate: Date, email: string, isAdmin: boolean, pswd?: string) {
        super(firstName, lastName, BirthDate);
        this.mail = email;
        this.isAdmin = isAdmin;
        if(pswd)
            this.password= pswd;
    }
}
//subscription tkn entité hafa