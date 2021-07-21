"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceUtils = void 0;
var ReferenceUtils = /** @class */ (function () {
    function ReferenceUtils() {
    }
    ReferenceUtils.ReferenceToLink = function (memberdef) {
        if (!memberdef)
            return null;
        return memberdef.kindref === "compound" ? "[" + memberdef.$t + "](" + memberdef.refid + ".md#" + memberdef.$t + ")" : "#" + memberdef.$t;
    };
    ReferenceUtils.InheritanceToLink = function (memberdef) {
        var _a, _b;
        if (!memberdef)
            return null;
        var reimplementsRegex = /(.*)_.*$/gm;
        var reimplements = null;
        if (memberdef.reimplements) {
            reimplements = reimplementsRegex.exec((_a = memberdef === null || memberdef === void 0 ? void 0 : memberdef.reimplements) === null || _a === void 0 ? void 0 : _a.refid);
        }
        return reimplements && "[: " + memberdef.reimplements.$t + "](" + reimplements[1] + ".md#" + ((_b = memberdef === null || memberdef === void 0 ? void 0 : memberdef.reimplements) === null || _b === void 0 ? void 0 : _b.refid) + ")";
    };
    return ReferenceUtils;
}());
exports.ReferenceUtils = ReferenceUtils;
