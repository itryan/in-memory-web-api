import { ResponseOptions } from '@angular/http';
import 'rxjs/add/operator/delay';
import { InMemoryDbService, HttpMethodInterceptorArgs, InMemoryBackendConfigArgs, RequestInfo } from './in-memory-backend.service';
import { UrlParametersParserConfig } from './url-parameters';
/**
* Interface for a class that creates an in-memory database
*
* Its `createDb` method creates a hash of named collections that represents the database
*
* For maximum flexibility, the service may define HTTP method overrides.
* Such methods must match the spelling of an HTTP method in lower case (e.g, "get").
* If a request has a matching method, it will be called as in
* `get(info: requestInfo, db: {})` where `db` is the database object described above.
*/
export declare abstract class PageableInMemoryDbService extends InMemoryDbService {
    private paramsParser;
    constructor(parserConfig: UrlParametersParserConfig);
    get(args: HttpMethodInterceptorArgs): any;
    protected internalGet({id, query, collection, collectionName, headers}: RequestInfo, config: InMemoryBackendConfigArgs): ResponseOptions;
}
