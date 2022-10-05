#API REST with expressJS,typescript,postgres,typeORM***********
1. run npm i
2. setup database setting inside data-source.ts file
3. run "npm run migration:run"

#	TEST
4. run "npm run dev"
#	login
5. http://localhost:5000/auth/login (method:POST)
6. body-> Json->
7. {
8.	"email":"admin@gmail.com"
9.	"password":"admin"
10. }
11. SEND the request

	change-password
-first,we need to sign in with an valid credentials(identifiants)
-take the token generated on the body response
-http://localhost:5000/auth/change-password (method:POST)
-body-> Json->
{
	"oldPassword":"admin"
	"newPassword":"newAdminPass"
}
-set on header->Authorization   value:(token generated)
-SEND the request

	list all users
-we need to authenticate as an ADMIN
-take the token generated on the body response
-http://localhost:5000/users/ (method: GET)
-set on header->Authorization   value:(token generated)
-SEND the request

	show one user by ID
-we need to authenticate as an ADMIN
-take the token generated on the body response
-http://localhost:5000/users/id (method: GET)
--set on header->Authorization ->value:(token generated)
-SEND the request

	create a new user
-we need to authenticate as an ADMIN
-take the token generated on the body response
-http://localhost:5000/users/ (method: POST)
-body-> Json->
{
	"firstname":"...",
	"lastname":"....",
	"BirthDate":"year-month-day",
	"email":"....@gmail.com",
	"password":"admin",
	"role":"USER,ADMIN,..."
}
-set on header->Authorization ->value:(token generated)
-SEND the request

	edit user
-we need to authenticate as an ADMIN
-take the token generated on the body response
-http://localhost:5000/users/id (method: PATCH)
-body-> Json->
{
	"firstname":"...",
	"lastname":"....",
	"BirthDate":"year-month-day",
	"email":"....@gmail.com",
	"password":"admin",
	"role":"USER,ADMIN,..."
}
--set on header->Authorization ->value:(token generated)
-SEND the request

	delete one user
-we need to authenticate as an ADMIN
-take the token generated on the body response
-http://localhost:5000/users/id (method: DELETE)
-set on header->Authorization ->value:(token generated)
-SEND the request

