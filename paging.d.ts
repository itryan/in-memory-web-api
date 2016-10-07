import { URLSearchParams } from '@angular/http';
export declare class UrlParameterInfo {
    skip: number;
    limit: number;
    filter: string;
}
export declare class PagingParserConfig {
    skip: string;
    limit: string;
}
export declare class UrlParamsParser {
    private config;
    constructor(config: PagingParserConfig);
    parse(query: URLSearchParams): UrlParameterInfo;
}
