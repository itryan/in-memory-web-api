import { URLSearchParams } from '@angular/http';
export declare class UrlParametersInfo {
    skip: number;
    limit: number;
    filter: string;
}
export declare class UrlParametersParserConfig {
    skip: string;
    limit: string;
    filter: string;
}
export declare class UrlParametersParser {
    private config;
    constructor(config: UrlParametersParserConfig);
    parse(query: URLSearchParams): UrlParametersInfo;
}
