# API REST with expressJS and Typescript

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm run dev` command


4. ****ADMIN****
    mail:"admin@gmail.com",
    password:"admin"
5. when testing the authroutes, take the token on the body(json) and set it to the header in "authorization"

modification password: 
    in header: `authorization: tokkenValue`, normally after loging in it is already set
    in body: `oldPassword: value`, `newPassword:value`, `newPasswordVerif:value`
