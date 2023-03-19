export interface RedisRepository {
  setValue(key: string, value: string, expire: number): Promise<void>
  getValue(key: string): Promise<string>
  delete(key: string): Promise<void>
}
