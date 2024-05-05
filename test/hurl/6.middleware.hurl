GET http://{{host}}/middleware
HTTP 200
[Asserts]
header "X-Response-Time" contains "ms"
