import React, { FormEvent } from "react";
import './Reg.css';

const verifForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const {name, lastname, address, email, number, pseudo,password, confpass} = event.target as typeof event.target & {
        name : {value:string}
        lastname : {value:string}
        address : {value:string}
        email : {value:string}
        number : {value: number}
        pseudo : {value: string}
        password : {value: string}
        confpass : {value: string}
    }

    if (name.value === '' && lastname.value === '' && address.value === '' && email.value === '' && number.value === null && pseudo.value === '' && password.value === '' && confpass.value === '') {
        console.log("error")
    } else if (password.value === confpass.value) {
        console.log("Thank you")
    } else {
        console.log("Wrong password")
    }
}

export const Reg = () => {
    return (
        <div className="Reg">
            <form className="wrap" onSubmit={evt => {verifForm(evt)}}>
                <h1 className="title">Register</h1>

                <fieldset className="field-area">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="lastname">Lastname</label>
                    <input type="text" id="lastname"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="tel">Number</label>
                    <input type="number" id="tel"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="pseudo">Pseudo</label>
                    <input type="text" id="pseudo"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"/>
                </fieldset>

                <fieldset className="field-area">
                    <label htmlFor="confpass">Confirm</label>
                    <input type="password" id="confpass"/>
                </fieldset>

                <button type="submit">Login</button>
            </form>
        </div>
    )
}