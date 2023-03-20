export interface RedisRepository {
  setValue(key: string, value: string, expire: number): Promise<void>
  getValue(key: string): Promise<string | null>
  delete(key: string): Promise<void>
}
