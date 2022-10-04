# DIgital library
## Backend
- launch `cd ./api` then `npm i` to install all dependencies
- create a file named "`.env`" inside the `api` folder.
- put these info inside this file:
```
DB_NAME= digital_library
DB_USER= Replace_this_ith_your_postgres_username
DB_PSWRD= Replace_this_with_your_postgres_Mdp
PORT= Replace_the_port_address_where_the_server_gonna_be_launched
```
**NB: Those values that you gonna replace don't need to be inside quotes or double quotes** 
- `npm run migration:run` to run migration
- `npx tsc` to convert those TS file into JS  

**TODO:** Create lending book system.  
**NB:** Create separated branch from the `master` branch per fonctionnality

 ****ADMIN****
- email:"admin@gmail.com"
- password:"admin"

## Front-end
