import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'

const prisma = new PrismaClient()

function generatePrismaDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

function generateRedisDatabase(): Redis {
  if (!process.env.REDISPASSWORD || !process.env.REDISUSER) {
    throw new Error('Please provide a REDIS environment variables')
  }

  // TODO mock Redis RB instead 'real' db
  const redis = new Redis({
    port: 6379,
    host: 'localhost',
    username: process.env.REDISUSER,
    password: process.env.REDISPASSWORD,
  })

  return redis
}

export default <Environment>{
  name: 'e2e-databases',
  async setup() {
    const prismaSchema = randomUUID()
    const databaseURL = generatePrismaDatabaseUrl(prismaSchema)
    process.env.DATABASE_URL = databaseURL
    execSync('npx prisma migrate deploy')

    generateRedisDatabase()
    const redis = generateRedisDatabase()

    return {
      async teardown() {
        await prisma.$queryRawUnsafe(
          `DROP SCHEMA IF EXISTS "${prismaSchema}" CASCADE`,
        )
        await prisma.$disconnect()
        redis.disconnect()
      },
    }
  },
}
