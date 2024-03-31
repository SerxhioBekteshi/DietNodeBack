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
const logFilePath = path.join(ROOT, "log", "recommendation-err.log");

export const log: any = bunyan.createLogger({
  name: procName,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  streams: [
    {
      // trace e debug non vengono salvati su file, tutti gli altri si
      level: "info",
      path: `${path.normalize(
        `${ROOT}`
      )}/DietNodeBack_${os.hostname()}_${procName}.log`,
    },
  ],
});
