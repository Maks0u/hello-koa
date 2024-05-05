// lib
import { createReadStream } from 'node:fs';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import logger from './logger.js';
// koa
import Koa from 'koa';
import Router from '@koa/router';
import session from 'koa-session';
import { bodyParser } from '@koa/bodyparser';
const app = new Koa();
const router = new Router();
const port = Number.parseInt(process.argv[2]);

// 1. hello
// 2. routing
router.get('/', ctx => {
  ctx.body = 'hello koa';
});
router.get('/404', ctx => {
  ctx.status = StatusCodes.NOT_FOUND;
  ctx.body = ReasonPhrases.NOT_FOUND;
});
router.get('/500', ctx => {
  ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
  ctx.body = ReasonPhrases.INTERNAL_SERVER_ERROR;
});

// 3. request body
router.post('/', ctx => {
  ctx.body = ctx.request.body.name.toUpperCase();
});

// 4. response body
router.get('/json', ctx => {
  ctx.body = { foo: 'bar' };
});
router.get('/stream', ctx => {
  ctx.body = createReadStream('test/hurl/4.res_body.txt');
});

// 5. content headers
router.get('/content-type', ctx => {
  if (ctx.accepts('application/json')) {
    ctx.body = { message: 'hi!' };
    return;
  }
  if (ctx.accepts('text')) {
    ctx.body = 'ok';
    return;
  }
  ctx.status = StatusCodes.BAD_REQUEST;
  ctx.message = ReasonPhrases.BAD_REQUEST;
});

// 6. middleware
function responseTime() {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const end = Date.now();
    ctx.set('X-Response-Time', `${end - start}ms`);
  };
}
router.get('/middleware', ctx => {
  ctx.body = ReasonPhrases.OK;
});

// 7. error handling
function errorHandler() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = error.statusCode || error.status || 500;
      ctx.body = {
        message: error.message,
      };
    }
  };
}
router.get('/error', ctx => {
  const error = new Error('error handling');
  error.status = StatusCodes.IM_A_TEAPOT;
  throw error;
});

// 8. cookie
router.get('/cookie', ctx => {
  let view = Number.parseInt(ctx.cookies.get('view') || 0);
  ctx.cookies.set('view', ++view);
  ctx.body = ReasonPhrases.OK;
});

// 9. session
router.get('/session', ctx => {
  let views = Number.parseInt(ctx.session.views || 0);
  ctx.session.views = ++views;
  ctx.body = views;
});

// 11. auth
router.get('/auth', ctx => {
  if (!ctx.session.authenticated) {
    ctx.status = StatusCodes.UNAUTHORIZED;
    return;
  }
  ctx.type = 'html';
  ctx.body = createReadStream('static/protected.html');
});

router.get('/auth/login', ctx => {
  if (ctx.session.authenticated) {
    ctx.status = StatusCodes.SEE_OTHER;
    ctx.redirect('/auth');
    return;
  }
  ctx.type = 'html';
  ctx.body = createReadStream('static/login.html');
});

router.post('/auth/login', ctx => {
  const { username, password } = ctx.request.body;
  if (username === 'username' && password === 'password') {
    ctx.session.authenticated = true;
    ctx.status = StatusCodes.SEE_OTHER;
    ctx.redirect('/auth');
  } else {
    ctx.status = StatusCodes.BAD_REQUEST;
  }
});

router.get('/auth/logout', ctx => {
  ctx.session = null;
  ctx.status = StatusCodes.SEE_OTHER;
  ctx.redirect('/auth/login');
});

app.keys = ['1234', 'abcd'];
const sessionConfig = {
  maxAge: 30000,
};

app
  .use(errorHandler())
  .use(logger())
  .use(responseTime())
  .use(session(sessionConfig, app))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);
