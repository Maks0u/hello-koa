GET http://{{host}}/auth/
HTTP 401

GET http://{{host}}/auth/login
HTTP 200
[Asserts]
header "Content-Type" contains "text/html"
xpath "//form" exists
xpath "string(//form/@action)" == "/auth/login"
xpath "string(//form/@method)" == "post"

POST http://{{host}}/auth/login
{
  "username": "john",
  "password": "doe"
}
HTTP 400

POST http://{{host}}/auth/login
{
  "username": "username",
  "password": "password"
}
HTTP 303

GET http://{{host}}/auth/
HTTP 200
[Asserts]
body contains "Hello user!"

GET http://{{host}}/auth/logout
HTTP 303

GET http://{{host}}/auth/
HTTP 401
