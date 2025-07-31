import { HttpContext, HttpContextToken, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';

import { HttpCacheService } from '../services/http-cache.service';

export type CacheConfig = {
  providesTags?: string[];
  invalidatesTags?: string[];
  invalidateTagsOnError?: boolean;
  maxAge?: number;
};

export const CACHE_CONFIG = new HttpContextToken<CacheConfig | null>(() => null);

export const buildHttpContextWithCache = (config: CacheConfig = {}) =>
  new HttpContext().set(CACHE_CONFIG, { invalidateTagsOnError: false, ...config });

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const httpCacheService = inject<HttpCacheService>(HttpCacheService);

  const cacheConfig = req.context.get(CACHE_CONFIG);

  if (!cacheConfig) {
    return next(req);
  }

  const cacheKey = httpCacheService.createKeyByRequest(req);
  const cacheData = httpCacheService.get(cacheKey);

  if (cacheData) {
    return of(cacheData.response);
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (!(event instanceof HttpResponse)) {
          return;
        }

        if (cacheConfig.invalidatesTags?.length) {
          httpCacheService.invalidateTags(cacheConfig.invalidatesTags);
        }

        if (req.method === 'GET') {
          httpCacheService.setResponse(cacheKey, event, cacheConfig);
        }
      },
      error: () => {
        if (cacheConfig.invalidateTagsOnError && cacheConfig.invalidatesTags?.length) {
          httpCacheService.invalidateTags(cacheConfig.invalidatesTags);
        }
      },
    }),
  );
};
