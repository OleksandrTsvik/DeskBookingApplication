import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@/environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  let requestUrl = req.url;

  if (requestUrl.startsWith('@api')) {
    requestUrl = requestUrl.replace('@api', environment.apiUrl);
  }

  req = req.clone({ url: requestUrl });

  return next(req);
};
