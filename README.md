# DIgital library
## Backend
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
- in thtat "public" folder, create a "`bookPictures`"  
  
**NB: If those file arent named as said, you may face some problem**

- `npm run migration:run` to run migration
- `npm run dev` to launch production version of the backend of this project  
&nbsp;  
&nbsp;  

### Functionnalities
**NB**: all "`SERVER`" in the request column should be replaced by the server.  
example: if server is on localhost on port 8080, replace "`SERVER`" by `localhost:8080`  
&nbsp;  
#### Authentification
We use WebToken and cookie to authentificate. Token are stored in cookies in "`authorization`" property.  
If logged as admin, could get access to database modification and see hidden informations.
| method | request | encode-type | input name | description | condition |
|--------|---------|-------------|------------|-------------|-----------|
| POST | SERVER/auth/login | x-www-form-urlencoded | mail , password | to login | right mail and password, otherwise error |
| POST | SERVER/auth/logout | | | Logout | Must be  logged in |
| POST | SERVER/auth/change-password | x-www-form-urlencoded | oldPassword, newPassword, newPasswordVerif | to change password | logged in, right old password, newPassword and newPasswordVerif match |

By default, there is an pre-saved administrator saved with those information:
- mail: admin@gmail.com
- password: admin
&nbsp;  
&nbsp;  

### CRUD Book
The "cover" inpu value should be an image file, otherwise you'd get an error message
| Method | Request | Encode-type | Input name | Description | Condition |
|--------|---------|-------------|------------|-------------|-----------|
| GET | SERVER/book/:id |  |  | To get book by id on params | id is an id of an existant book, otherwise get an error message | 
| POST | SERVER/book/ | form-data | title, synopsis, category, author, available, dispo, cover | To save a new book | Must be loged in as admin, all field required except dispo who is false by default, respect all constraint otherwise error |
| PUT | SERVER/book/:id | form-data | title, synopsis, category, author, available, dispo, cover | To modify a book | Must be loged in as admin, all field are not required, just the ones you want to update, respect all field constraint otherwise error |
| DELETE | SERVER/book/:id | | | To delete the book with de id on params | id is an id of an existant book, otherwise get an error message |
  
  Field constraints:
| Field | Description | Type | Constraint |
|-------|-------------|------|------------|
| title | Title of the book | string | Should not be space. A book title should be unique per author: maybe another author have the same book title an author can't have multiple book with same title | 
| synopsis | Synopsis of the book | text | Should not be space.
| category | ID of the category of the book | integer | category with this ID exist |
| author | ID of the author | integer | category with this ID exist |
| available | Number of the book in stock | integer | available>=0 |
| dispo | If true, the book is disponible for all user, can be used to hidde a book from them | boolean, default value= false |  |
| cover | The cover picture of the book | File | Must be one image file |
  
**NB**: When getting a book, the link to the file is like "/public/bookPictures/nom.extension". So you should add the value of `SERVER` to it.  
example: localhost:8080/public/bookPictures/nom.extension

## Front-end
