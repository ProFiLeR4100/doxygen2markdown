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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
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
        Converter.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            Converter.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var type = !!((_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.type) === null || _b === void 0 ? void 0 : _b.ref) ? memberdef.type.ref.$t : memberdef.type;
        if (typeof type === 'object') {
            type = !Object.keys(type).length ? memberdef.name : type;
        }
        return {
            // self signature
            typeDef: Converter.ConvertTypeDef(memberdef),
            initializer: typeof memberdef.initializer == 'object' ? '= {...}' : memberdef.initializer,
            // returns
            type: type,
            typeRef: (_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.type) === null || _d === void 0 ? void 0 : _d.ref,
            anchoredTypeRef: ((_g = (_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.type) === null || _f === void 0 ? void 0 : _f.ref) === null || _g === void 0 ? void 0 : _g.kindref) == "compound" ? "[" + (!!memberdef.type.ref ? memberdef.type.ref.$t : memberdef.type) + "](" + ((_k = (_j = (_h = memberdef) === null || _h === void 0 ? void 0 : _h.type) === null || _j === void 0 ? void 0 : _j.ref) === null || _k === void 0 ? void 0 : _k.refid) + ".md#" + ((_o = (_m = (_l = memberdef) === null || _l === void 0 ? void 0 : _l.type) === null || _m === void 0 ? void 0 : _m.ref) === null || _o === void 0 ? void 0 : _o.$t) + ")" : "#" + ((_r = (_q = (_p = memberdef) === null || _p === void 0 ? void 0 : _p.type) === null || _q === void 0 ? void 0 : _q.ref) === null || _r === void 0 ? void 0 : _r.$t),
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
        var description = Converter.ToArray((_b = (_a = memberdef) === null || _a === void 0 ? void 0 : _a.briefdescription) === null || _b === void 0 ? void 0 : _b.para)
            .concat(Converter.ToArray((_d = (_c = memberdef) === null || _c === void 0 ? void 0 : _c.detaileddescription) === null || _d === void 0 ? void 0 : _d.para))
            .filter(function (item) { return typeof item === 'string'; });
        return {
            description: description,
            paramDescription: Converter.ConvertParameterDescription((_f = (_e = memberdef) === null || _e === void 0 ? void 0 : _e.briefdescription) === null || _f === void 0 ? void 0 : _f.para)
                .concat(Converter.ConvertParameterDescription((_h = (_g = memberdef) === null || _g === void 0 ? void 0 : _g.detaileddescription) === null || _h === void 0 ? void 0 : _h.para))
        };
    };
    Converter.ConvertParameterDescription = function (detailedDescriptionPara) {
        return Converter
            .ToArray(detailedDescriptionPara)
            .filter(function (item) { var _a, _b; return !!((_a = item) === null || _a === void 0 ? void 0 : _a.simplesect) || !!((_b = item) === null || _b === void 0 ? void 0 : _b.parameterlist); })
            .map(function (item) {
            var _a, _b;
            return __spreadArrays(Converter.ToArray((_a = item) === null || _a === void 0 ? void 0 : _a.simplesect), Converter.ToArray((_b = item) === null || _b === void 0 ? void 0 : _b.parameterlist));
        })
            .flat()
            .map(function (item) {
            var _a, _b, _c, _d, _e;
            if (((_a = item) === null || _a === void 0 ? void 0 : _a.kind) === 'return') {
                return {
                    kind: (_b = item) === null || _b === void 0 ? void 0 : _b.kind,
                    description: (_c = item) === null || _c === void 0 ? void 0 : _c.para
                };
            }
            return {
                kind: (_d = item) === null || _d === void 0 ? void 0 : _d.kind,
                parameters: Converter
                    .ToArray((_e = item) === null || _e === void 0 ? void 0 : _e.parameteritem)
                    .map(function (item) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    return {
                        name: (_b = (_a = item) === null || _a === void 0 ? void 0 : _a.parameternamelist) === null || _b === void 0 ? void 0 : _b.parametername,
                        description: ((_d = (_c = item) === null || _c === void 0 ? void 0 : _c.parameterdescription) === null || _d === void 0 ? void 0 : _d.para) ? (_f = (_e = item) === null || _e === void 0 ? void 0 : _e.parameterdescription) === null || _f === void 0 ? void 0 : _f.para : (_g = item) === null || _g === void 0 ? void 0 : _g.parameterdescription
                    };
                })
            };
        });
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
        Converter.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('func') == -1)
                return;
            Converter.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertProperties = function (compound) {
        var result = [];
        Converter.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('prop') == -1)
                return;
            Converter.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ConvertAttributes = function (compound) {
        var result = [];
        Converter.ToArray(compound.sectiondef).forEach(function (sectiondef) {
            if (sectiondef.kind.indexOf('attrib') == -1)
                return;
            Converter.ToArray(sectiondef.memberdef).forEach(function (memberdef) {
                result.push(Converter.ConvertMemberDef(memberdef));
            });
        });
        return result;
    };
    Converter.ToArray = function (obj) {
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
