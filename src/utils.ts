import { Headers, Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { STATUS_CODE_INFO, STATUS } from './http-status-codes';
import { InMemoryBackendConfigArgs, isSuccess } from './in-memory-backend.service';
import { UrlParametersInfo } from './url-parameters';

export class Utils {

  static setStatusText(options: ResponseOptions) {
    try {
      const statusCode = STATUS_CODE_INFO[options.status];
      options['statusText'] = statusCode ? statusCode.text : 'Unknown Status';
      return options;
    } catch (err) {
      return new ResponseOptions({
        status: STATUS.INTERNAL_SERVER_ERROR,
        statusText: 'Invalid Server Operation'
      });
    }
  }

  static createErrorResponse(status: number, message: string) {
    return new ResponseOptions({
      body: { 'error': `${message}` },
      headers: new Headers({ 'Content-Type': 'application/json' }),
      status: status
    });
  }

  static createObservableResponse(resOptions: ResponseOptions, config: InMemoryBackendConfigArgs): Observable<Response> {
    resOptions = Utils.setStatusText(resOptions);
    if (config.defaultResponseOptions) {
      resOptions = config.defaultResponseOptions.merge(resOptions);
    }

    const res = new Response(resOptions);

    return new Observable<Response>((responseObserver: Observer<Response>) => {
      if (isSuccess(res.status)) {
        responseObserver.next(res);
        responseObserver.complete();
      } else {
        responseObserver.error(res);
      }
      return () => { }; // unsubscribe function
    })
      .delay(config.delay || 500);
  }

  static findById(collection: any[], id: number | string) {
    return collection.find((item: any) => item.id === id);
  }

  static clone(data: any) {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Apply query/search parameters as a filter over the collection
   * This impl only supports RegExp queries on string properties of the collection
   * ANDs the conditions together
   */
  static applyQuery(collection: any[], filter: string, config: InMemoryBackendConfigArgs) {
    let query = new URLSearchParams(filter);

    // extract filtering conditions - {propertyName, RegExps) - from query/search parameters
    const conditions: { name: string, rx: RegExp }[] = [];
    const caseSensitive = config.caseSensitiveSearch ? undefined : 'i';
    query.paramsMap.forEach((value: string[], name: string) => {
      value.forEach(v => conditions.push({ name, rx: new RegExp(decodeURI(v), caseSensitive) }));
    });

    const len = conditions.length;
    if (!len) { return collection; }

    // AND the RegExp conditions
    return collection.filter(row => {
      let ok = true;
      let i = len;
      while (ok && i) {
        i -= 1;
        const cond = conditions[i];
        ok = cond.rx.test(row[cond.name]);
      }
      return ok;
    });
  }

  /**
   * Apply query/search parameters as a filter over the collection
   * This impl only supports RegExp queries on string properties of the collection
   * ANDs the conditions together
   */
  static applyPaging(collection: any[], params: UrlParametersInfo) {
    if (!params.skip && !params.limit)
      return collection;
    let length = collection.length;
    let start = params.skip < length ? params.skip : length;
    let end = start + params.limit;
    if (length < end)
      end = length;
    let list = collection.slice(start, end);
    return list;
  }
}
