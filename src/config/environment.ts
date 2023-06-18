export const environment = {
  APP_TITLE: process.env.APP_TITLE,
  NODE_ENV: process.env.NODE_ENV,
  REGION: process.env.AWS_REGION,
  MONGO_CERT_SECRET: process.env.MONGO_CERT_SECRET,
  DATABASE_CONN_SECRET: process.env.DATABASE_CONN_SECRET,
  REDIS_USERS_HOST: process.env.REDIS_USERS_HOST,
  KEEP_ALIVE_MAX_SOCKETS: parseInt(process.env.KEEP_ALIVE_MAX_SOCKETS, 10) || 100,
  KEEP_ALIVE_MAX_FREE_SOCKETS: parseInt(process.env.KEEP_ALIVE_MAX_FREE_SOCKETS, 10) || 10,
  KEEP_ALIVE_TIMEOUT: parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10) || 60000,
  KEEP_ALIVE_FREE_SOCKET_TIMEOUT: parseInt(process.env.KEEP_ALIVE_FREE_SOCKET_TIMEOUT, 10) || 60000,
  OBFUSCATE_KEYWORDS: ['*.Authorization', '*.access_token', '*.password', '*.senha'],
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE, 10),
  IS_REPLICA_DATABASE: process.env.IS_REPLICA_DATABASE || true,
  TIMEZONE: process.env.TIMEZONE || 'America/Sao_Paulo'
};
