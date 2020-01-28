"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Converter = /** @class */ (function () {
    function Converter() {
    }
    Converter.ConvertAll = function (compound) {
        return {
            hierarchy: Converter.ConvertHierarchy(compound),
            summary: Converter.ConvertSummary(compound),
            attributes: Converter.ConvertAttributes(compound),
            properties: Converter.ConvertProperties(compound),
            methods: Converter.ConvertMethods(compound)
        };
    };
    Converter.ConvertHierarchy = function (compound) {
        var _a, _b;
        var result = [];
        if (Array.isArray(compound.basecompoundref)) {
            result.push.apply(result, compound.basecompoundref.map(function (basecompoundref) { return basecompoundref.prot + " " + basecompoundref.$t; }));
        }
        else if ((_b = (_a = compound) === null || _a === void 0 ? void 0 : _a.basecompoundref) === null || _b === void 0 ? void 0 : _b.prot) {
            result.push(compound.basecompoundref.prot + " " + compound.basecompoundref.$t);
        }
        return result;
    };
    Converter.ConvertSummary = function (compound) {
        var result = [];
        Converter.ConvertToArray(compound.sectiondef).forEach(function (sectiondef) {
            Converter.ConvertToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertMemberDef = function (memberdef) {
        return __assign(__assign(__assign(__assign(__assign({}, Converter.ConvertName(memberdef)), Converter.ConvertTypeDefRef(memberdef)), Converter.ConvertFuncDef(memberdef)), Converter.ConvertDescription(memberdef)), { memberdef: memberdef });
    };
    Converter.ConvertName = function (memberdef) {
        var _a, _b;
        return {
            name: memberdef.name,
            anchor: memberdef.id,
            anchoredName: "[" + ((_a = memberdef) === null || _a === void 0 ? void 0 : _a.name) + "](#" + ((_b = memberdef) === null || _b === void 0 ? void 0 : _b.id) + ")"
        };
    };
    Converter.ConvertTypeDefRef = function (memberdef) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return {
            // self signature
            typeDef: Converter.ConvertTypeDef(memberdef),
            initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,
            // returns
            type: !!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type,
            typeRef: (_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.ref,
            anchoredTypeRef: ((_e = (_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.ref) === null || _e === void 0 ? void 0 : _e.kindref) == "compound" ? "[" + (!!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type) + "](" + ((_h = (_g = (_f = memberdef) === null || _f === void 0 ? void 0 : _f.type) === null || _g === void 0 ? void 0 : _g.ref) === null || _h === void 0 ? void 0 : _h.refid) + ".md#" + ((_l = (_k = (_j = memberdef) === null || _j === void 0 ? void 0 : _j.type) === null || _k === void 0 ? void 0 : _k.ref) === null || _l === void 0 ? void 0 : _l.$t) + ")" : "#" + ((_p = (_o = (_m = memberdef) === null || _m === void 0 ? void 0 : _m.type) === null || _o === void 0 ? void 0 : _o.ref) === null || _p === void 0 ? void 0 : _p.$t),
        };
    };
    Converter.ConvertFuncDef = function (memberdef) {
        var _a, _b, _c, _d;
        var reimplementsRegex = /(.*)_.*$/gm;
        var reimplements = null;
        if (memberdef.reimplements) {
            reimplements = reimplementsRegex.exec((_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.reimplements) === null || _b === void 0 ? void 0 : _b.refid);
        }
        return {
            args: memberdef.kind === 'function' ? memberdef.argsstring : '',
            reimplementsAnchor: reimplements ? "[: " + memberdef.reimplements.$t + "](" + reimplements[1] + ".md#" + ((_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.reimplements) === null || _d === void 0 ? void 0 : _d.refid) + ")" : '',
        };
    };
    Converter.ConvertDescription = function (memberdef) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var shortDescription = (_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.briefdescription) === null || _b === void 0 ? void 0 : _b.para;
        var detailedDescription = '';
        if ((_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.detaileddescription) === null || _d === void 0 ? void 0 : _d.para) {
            detailedDescription = ' ' + Converter.ConvertToArray((_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.detaileddescription) === null || _f === void 0 ? void 0 : _f.para)
                .filter(function (item) { return typeof item === 'string'; })
                .join(' ');
        }
        return {
            description: "" + (shortDescription ? shortDescription : '') + (detailedDescription ? detailedDescription : ''),
            paramDescription: Converter.ConvertParameterDescription((_h = (_g = memberdef) === null || _g === void 0 ? void 0 : _g.detaileddescription) === null || _h === void 0 ? void 0 : _h.para)
        };
    };
    Converter.ConvertParameterDescription = function (detailedDescriptionPara) {
        // TODO: FIX
        return Converter
            .ConvertToArray(detailedDescriptionPara)
            .filter(function (item) { return typeof item == 'object'; })
            // .map((item: any) => {
            // console.log(item);
            // 	return item;
            // })
            .map(function (item) {
            var _a;
            var parameterDefs = Converter
                .ConvertToArray((_a = item) === null || _a === void 0 ? void 0 : _a.parameterlist)
                .map(function (parameteritem) {
                var _a;
                return Converter
                    .ConvertToArray((_a = parameteritem) === null || _a === void 0 ? void 0 : _a.parameteritem)
                    .map(function (parameteritem) {
                    var _a, _b, _c, _d, _e;
                    return {
                        kind: (_a = parameteritem) === null || _a === void 0 ? void 0 : _a.kind,
                        name: "`" + ((_c = (_b = parameteritem) === null || _b === void 0 ? void 0 : _b.parameternamelist) === null || _c === void 0 ? void 0 : _c.parametername) + "`",
                        description: (_e = (_d = parameteritem) === null || _d === void 0 ? void 0 : _d.parameterdescription) === null || _e === void 0 ? void 0 : _e.para
                    };
                })
                    .filter(function (parameteritem) { var _a; return !!((_a = parameteritem) === null || _a === void 0 ? void 0 : _a.description); });
            });
            return parameterDefs;
        });
        // .map((item:any) => {
        // 	console.log(JSON.stringify(item, null, '  '));
        // 	return item;
        // })
        // .reduce((prev:any, curr:any) => {
        // 	// console.log(prev, curr);
        // 	return [...prev, curr]
        // }, []);
    };
    Converter.ConvertTypeDef = function (memberdef) {
        var typeDef = '';
        typeDef += memberdef.kind == 'property' ? 'property ' : '';
        typeDef += memberdef.prot + " ";
        typeDef += memberdef.static == 'yes' ? 'static ' : '';
        typeDef += memberdef.const == 'yes' ? 'const ' : '';
        typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
        typeDef += memberdef.virt == 'virtual' ? 'virtual ' : '';
        return typeDef;
    };
    Converter.ConvertMethods = function (compound) {
        var result = [];
        Converter.ConvertToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('func') == -1)
                return;
            Converter.ConvertToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertProperties = function (compound) {
        var result = [];
        Converter.ConvertToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('prop') == -1)
                return;
            Converter.ConvertToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertAttributes = function (compound) {
        var result = [];
        Converter.ConvertToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('attrib') == -1)
                return;
            Converter.ConvertToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertToArray = function (obj) {
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
    return Converter;
}());
exports.Converter = Converter;
