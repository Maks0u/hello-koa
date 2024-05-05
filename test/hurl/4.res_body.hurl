GET http://{{host}}/json
HTTP 200
[Asserts]
header "Content-Type" contains "application/json"
jsonpath "$.foo" == "bar"

GET http://{{host}}/stream
HTTP 200
[Asserts]
header "Content-Type" contains "application/octet-stream"
file,4.res_body.txt;
