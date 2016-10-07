import { Headers, Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { STATUS_CODE_INFO, STATUS } from './http-status-codes';
import { isSuccess } from './in-memory-backend.service';
export var Utils = (function () {
    function Utils() {
    }
    Utils.setStatusText = function (options) {
        try {
            var statusCode = STATUS_CODE_INFO[options.status];
            options['statusText'] = statusCode ? statusCode.text : 'Unknown Status';
            return options;
        }
        catch (err) {
            return new ResponseOptions({
                status: STATUS.INTERNAL_SERVER_ERROR,
                statusText: 'Invalid Server Operation'
            });
        }
    };
    Utils.createErrorResponse = function (status, message) {
        return new ResponseOptions({
            body: { 'error': "" + message },
            headers: new Headers({ 'Content-Type': 'application/json' }),
            status: status
        });
    };
    Utils.createObservableResponse = function (resOptions, config) {
        resOptions = Utils.setStatusText(resOptions);
        if (config.defaultResponseOptions) {
            resOptions = config.defaultResponseOptions.merge(resOptions);
        }
        var res = new Response(resOptions);
        return new Observable(function (responseObserver) {
            if (isSuccess(res.status)) {
                responseObserver.next(res);
                responseObserver.complete();
            }
            else {
                responseObserver.error(res);
            }
            return function () { }; // unsubscribe function
        })
            .delay(config.delay || 500);
    };
    Utils.findById = function (collection, id) {
        return collection.find(function (item) { return item.id === id; });
    };
    Utils.clone = function (data) {
        return JSON.parse(JSON.stringify(data));
    };
    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    Utils.applyQuery = function (collection, filter, config) {
        var query = new URLSearchParams(filter);
        // extract filtering conditions - {propertyName, RegExps) - from query/search parameters
        var conditions = [];
        var caseSensitive = config.caseSensitiveSearch ? undefined : 'i';
        query.paramsMap.forEach(function (value, name) {
            value.forEach(function (v) { return conditions.push({ name: name, rx: new RegExp(decodeURI(v), caseSensitive) }); });
        });
        var len = conditions.length;
        if (!len) {
            return collection;
        }
        // AND the RegExp conditions
        return collection.filter(function (row) {
            var ok = true;
            var i = len;
            while (ok && i) {
                i -= 1;
                var cond = conditions[i];
                ok = cond.rx.test(row[cond.name]);
            }
            return ok;
        });
    };
    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    Utils.applyPaging = function (collection, params) {
        if (!params.skip && !params.limit)
            return collection;
        var length = collection.length;
        var start = params.skip < length ? params.skip : length;
        var end = start + params.limit;
        if (length < end)
            end = length;
        var list = collection.slice(start, end);
        return list;
    };
    return Utils;
}());
//# sourceMappingURL=utils.js.map