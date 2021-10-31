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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFromAst = exports.generateFromSource = exports.generateFromFile = exports.cli = void 0;
var babylon = __importStar(require("babylon"));
var fs = __importStar(require("fs"));
var get_stdin_1 = __importDefault(require("get-stdin"));
var deprecated_1 = require("./deprecated");
var typings_1 = require("./typings");
function cli(options) {
    var processInput = function (code) {
        var result = generateFromSource(options.topLevelModule ? null : options.moduleName, code, {}, options.reactImport);
        process.stdout.write(result);
    };
    if (options.file) {
        fs.readFile(options.file, function (err, data) {
            if (err) {
                throw err;
            }
            processInput(data.toString());
        });
    }
    else {
        get_stdin_1.default().then(processInput);
    }
}
exports.cli = cli;
function generateFromFile(moduleName, path, options, reactImport) {
    if (options === void 0) { options = {}; }
    if (reactImport === void 0) { reactImport = 'react'; }
    if (!options.filename) {
        options.filename = path;
    }
    return generateFromSource(moduleName, fs.readFileSync(path).toString(), options, reactImport);
}
exports.generateFromFile = generateFromFile;
function generateFromSource(moduleName, code, options, reactImport) {
    if (options === void 0) { options = {}; }
    if (reactImport === void 0) { reactImport = 'react'; }
    var additionalBabylonPlugins = Array.isArray(options.babylonPlugins)
        ? options.babylonPlugins
        : [];
    var ast = babylon.parse(code, {
        sourceType: 'module',
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true,
        allowSuperOutsideMethod: true,
        plugins: __spreadArray([
            'jsx',
            'flow',
            'asyncFunctions',
            'classConstructorCall',
            'doExpressions',
            'trailingFunctionCommas',
            'objectRestSpread',
            'decorators',
            'classProperties',
            'exportExtensions',
            'exponentiationOperator',
            'asyncGenerators',
            'functionBind',
            'functionSent',
            'optionalChaining'
        ], additionalBabylonPlugins)
    });
    if (!options.source) {
        options.source = code;
    }
    return generateFromAst(moduleName, ast, options, reactImport);
}
exports.generateFromSource = generateFromSource;
function generateFromAst(moduleName, ast, options, reactImport) {
    if (options === void 0) { options = {}; }
    if (reactImport === void 0) { reactImport = 'react'; }
    // tslint:disable-next-line:deprecation
    if (options.generator) {
        return deprecated_1.generateTypings(moduleName, ast, options);
    }
    return typings_1.createTypings(moduleName, ast, options, reactImport);
}
exports.generateFromAst = generateFromAst;
//# sourceMappingURL=index.js.map