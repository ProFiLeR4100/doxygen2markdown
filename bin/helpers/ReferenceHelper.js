"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceHelper = /** @class */ (function () {
    function ReferenceHelper() {
    }
    ReferenceHelper.ReferenceToLink = function (memberdef) {
        if (!memberdef)
            return;
        return memberdef.kindref === "compound" ? "[" + (!!memberdef ? memberdef.$t : memberdef.type) + "](" + memberdef.refid + ".md#" + memberdef.$t + ")" : "#" + memberdef.$t;
    };
    ReferenceHelper.InheritanceReferenceToLink = function (memberdef) {
        if (!memberdef)
            return;
        return memberdef.kindref === "compound" ? "[: " + (!!memberdef ? memberdef.$t : memberdef.type) + "](" + memberdef.refid + ".md#" + memberdef.$t + ")" : "#" + memberdef.$t;
    };
    return ReferenceHelper;
}());
exports.ReferenceHelper = ReferenceHelper;
