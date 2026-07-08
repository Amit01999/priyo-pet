/* eslint-disable no-console */
type LogFields = Record<string, unknown>;

function line(level: string, message: string, fields?: LogFields): string {
  const timestamp = new Date().toISOString();
  const suffix = fields ? ` ${JSON.stringify(fields)}` : '';
  return `[${timestamp}] [${level}] ${message}${suffix}`;
}

export const logger = {
  info(message: string, fields?: LogFields): void {
    console.log(line('INFO', message, fields));
  },
  warn(message: string, fields?: LogFields): void {
    console.warn(line('WARN', message, fields));
  },
  error(message: string, fields?: LogFields): void {
    console.error(line('ERROR', message, fields));
  },
};
