import { RedisRepository } from '../redis-repository'

export class RedisMock implements RedisRepository {
  public redisClient = new Map()

  async setValue(key: string, value: string, expire: number): Promise<void> {
    this.redisClient.set(key, value)
  }

  async getValue(key: string): Promise<string> {
    return this.redisClient.get(key)
  }

  async delete(key: string): Promise<void> {
    this.redisClient.delete(key)
  }
}
