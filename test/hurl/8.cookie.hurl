GET http://{{host}}/cookie
HTTP 200
[Asserts]
cookie "view" exists
cookie "view" == "1"

GET http://{{host}}/cookie
HTTP 200
[Asserts]
cookie "view" exists
cookie "view" == "2"

GET http://{{host}}/cookie
HTTP 200
[Asserts]
cookie "view" exists
cookie "view" == "3"

GET http://{{host}}/cookie
HTTP 200
[Asserts]
cookie "view" exists
cookie "view" == "4"
