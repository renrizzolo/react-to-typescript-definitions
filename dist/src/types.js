"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
var babel_generator_1 = __importDefault(require("babel-generator"));
var chalk_1 = __importDefault(require("chalk"));
var dom = __importStar(require("dts-dom"));
var typings_1 = require("./typings");
function getTypeDeclaration(type, optional) {
    return {
        type: type,
        optional: optional
    };
}
function get(ast, propertyAst, importedPropTypes, options) {
    try {
        var simpleType = getSimpleType(ast, propertyAst, importedPropTypes);
        if (simpleType) {
            return simpleType;
        }
        var complexType = getComplexType(ast, propertyAst, importedPropTypes, options);
        if (complexType) {
            return complexType;
        }
    }
    catch (e) {
        if (e.loc) {
            printErrorWithContext(e, ast.ast, options);
        }
        else {
            console.error('Failed to infer PropType; Fallback to any');
            console.error(e.stack);
        }
    }
    return {
        type: 'any',
        optional: true
    };
}
exports.get = get;
// tslint:disable:next-line cyclomatic-complexity
function getSimpleType(ast, propertyAst, importedPropTypes) {
    var _a = getSimpleTypeName(ast, propertyAst, importedPropTypes), required = _a[0], simpleTypeName = _a[1];
    switch (simpleTypeName) {
        case 'any':
            return getTypeDeclaration('any', !required);
        case 'array':
            return getTypeDeclaration(dom.create.array('any'), !required);
        case 'bool':
            return getTypeDeclaration('boolean', !required);
        case 'func':
            return getTypeDeclaration(dom.create.functionType([
                dom.create.parameter('args', dom.create.array('any'), dom.ParameterFlags.Rest)
            ], 'any'), !required);
        case 'number':
            return getTypeDeclaration('number', !required);
        case 'object':
            return getTypeDeclaration(dom.create.namedTypeReference('Object'), !required);
        case 'string':
            return getTypeDeclaration('string', !required);
        case 'node':
            return getTypeDeclaration(dom.create.namedTypeReference('React.ReactNode'), !required);
        case 'element':
            return getTypeDeclaration(dom.create.namedTypeReference('React.ReactElement<any>'), !required);
        case 'symbol':
            return getTypeDeclaration(dom.create.namedTypeReference('Symbol'), !required);
    }
    return undefined;
}
function getComplexType(ast, propertyAst, importedPropTypes, options) {
    var _a = getComplexTypeName(ast, propertyAst, importedPropTypes), required = _a[0], complexTypeName = _a[1], typeAst = _a[2];
    switch (complexTypeName) {
        case 'instanceOf':
            return getTypeDeclaration(dom.create.namedTypeReference(typeAst.arguments[0].name), !required);
        case 'oneOfType':
            var typeDecls = typeAst.arguments[0].elements.map(function (subtree) {
                return get(ast, subtree, importedPropTypes, options);
            });
            return getTypeDeclaration(dom.create.union(typeDecls.map(function (type) { return type.type; })), !required);
        case 'arrayOf':
            var typeDecl = get(ast, typeAst.arguments[0], importedPropTypes, options);
            return getTypeDeclaration(dom.create.array(typeDecl.type), !required);
        case 'oneOf':
            // tslint:disable:next-line comment-format
            // FIXME: This should better be a real enum
            var enumEntries = getEnumValues(ast, typeAst.arguments[0]);
            return getTypeDeclaration(dom.create.union(enumEntries), !required);
        case 'shape':
            var entries = getShapeProperties(ast, typeAst.arguments[0]).map(function (entry) {
                var typeDecl = get(ast, entry.value, importedPropTypes, options);
                return dom.create.property(entry.key.type === 'StringLiteral' ? "" + entry.key.value : entry.key.name, typeDecl.type, typeDecl.optional
                    ? dom.DeclarationFlags.Optional
                    : dom.DeclarationFlags.None);
            });
            return getTypeDeclaration(dom.create.objectType(entries), !required);
    }
    return undefined;
}
function isRequired(ast, propertyAst) {
    var required = ast.querySubtree(propertyAst, "\n    MemberExpression /:property Identifier[@name == 'isRequired']\n  ");
    if (required.length > 0) {
        return [true, propertyAst.object];
    }
    return [false, propertyAst];
}
function getSimpleTypeName(ast, propertyAst, importedPropTypes) {
    var propTypesName = importedPropTypes.propTypesName, propTypes = importedPropTypes.propTypes;
    var _a = isRequired(ast, propertyAst), required = _a[0], typeAst = _a[1];
    if (!propTypesName && typeAst.type === 'Identifier') {
        var propType = propTypes.find(function (_a) {
            var localName = _a.localName;
            return localName === typeAst.name;
        });
        return [required, propType ? propType.importedName : undefined];
    }
    var res = ast.querySubtree(typeAst, "\n    MemberExpression[\n      (" + typings_1.propTypeQueryExpression(propTypesName) + ")\n      &&\n        /:property Identifier\n    ]\n    /:property Identifier\n  ");
    return [required, res.length > 0 ? res[0].name : undefined];
}
function getComplexTypeName(ast, propertyAst, importedPropTypes) {
    var _a = isRequired(ast, propertyAst), required = _a[0], typeAst = _a[1];
    if (typeAst.type === 'CallExpression') {
        var _b = getSimpleTypeName(ast, typeAst.callee, importedPropTypes), simpleTypeName = _b[1];
        return [required, simpleTypeName, typeAst];
    }
    return [required, undefined, typeAst];
}
function getEnumValues(ast, oneOfTypes) {
    oneOfTypes = resolveIdentifier(ast, oneOfTypes);
    if (!oneOfTypes.elements) {
        throwWithLocation('Failed to lookup enum values', oneOfTypes);
    }
    return oneOfTypes.elements.map(function (element) {
        element = resolveIdentifier(ast, element);
        if (element.type === 'StringLiteral') {
            return dom.type.stringLiteral(element.value);
        }
        if (element.type === 'NumericLiteral') {
            return dom.type.numberLiteral(element.value);
        }
        return 'any';
    });
}
function getShapeProperties(ast, input) {
    input = resolveIdentifier(ast, input);
    if (!input.properties) {
        throwWithLocation('Failed to lookup shape properties', input);
    }
    return input.properties;
}
function resolveIdentifier(ast, input) {
    if (input.type !== 'Identifier') {
        return input;
    }
    var res = ast.query("\n    //VariableDeclarator[\n      /:id Identifier[@name == '" + input.name + "']\n    ]\n    /:init *\n  ");
    if (!res[0]) {
        throwWithLocation('Failed to lookup identifier', input);
    }
    return res[0];
}
function throwWithLocation(message, ast) {
    var error = new Error(message);
    error.loc = ast.loc;
    error.start = ast.start;
    error.end = ast.end;
    throw error;
}
function printErrorWithContext(e, ast, options) {
    console.error((options.filename || '') + " " + e.message);
    var src = options.source || babel_generator_1.default(ast.ast).code;
    // console.log(src.substring(e.start, e.end));
    var lines = src.split('\n');
    var errorLine = lines[e.loc.start.line - 1];
    console.error("Line " + (e.loc.start.line - 1) + ": " + lines[e.loc.start.line - 2]);
    // tslint:disable-next-line prefer-template
    console.error("Line " + e.loc.start.line + ": " + errorLine.substring(0, e.loc.start.column) + chalk_1.default.red(errorLine.substring(e.loc.start.column, e.loc.end.column)) + errorLine.substring(e.loc.end.column));
    console.error("Line " + (e.loc.start.line + 1) + ": " + lines[e.loc.start.line]);
    console.error();
}
//# sourceMappingURL=types.js.map