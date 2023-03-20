import { injectable } from 'tsyringe'
import Redis from 'ioredis'
import { RedisRepository } from '../redis-repository'
import { env } from '@/application/env'

@injectable()
export class RedisProvider implements RedisRepository {
  public redisClient: Redis

  constructor() {
    const { REDISHOST, REDISPASSWORD, REDISPORT, REDISUSER } = env
    this.redisClient = new Redis({
      port: REDISPORT,
      host: REDISHOST,
      username: REDISUSER,
      password: REDISPASSWORD,
    })
  }

  async disconnect(): Promise<void> {
    this.redisClient.disconnect()
  }

  async connect(): Promise<void> {
    await this.redisClient.connect()
  }

  async setValue(key: string, value: string, expire: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expire)
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }
}
