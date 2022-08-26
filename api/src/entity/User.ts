import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./Person";
import { Subscription, SUBSCRIPTION_TYPE } from './Subscription';
import { NumTel } from './NumTel';

@Entity({name: 'users'})
export class User extends Person {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar"
    })
    mail!: string;

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.user, { cascade: true })
    subscriptions!: Subscription[];

    @OneToMany(() => NumTel, (num: NumTel) => num.user, { cascade: true })
    numTel!: NumTel[];


    constructor(firstName: string, lastName: string, dateOfBirth: Date, mail: string) {
        super(firstName, lastName, dateOfBirth);
        this.mail = mail;
    }
}
//subscription tkn entité hafa