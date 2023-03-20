import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  REDISPORT: z.coerce.number().default(5432),
  REDISPASSWORD: z.string(),
  REDISUSER: z.string(),
  REDISHOST: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid enviroment variables')
}

export const env = _env.data
