/**
 * Sistema globale di log
 *
 * Basato su [Bunyan](https://github.com/trentm/node-bunyan).
 *
 * Metodi che scrivono su file:
 * - log.info({details}, 'message')
 * - log.warn({details}, 'message')
 * - log.error({details}, 'message')
 * - log.fatal({details}, 'message')
 * \*i log che scrivono su file possono essere visualizzati a video utilizzndo PM2, con il comando pm2 logs [process-id/name]
 *
 * Metodi personalizzati: salvano in file separati gli sms e le dlr
 * - log.sms(Sms)
 * - log.dlr(Dlr)
 *
 * Formato dell'oggetto details:
 *
 *   {
 *   // Obbligatori:
 *     'file': 'percorso del file',
 *     'func': 'nome della funzione che sta scrivendo il log',
 *
 *   // Facoltativi:
 *     'err': Error istanza dell\'errore, oppure stringa di errore,
 *     'user': intero: user id,
 *     'provider': intero: provider id,
 *     'sms': istanza di sms,
 *     'dlr': istanza di dlr,
 *     'data': istanza di un qualsiasi oggetto utile per il debug
 *     'query': stringa della query al db
 *   }
 *
 * Esempio:
 *
 *   log.warn({
 *       'file': __filename,
 *       'func': 'login',
 *       'user': 13
 *     },
 *      'Attenzione: possibile problema di login'
 *   );
 *
 * Altri metodi che stampano a video (non usarli):
 * - log.trace()
 * - log.debug()
 */

import bunyan from "bunyan";
import fs from "fs";
import os from "os";
import path from "path";
import process from "process";

const ROOT = path.resolve(path.normalize(`${__dirname}../../`));

// recupero nome del processo per differenziare i log
let procName: string;
if (process.env.NODE_ENV !== "test") {
  const procPath = process.mainModule!.filename.split("/");
  procName = procPath[procPath.length - 1]
    .split(".")[0]
    .replace(/[\\\/\.:]/g, "_");
} else {
  procName = "test";
}

const log = bunyan.createLogger({
  name: procName,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  streams: [
    {
      // trace e debug non vengono salvati su file, tutti gli altri si
      level: "info",
      path: `${path.normalize(
        `${ROOT}/log`
      )}/dietApp_${os.hostname()}_${procName}.log`,
    },
  ],
});

/**
 * variabili di ambiente
 * @type {Object}
 */
const processFields: Record<string, any> = {
  hostname: os.hostname(),
  pid: process.pid,
};

/**
 * ritorna la data corrente in formato ISO stringa
 * @return {string}
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * clona un oggetto
 * @param  {obj} source
 * @return {obj}
 */
function clone(source: Record<string, any>): Record<string, any> {
  const dest: Record<string, any> = {};
  for (const i in source) {
    dest[i] = source[i];
  }
  return dest;
}

/**
 * Registra un log in formato simil-bunyan
 * @param  {string|obj} data elemento da loggare
 * @param  {string} file percorso del file
 */
function append(data: string | Record<string, any>, file: string): void {
  const fields = clone(processFields);
  fields.time = now();

  if (typeof data === "string") {
    data = { msg: data };
  }

  for (const i in data) {
    fields[i] = data[i];
  }
  const str = `${JSON.stringify(fields)}\r\n`;

  fs.appendFileSync(file, str, { encoding: "utf8" });
}

/**
 * Compone una stringa concatenando: path, prefix, *data odierna in formato yyyy-mm-dd*, suffix
 * @param  {string} path
 * @param  {string} prefix
 * @param  {string} suffix
 * @return {string}
 */
function filename(dir: string, prefix: string, suffix: string): string {
  const today = new Date();
  const date = today.toISOString().substring(0, 10); // yyyy-mm-dd
  return path.join(dir, `${prefix}${date}${suffix}`);
}

/**
 * Mixin: estende log
 * log degli sms
 * @param  {Sms} data sms instance
 */
log.sms = function (data: any): void {
  const file = filename(
    path.normalize(`${ROOT}/log`),
    "/serversmpp.",
    ".sms.log"
  );
  return append(data, file);
};

/**
 * Mixin: estende log
 * log delle dlr
 * @param  {dlr} data dlr instance
 */
log.dlr = function (data: any): void {
  const file = filename(
    path.normalize(`${ROOT}/log`),
    "/serversmpp.",
    ".dlr.log"
  );
  return append(data, file);
};

/**
 * Mixin: estende log
 * log elastic search queris
 * @param  {dlr} data dlr instance
 */
log.esLog = function (data: any): void {
  const file = path.join(
    path.normalize(`${ROOT}/log`),
    `serversmpp_${os.hostname()}.elastic.log`
  );
  return append(data, file);
};

export = log;
