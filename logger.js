import { createWriteStream } from 'node:fs';
import logger from 'koa-pino-logger';
import pino from 'pino';
import pretty from 'pino-pretty';

const consoleStream = {
  stream: pretty({
    // hideObject: true,
    // include: 'time,level',
    ignore: 'pid,hostname,req,res,responseTime',
    messageFormat:
      '{req.method} {req.url} \u00b7 {res.statusCode} \u00b7 {responseTime}ms',
    translateTime: 'sys:yyyy-mm-dd HH:MM:ss',
  }),
};

const streams = [
  consoleStream,
  { level: 'debug', stream: createWriteStream('./logs/debug.log') },
  { level: 'info', stream: createWriteStream('./logs/info.log') },
  { level: 'warn', stream: createWriteStream('./logs/error.log') },
];

export default () => {
  return logger({ level: 'debug' }, pino.multistream(streams));
};
