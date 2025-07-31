type CacheEntry<T> = {
  data: T;
  maxAge: number;
  timestamp: number;
};

export abstract class CacheService<DataType = any> {
  protected cache = new Map<string, CacheEntry<DataType>>();

  set(key: string, data: DataType, maxAge: number = 90_000): void {
    this.cache.set(key, {
      data,
      maxAge,
      timestamp: new Date().getTime(),
    });
  }

  get(key: string): DataType | null {
    const cacheEntry = this.cache.get(key);

    if (cacheEntry) {
      const { data, maxAge, timestamp } = cacheEntry;
      const currentTime = new Date().getTime();

      if (currentTime - timestamp < maxAge) {
        return data;
      }

      this.delete(key);
    }

    return null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deleteBy(predicate: (data: DataType, key: string) => unknown): void {
    for (const [key, entry] of this.cache.entries()) {
      if (predicate(entry.data, key)) {
        this.delete(key);
      }
    }
  }
}
