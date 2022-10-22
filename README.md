# Digital library
- [RASOLONDRAIBE Tolotra Mandresy](https://github.com/TolotraMandresy), ESIIA3, n°:09
- [RAKOTOMANANA NOMENJANAHARY Aina](https://github.com/titlyn), ESIIA3, n°:13
- [ANDRIAMIHARISOA Toavina Andraindraina](https://github.com/toavinathedev-luffy), ESIIA3, n°23
- [HERIMAMPIONONA Tahiry Mariano](https://github.com/TahiryMariano), ESIIA3, n°24  
&nbsp;
## Task
| Task | Contributors | Status |
|------|--------------|--------|
|authentification| Tahiry, Tolotra | done |
|user related operations| Tahiry | done |
|CRUD Book| Tolotra | done |
|CRUD Category, pagination system to get book by category| Tolotra | done |
|Create, Read, Delete Author, pagination system to get book by category| Tolotra | done |
|Landing book system | Toavina | pending |
|Front signin, login| Aina | pending |
&nbsp;
## Installation and initialization
- run this command `cd ./api` then `npm i` to install all dependencies
- create a file named "`.env`" inside the `api` folder.
- put these info inside this file:
```
DB_NAME= digital_library
DB_USER= Replace_this_ith_your_postgres_username
DB_PSWRD= Replace_this_with_your_postgres_Mdp
PORT= Replace_the_port_address_where_the_server_gonna_be_launched
JWT_SECRET= key
```
**NB: Those values that you gonna replace don't need to be inside quotes or double quotes**  

- create a "`public`" folder in "`api`"
- in thtat "`public`" folder, create a "`bookPictures`"  
- in thtat "`public`" folder, create a "`authorPictures`"  
  
**NB: If those file and folder aren't named as said, you may face some problem**

- `npm run migration:run` to run migration that create a administrator that have access to all modification to the database.
- `npm run dev` to launch production version of the backend of this project  
&nbsp;  
&nbsp;
Click here to 👉[view API documentation](api/README.md)👈  

The "`digital_library.postman_collection.json`" as the same level as this readme file can be imported and used in "Postman Canary" to help test this API.
