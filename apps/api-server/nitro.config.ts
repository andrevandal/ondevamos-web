// https://nitro.unjs.io/config

const {
  DATABASE_URL,
  SESSION_SECRET,
  ADMIN_TOKEN,
  MINIO_ENDPOINT,
  MINIO_ENDPOINT_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
} = process.env

export default defineNitroConfig({
  esbuild: {
    options: {
      target: 'esnext',
    },
  },
  runtimeConfig: {
    databaseUrl: DATABASE_URL,
    sessionSecret: SESSION_SECRET,
    adminToken: ADMIN_TOKEN,
    minioEndpoint: MINIO_ENDPOINT,
    minioEndpointPort: Number(MINIO_ENDPOINT_PORT),
    minioAccessKey: MINIO_ACCESS_KEY,
    minioSecretKey: MINIO_SECRET_KEY,
    minioBucketName: MINIO_BUCKET_NAME,
  },
})
