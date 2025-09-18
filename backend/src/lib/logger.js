import pino from "pino";

const level = process.env.LOG_LEVEL || "info";

// Development'ta PRETTY=1 ise pino-pretty kullanılabilir (opsiyonel)
const usePretty =
  process.env.NODE_ENV !== "production" && process.env.PRETTY === "1";

const logger = usePretty
  ? pino({
      level,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          singleLine: false,
          ignore: "pid,hostname",
        },
      },
    })
  : pino({ level });

export default logger;
