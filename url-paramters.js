export var UrlParametersInfo = (function () {
    function UrlParametersInfo() {
    }
    return UrlParametersInfo;
}());
export var UrlParametersParserConfig = (function () {
    function UrlParametersParserConfig() {
    }
    return UrlParametersParserConfig;
}());
export var UrlParametersParser = (function () {
    function UrlParametersParser(config) {
        this.config = config;
    }
    UrlParametersParser.prototype.parse = function (query) {
        var info = new UrlParametersInfo();
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
    };
    return UrlParametersParser;
}());
//# sourceMappingURL=url-paramters.js.map