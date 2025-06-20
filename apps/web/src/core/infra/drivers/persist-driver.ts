interface PersistDriver<T> {
  set(key: string, value: T): void;
  get(key: string): T | null;
}

export class LocalStoragePersistDriver<T = any> implements PersistDriver<T> {
  set(key: string, value: T): void {
    localStorage.setItem(key, value as any);
  }

  get(key: string) {
    return localStorage.getItem(key) as T;
  }
}
