# Digital library
- [KWAN RAMAHARIVO Fifaliana Vasty Sylvania](https://github.com/Vasty26), IGGLIA3
- [RAOILISON Jesi Mendrika Larissa](https://github.com/Jesimendrika), IGGLIA3
- [RAFIEFERANA Tiavina Alinah](https://github.com/Tiavisoa), ESIIA3
- [RANDRIARINIAINA Andriatiana Jordi](https://github.com/Jordird), ESIIA3
- [RASAMISON Andriamahefa Harilantoniaina](https://github.com/Haryrsm), ESIIA3, n°:02
- [RANDRIABOAVONJY Rotsy Ny Aina](https://github.com/RotsyNyAina), ESIIA3, n°:05
- [RASOLONDRAIBE Tolotra Mandresy](https://github.com/TolotraMandresy), ESIIA3, n°:09
- [RAKOTOMANANA NOMENJANAHARY Aina](https://github.com/titlyn), ESIIA3, n°:13
- [ANDIAMIHARISOA Toagina Andrandraina](https://github.com/toavinathedev-luffy), ESIIA3, n°:23
- [HERIMAMPIONONA Tahiry Mariano](https://github.com/TahiryMariano), ESIIA3, n°24
## Backend
| Task | Contributors |
|------|--------------|
| Authentification | - Tahiry Mariano, <br>- RASOLONDRAIBE Tolotra Mandresy |
| CRUD Book with upload cover picture of book |- RASOLONDRAIBE Tolotra Mandresy |
| CRUD Book category |- RASOLONDRAIBE Tolotra Mandresy |
| CRUD User | Tahiry Mariano |
| Book checkout system | Toavina |
| CRUD Author with upload picture |  |
### Installation and initialization
- run this command `cd ./api` then `npm i` to install all dependencies
- create a file named "`.env`" inside the `api` folder.
- put these info inside this file:
```
DB_NAME= digital_library
DB_USER= Replace_this_ith_your_postgres_username
DB_PSWRD= Replace_this_with_your_postgres_Mdp
PORT= Replace_the_port_address_where_the_server_gonna_be_launched
```
**NB: Those values that you gonna replace don't need to be inside quotes or double quotes**  

- create a "`public`" folder in "`api`"
- in thtat "`public`" folder, create a "`bookPictures`"  
  
**NB: If those file arent named as said, you may face some problem**

- `npm run migration:run` to run migration
- `npm run dev` to launch production version of the backend of this project  
&nbsp;  
&nbsp;  

**NB:** We use token for authentification. Tokens are stored in cookies. 

Click here to 👉[view API documentation](api/README.md)👈
## Front-end
