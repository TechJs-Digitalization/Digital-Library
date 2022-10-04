<<<<<<< HEAD
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./abstract/Person";
=======
import {
    Entity,
    Column,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Person } from "./Person";
import { IsNotEmpty, Length } from 'class-validator';
import * as bcrypt from "bcrypt";
>>>>>>> 398815e (CRUD & login user)
import { Subscription } from './Subscription';
import { NumTel } from './NumTel';
import { BookCheckout } from "./BookCheckout";

<<<<<<< HEAD
@Entity({ name: 'users' })
=======
@Entity()
@Unique(["email"])
>>>>>>> 398815e (CRUD & login user)
export class User extends Person {
    @PrimaryGeneratedColumn()
    id: number;

<<<<<<< HEAD
    @Column({
        type: "varchar"
    })
    mail: string;

    @Column()
    password: string;
=======
    @Column()
    email: string;

    @Column()
    @Length(6, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
>>>>>>> 398815e (CRUD & login user)

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.user, { cascade: true })
    subscriptions: Subscription[];

    @OneToMany(() => NumTel, (num: NumTel) => num.user, { cascade: true })
    numTel!: NumTel[];

<<<<<<< HEAD
    @OneToMany(() => BookCheckout, (checkout: BookCheckout) => checkout.user)
    checkouts: BookCheckout[];
=======
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
>>>>>>> 398815e (CRUD & login user)


    constructor(firstName: string, lastName: string, BirthDate: Date, email: string, role: string) {
        super(firstName, lastName, BirthDate);
        this.email = email;
        this.role = role;
    }
}
//subscription tkn entité hafa