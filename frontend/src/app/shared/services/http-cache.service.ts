import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CacheService } from './cache.service';

type HttpCacheData = {
  response: HttpResponse<unknown>;
  providesTags?: string[];
};

type HttpCacheResponseConfig = {
  providesTags?: string[];
  maxAge?: number;
};

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService extends CacheService<HttpCacheData> {
  createKeyByRequest(request: HttpRequest<unknown>): string {
    return `${request.method}: ${request.urlWithParams}`;
  }

  setResponse(key: string, response: HttpResponse<unknown>, config?: HttpCacheResponseConfig): void {
    this.set(
      key,
      {
        response,
        providesTags: config?.providesTags,
      },
      config?.maxAge,
    );
  }

  invalidateTags(tags: string[]): void {
    this.deleteBy(({ providesTags }) => providesTags && tags.some((tag) => providesTags.includes(tag)));
  }
}
