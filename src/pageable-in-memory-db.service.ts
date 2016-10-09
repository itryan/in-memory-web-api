import { ResponseOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/delay';
import { InMemoryDbService, HttpMethodInterceptorArgs, InMemoryBackendConfigArgs, RequestInfo } from './in-memory-backend.service';
import { STATUS } from './http-status-codes';
import { UrlParametersParserConfig, UrlParametersParser } from './url-parameters'
import { Utils } from './utils';


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
export abstract class PageableInMemoryDbService extends InMemoryDbService {

  private paramsParser: UrlParametersParser = null;

  constructor(parserConfig: UrlParametersParserConfig) {
    super();
    this.paramsParser = new UrlParametersParser(parserConfig);
  }

  get(args: HttpMethodInterceptorArgs) {
    let collection = args.requestInfo.collection;
    let collectionName = args.requestInfo.collectionName;
    let config = args.config;
    const reqInfo = args.requestInfo;

    try {
      if (collection) {
        let resOptions = this.internalGet(reqInfo, config);
        return Utils.createObservableResponse(resOptions, config);
      } else if (args.passThruBackend) {
        return args.passThruBackend.createConnection(reqInfo.req).response;
      } else {
        let resOptions = Utils.createErrorResponse(STATUS.NOT_FOUND, `Collection '${collectionName}' not found`);
        return Utils.createObservableResponse(resOptions, config);
      }
    } catch (error) {
      const err = error.message || error;
      let resOptions = Utils.createErrorResponse(STATUS.INTERNAL_SERVER_ERROR, `${err}`);
      return Utils.createObservableResponse(resOptions, config);
    }
  }

  protected internalGet({id, query, collection, collectionName, headers}: RequestInfo, config: InMemoryBackendConfigArgs) {
    let data = collection;

    if (id) {
      data = Utils.findById(collection, id);
    } else if (query) {
      let params = this.paramsParser.parse(query);
      if (params.filter) {
        data = Utils.applyQuery(collection, params.filter, config);
      }
      if (data) {
        data = Utils.applyPaging(data, params)
      }
    }

    if (!data) {
      return Utils.createErrorResponse(STATUS.NOT_FOUND,
        `'${collectionName}' with id='${id}' not found`);
    }
    return new ResponseOptions({
      body: { data: Utils.clone(data) },
      headers: headers,
      status: STATUS.OK
    });
  }
}
