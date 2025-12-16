import { Injectable } from '@angular/core';
import { Feed, FeedSearchParams } from '../posts/content.service';

@Injectable({
  providedIn: 'root'
})
export class ContentCacheService {
  private cache = new Map<string, Feed>();

  get(params: FeedSearchParams): Feed | undefined {
    const key = this.generateKey(params);
    return this.cache.get(key);
  }

  set(params: FeedSearchParams, feed: Feed): void {
    const key = this.generateKey(params);
    this.cache.set(key, feed);
  }

  has(params: FeedSearchParams): boolean {
    const key = this.generateKey(params);
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(params: FeedSearchParams): boolean {
    const key = this.generateKey(params);
    return this.cache.delete(key);
  }

  private generateKey(params: FeedSearchParams): string {
    return JSON.stringify(params);
  }
}
