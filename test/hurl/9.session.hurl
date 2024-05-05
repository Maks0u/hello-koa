GET http://{{host}}/session
HTTP 200
[Asserts]
body == "1"

GET http://{{host}}/session
HTTP 200
[Asserts]
body == "2"

GET http://{{host}}/session
HTTP 200
[Asserts]
body == "3"
