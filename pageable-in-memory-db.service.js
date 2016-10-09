var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ResponseOptions } from '@angular/http';
import 'rxjs/add/operator/delay';
import { InMemoryDbService } from './in-memory-backend.service';
import { STATUS } from './http-status-codes';
import { UrlParametersParser } from './url-parameters';
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
export var PageableInMemoryDbService = (function (_super) {
    __extends(PageableInMemoryDbService, _super);
    function PageableInMemoryDbService(parserConfig) {
        _super.call(this);
        this.paramsParser = null;
        this.paramsParser = new UrlParametersParser(parserConfig);
    }
    PageableInMemoryDbService.prototype.get = function (args) {
        var collection = args.requestInfo.collection;
        var collectionName = args.requestInfo.collectionName;
        var config = args.config;
        var reqInfo = args.requestInfo;
        try {
            if (collection) {
                var resOptions = this.internalGet(reqInfo, config);
                return Utils.createObservableResponse(resOptions, config);
            }
            else if (args.passThruBackend) {
                return args.passThruBackend.createConnection(reqInfo.req).response;
            }
            else {
                var resOptions = Utils.createErrorResponse(STATUS.NOT_FOUND, "Collection '" + collectionName + "' not found");
                return Utils.createObservableResponse(resOptions, config);
            }
        }
        catch (error) {
            var err = error.message || error;
            var resOptions = Utils.createErrorResponse(STATUS.INTERNAL_SERVER_ERROR, "" + err);
            return Utils.createObservableResponse(resOptions, config);
        }
    };
    PageableInMemoryDbService.prototype.internalGet = function (_a, config) {
        var id = _a.id, query = _a.query, collection = _a.collection, collectionName = _a.collectionName, headers = _a.headers;
        var data = collection;
        if (id) {
            data = Utils.findById(collection, id);
        }
        else if (query) {
            var params = this.paramsParser.parse(query);
            if (params.filter) {
                data = Utils.applyQuery(collection, params.filter, config);
            }
            if (data) {
                data = Utils.applyPaging(data, params);
            }
        }
        if (!data) {
            return Utils.createErrorResponse(STATUS.NOT_FOUND, "'" + collectionName + "' with id='" + id + "' not found");
        }
        return new ResponseOptions({
            body: { data: Utils.clone(data) },
            headers: headers,
            status: STATUS.OK
        });
    };
    return PageableInMemoryDbService;
}(InMemoryDbService));
//# sourceMappingURL=pageable-in-memory-db.service.js.map