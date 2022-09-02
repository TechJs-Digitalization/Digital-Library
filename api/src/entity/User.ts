import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Person } from "./abstract/Person";
import { Subscription } from './Subscription';
import { NumTel } from './NumTel';
import { BookCheckout } from "./BookCheckout";

@Entity({ name: 'users' })
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

    @OneToMany(() => BookCheckout, (checkout: BookCheckout) => checkout.user)
    checkouts: BookCheckout[];


    constructor(firstName: string, lastName: string, dateOfBirth: Date, mail: string) {
        super(firstName, lastName, dateOfBirth);
        this.mail = mail;
    }
}
//subscription tkn entité hafa