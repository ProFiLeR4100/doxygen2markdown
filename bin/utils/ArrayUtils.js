"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayUtils = void 0;
var ArrayUtils = /** @class */ (function () {
    function ArrayUtils() {
    }
    ArrayUtils.ToArray = function (obj) {
        if (!obj) {
            return [];
        }
        else if (Array.isArray(obj)) {
            return obj;
        }
        else {
            return [obj];
        }
    };
    return ArrayUtils;
}());
exports.ArrayUtils = ArrayUtils;
