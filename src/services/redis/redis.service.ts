import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string): Promise<T> {
    return this.cache.get(key);
  }

  set<T>(key: string, value: unknown, ttl: number): Promise<T> {
    const options = ttl ? { ttl } : null;

    return this.cache.set(key, value, options);
  }

  async del<T>(key: string): Promise<T> {
    const [value] = await Promise.all([
      this.cache.get(key),
      this.cache.del(key),
    ]);

    return value;
  }
}
