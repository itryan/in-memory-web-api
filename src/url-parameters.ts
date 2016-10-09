import { URLSearchParams } from '@angular/http';

export class UrlParametersInfo {
  skip: number;
  limit: number;
  filter: string;
}

export class UrlParametersParserConfig {
  skip: string;
  limit: string;
  filter: string;
}

export class UrlParametersParser {

  constructor(private config: UrlParametersParserConfig) {

  }

  parse(query: URLSearchParams): UrlParametersInfo {
    let info = new UrlParametersInfo();
    if (this.config.skip && this.config.limit) {
      var skip = query.get(this.config.skip);
      var limit = query.get(this.config.limit);
      if (skip != null || limit != null) {
        info.skip = +skip;
        info.limit = +limit || null;
      }
    }

    if (this.config.filter)
      info.filter = decodeURIComponent(query.get(this.config.filter) || '');

    return info;
  }
}