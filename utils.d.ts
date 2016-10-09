import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { InMemoryBackendConfigArgs } from './in-memory-backend.service';
import { UrlParametersInfo } from './url-parameters';
export declare class Utils {
    static setStatusText(options: ResponseOptions): ResponseOptions;
    static createErrorResponse(status: number, message: string): ResponseOptions;
    static createObservableResponse(resOptions: ResponseOptions, config: InMemoryBackendConfigArgs): Observable<Response>;
    static findById(collection: any[], id: number | string): any;
    static clone(data: any): any;
    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    static applyQuery(collection: any[], filter: string, config: InMemoryBackendConfigArgs): any[];
    /**
     * Apply query/search parameters as a filter over the collection
     * This impl only supports RegExp queries on string properties of the collection
     * ANDs the conditions together
     */
    static applyPaging(collection: any[], params: UrlParametersInfo): any[];
}
