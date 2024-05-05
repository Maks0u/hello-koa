GET http://{{host}}/
HTTP 200
[Asserts]
body == "hello koa"

GET http://{{host}}/404
HTTP 404
[Asserts]
body == "Not Found"

GET http://{{host}}/500
HTTP 500
[Asserts]
body == "Internal Server Error"
