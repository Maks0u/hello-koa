GET http://{{host}}/content-type
Accept: application/json
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.message" == "hi!"

GET http://{{host}}/content-type
Accept: text/plain
HTTP 200
[Asserts]
header "Content-Type" contains "text/plain"
body == "ok"
