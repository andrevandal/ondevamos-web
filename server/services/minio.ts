import * as Minio from 'minio'

const {
  minioEndpoint,
  minioEndpointPort,
  minioAccessKey,
  minioSecretKey,
  minioBucketName,
} = useRuntimeConfig()

export const bucketName = minioBucketName
export const endPoint = minioEndpoint

export const client = new Minio.Client({
  endPoint: minioEndpoint,
  port: minioEndpointPort,
  useSSL: true,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
})

export default {
  client,
  bucketName,
}
