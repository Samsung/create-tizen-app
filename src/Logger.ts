import { createLogger, format, transports, Logger } from 'winston';

let logger: Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.prettyPrint()
    )
});

const initLogger = (isEnableVerbose: boolean) => {
    let logLevel = 'info';
    if (process.env.NODE_ENV === 'development') {
        logLevel = 'debug';
    } else if (isEnableVerbose) {
        logLevel = 'verbose';
    }
    logger = createLogger({
        level: logLevel,
        format: format.combine(
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        )
    });

    const customPrint = format.printf(({ level, message }) => {
        return `${message}`;
    });
    if (process.env.NODE_ENV === 'production') {
        logger.add(
            new transports.Console({
                format: customPrint
            })
        );
    } else {
        logger.add(
            new transports.Console({
                format: format.combine(format.colorize(), format.simple())
            })
        );
    }
};

export { logger, initLogger };
