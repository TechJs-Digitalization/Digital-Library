# Functionnalities
**NB**: all "`SERVER`" in the request column should be replaced by the server.  
example: if server is on localhost on port 8080, replace "`SERVER`" by `localhost:8080`  
&nbsp;  
## **`Authentification`**
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

## **`Creating an account and some user related operations`**
| method | request | encode-type | input name | description | condition |
|--------|---------|-------------|------------|-------------|-----------|
| GET | SERVER/users/:id | x-www-form-urlencoded | | get info about user exept password | logged as admin |
| GET | SERVER/users/:id | x-www-form-urlencoded | | get info about all user exept password | logged as admin |
| PUT | SERVER/users/:id | x-www-form-urlencoded | mail , password, firstName, lastName, dateOfBirth | modify info about user | logged as admin |
| POST | SERVER/auth/signin | x-www-form-urlencoded | mail , password, firstName, lastName, dateOfBirth, | to create an user account | logged out, respect all field rules |
| POST | SERVER/auth/newAdmin | x-www-form-urlencoded | mail , password, firstName, lastName, dateOfBirth, | to create a new admin account | logged in as admin, respect all field rules |
| DELETE | SERVER/users/:id | x-www-form-urlencoded | | delete an user | logged as admin |
  
  Field constraints:
| Field | Description | Type | Constraint |
|-------|-------------|------|------------|
| mail | mail of the user/admin | string | Should be a valid mail. Mail should be unique per user. Should not be empty | 
| password | password | string | Should have a length more or equal to 6. Should not be empty | 
| firstName | firstName of user | string | Should have a length less or equal to 30. Should not be empty | 
| lastName | lastName of user | string | Should have a length less or equal to 30. Should not be empty |
&nbsp;  

**NB: Date must have [IETF-compliant RFC 2822 timestamps](https://datatracker.ietf.org/doc/html/rfc2822#page-14) or a string in a [ version of ISO8601](https://262.ecma-international.org/11.0/#sec-date.parse), format that can be used in Javacript Date constructor**. For example this format is accepted: `MM/JJ/YYYYY`
**When doing update**: only modified field should be provided
&nbsp;  
&nbsp; 
## **`CRUD Book`**
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
| title | Title of the book | string | Should not be left empty or space. A book title should be unique per author: maybe another author have the same book title an author can't have multiple book with same title. MAX LENGTH: 500 | 
| synopsis | Synopsis of the book | text | Should not be space.
| category | ID of the category of the book | integer | category with this ID exist |
| author | ID of the author | integer | category with this ID exist |
| available | Number of the book in stock | integer | available>=0 |
| dispo | If true, the book is disponible for all user, can be used to hidde a book from them | boolean, default value= false |  |
| cover | The cover picture of the book | File | Must be one image file |
  
**When doing update**: only modified field should be provided
**NB**: When getting a book, the link to the file is like "/public/bookPictures/nom.extension". So you should add the value of `SERVER` to it.  
example: localhost:8080/public/bookPictures/nom.extension
 
&nbsp;  

## **`CRUD Book Category`**
| Method | Request | Encode-type | Input name | Description | Condition |
|--------|---------|-------------|------------|-------------|-----------|
| GET | SERVER/category |  |  | To get all categories'name | | 
| GET | SERVER/category/:id | | | To get category name, id with the number of available books in the category | |
| GET | SERVER/category/withHiddendInfo/:id |  |  | Same as the previous one, but it will get the number of unavailable books too | Must be loged in as admin |
| GET | SERVER/category/bookInCategory/:id |  |  | To get available books in the category following the numero of the page to get, number of book per page and sort condition | |
| GET | SERVER/category/allBookInCategory/:id |   |  | Same as the previous one, but it will also show all unavailable books | Must be logged as admin |
| POST | SERVER/category/ | x-www-form-urlencoded | | Create category | Logged as admin. The provided name must be different from every other category name already saved |
| PUT | SERVER/category/:id | | | Modify category | Logged as admin. The provided name must be different from every other category name already saved |
| DELETE | SERVER/category/:id | | | To delete category with de id on params | id is an id of an existant category, otherwise get an error message |

  
&nbsp;
  Field constraints:
| Field | Description | Type | Constraint |
|-------|-------------|------|------------|
| name | the category's name | string | Should by a sequence of characters in [a-zA-Z], words are separated by one hyphen or one space or one space. Length: min 2, max 30 |

**NOTE**: When getting book in category, all following query has default value and are optional:
- `perPage`: number of book per page. Must be positive int. If not provided, perPage will be `10` by default
- `sortBy`: sort condition. Must have value `createdAt` or `title`. If not provided, it will sort book by `createdAt`
- `page`: numero of the page. Must be positive int. If not provided, it will be `1`
- `order`: the condition of the sort operation. Must be `ASC` or `DESC`. If not provided or wrong value, those are default value:
    - if sorted by book creation date: `DESC`
    - if sorted by book title: `ASC`
&nbsp;  

## **`CRUD Author Category`**
| Method | Request | Encode-type | Fields name | Description | Condition |
|--------|---------|-------------|------------|-------------|-----------|
| POST | SERVER/author/ | form-data | firstName, lastName, dateOfBirth, dateOfDeath, nomDePlumes, coverPicture | Create an author | Logged as admin. Name is required and cannot contain number; dateOfBirth is required; if dateOfDath is provieded it must be later than the DadateBirth; coverPicture must be a picture file; nomDePlumes can be null, can be a multiple field as we use form-data, must be string |
| GET | SERVER/author |  |  | To get all author's name and nomDePlume | | 
| GET | SERVER/author/:id | | | To get all information about author, with the number of available books in the category | |
| GET | SERVER/author/withHiddendInfo/:id |  |  | Same as the previous one, but it will get the number of unavailable books too | Must be loged in as admin |
| GET | SERVER/author/bookByAuthor/:id |  |  | To get available books in the category following the numero of the page to get, number of book per page and sort condition | |
| GET | SERVER/author/allBookByAuthor/:id |   |  | Same as the previous one, but it will also show all unavailable books | Must be logged as admin |
| DELETE | SERVER/author/:id | | | delete the concerned author with his cover picture and all his book and cover picture | id must exist in the DB |

  
&nbsp;

**NOTE**: When getting book in author, all following query has default value and are optional:
- `perPage`: number of book per page. Must be positive int. If not provided, perPage will be `10` by default
- `sortBy`: sort condition. Must have value `createdAt` or `title`. If not provided, it will sort book by `createdAt`
- `page`: numero of the page. Must be positive int. If not provided, it will be `1`
- `order`: the condition of the sort operation. Must be `ASC` or `DESC`. If not provided or wrong value, those are default value:
    - if sorted by book creation date: `DESC`
    - if sorted by book title: `ASC`
