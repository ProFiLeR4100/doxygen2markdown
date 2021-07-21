"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterUtils = void 0;
var ArrayUtils_1 = require("./ArrayUtils");
var ParameterUtils = /** @class */ (function () {
    function ParameterUtils() {
    }
    ParameterUtils.ConvertParameterDescription = function (parameterKind) {
        return parameterKind.map(function (item) {
            if ((item === null || item === void 0 ? void 0 : item.kind) === 'return') {
                return {
                    kind: item === null || item === void 0 ? void 0 : item.kind,
                    description: item === null || item === void 0 ? void 0 : item.para
                };
            }
            return {
                kind: item === null || item === void 0 ? void 0 : item.kind,
                parameters: ArrayUtils_1.ArrayUtils
                    .ToArray(item === null || item === void 0 ? void 0 : item.parameteritem)
                    .map(function (item) {
                    var _a, _b, _c;
                    return {
                        name: (_a = item === null || item === void 0 ? void 0 : item.parameternamelist) === null || _a === void 0 ? void 0 : _a.parametername,
                        description: ((_b = item === null || item === void 0 ? void 0 : item.parameterdescription) === null || _b === void 0 ? void 0 : _b.para) ? (_c = item === null || item === void 0 ? void 0 : item.parameterdescription) === null || _c === void 0 ? void 0 : _c.para : item === null || item === void 0 ? void 0 : item.parameterdescription
                    };
                })
            };
        });
    };
    ParameterUtils.CollectParametersFromDescription = function (descriptionPara) {
        return ArrayUtils_1.ArrayUtils
            .ToArray(descriptionPara)
            .filter(function (item) { return !!(item === null || item === void 0 ? void 0 : item.simplesect) || !!(item === null || item === void 0 ? void 0 : item.parameterlist); })
            .map(function (item) {
            return __spreadArray(__spreadArray([], ArrayUtils_1.ArrayUtils.ToArray(item === null || item === void 0 ? void 0 : item.simplesect)), ArrayUtils_1.ArrayUtils.ToArray(item === null || item === void 0 ? void 0 : item.parameterlist));
        })
            .flat();
    };
    return ParameterUtils;
}());
exports.ParameterUtils = ParameterUtils;
