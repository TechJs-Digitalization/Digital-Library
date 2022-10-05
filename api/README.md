#	API REST with expressJS,typescript,postgres,typeORM
1. run npm i
2. setup database setting inside data-source.ts file
3. run "npm run migration:run"

#	TEST
4. run "npm run dev"
#	login
5. launch http://localhost:5000/auth/login (method:POST)
6. body-> Json->
7. {
8.	"email":"admin@gmail.com"
9.	"password":"admin"
10. }
11. SEND the request

#	change-password
12. first,we need to sign in with an valid credentials(identifiants)
13. take the token generated on the body response
14. launch http://localhost:5000/auth/change-password (method:POST)
15. body-> Json->
16. {
17. 	"oldPassword":"admin"
18.	  "newPassword":"newAdminPass"
19. }
20. set on header->Authorization   value:(token generated)
21. SEND the request

#	list all users
22. we need to authenticate as an ADMIN
23. take the token generated on the body response
24. launch http://localhost:5000/users/ (method: GET)
25. set on header->Authorization   value:(token generated)
26. SEND the request

#	show one user by ID
27. we need to authenticate as an ADMIN
28. take the token generated on the body response
29. launch http://localhost:5000/users/id (method: GET)
30. set on header->Authorization ->value:(token generated)
31. SEND the request

#	create a new user
32. we need to authenticate as an ADMIN
33. take the token generated on the body response
34. launch http://localhost:5000/users/ (method: POST)
35. body-> Json->
36. {
37.	"firstname":"...",
38.	"lastname":"....",
38.	"BirthDate":"year-month-day",
39.	"email":"....@gmail.com",
40.	"password":"admin",
41.	"role":"USER,ADMIN,..."
42. }
43. set on header->Authorization ->value:(token generated)
44. SEND the request

#	edit user
45. we need to authenticate as an ADMIN
46. take the token generated on the body response
47. launch http://localhost:5000/users/id (method: PATCH)
48. body-> Json->
49. {
50.	"firstname":"...",
51.	"lastname":"....",
52.	"BirthDate":"year-month-day",
53.	"email":"....@gmail.com",
54.	"password":"admin",
55.	"role":"USER,ADMIN,..."
56. }
57. set on header->Authorization ->value:(token generated)
58. SEND the request

#	delete one user
59. we need to authenticate as an ADMIN
60. take the token generated on the body response
61. launch http://localhost:5000/users/id (method: DELETE)
62. set on header->Authorization ->value:(token generated)
63. SEND the request

