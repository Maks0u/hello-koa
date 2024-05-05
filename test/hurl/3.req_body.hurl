POST http://{{host}}/
{
  "name": "koa"
}
HTTP 200
[Asserts]
body == "KOA"
