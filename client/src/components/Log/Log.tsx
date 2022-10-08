import React, { FormEvent } from "react";
import './Log.css';

const sendForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { username, password } = event.target as typeof event.target & {
        username: {value: string}
        password: {value: string}
    }

    console.log(username.value, password.value)

    //await fetch('/route', {
    //    headers: {
    //        'Content-Type': 'application/json'
    //    },
    //    method: 'POST',
    //    body: JSON.stringify ({
    //        Username : Username.value,
    //        Password: Password.value
    //    })
    //})
}

export const Log = () => {
    return (
        <div className="Log">
            <form className="wrap" onSubmit={evt => { sendForm(evt) }}>
                <fieldset className="field-area">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username"/>
                </fieldset>
                <fieldset className="field-area">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password"/>
                </fieldset>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}