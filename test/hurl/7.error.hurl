GET http://{{host}}/error
HTTP 418
[Asserts]
jsonpath "$.message" == "error handling"
