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
// tslint:disable:no-implicit-dependencies
var ava_1 = __importDefault(require("ava"));
var strip_ansi_1 = __importDefault(require("strip-ansi"));
var react2dts = __importStar(require("../src/index"));
var originalConsoleError = console.error;
ava_1.default.beforeEach(function (t) {
    console.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!t.context.args) {
            t.context.args = [];
        }
        t.context.args.push(args);
    };
});
ava_1.default.afterEach(function () {
    console.error = originalConsoleError;
});
ava_1.default.serial('In case of error during shape type inference (direct reference) the error information should be retained', function (t) {
    react2dts.generateFromSource(null, "\n    import React from 'react';\n\n    export class Component extends React.Component {\n      static propTypes = {\n        someShape: React.PropTypes.shape(shape)\n      };\n    }\n  ");
    var args = t.context.args.reduce(function (akku, args) { return __spreadArray(__spreadArray([], akku), args); }, []);
    t.is(strip_ansi_1.default(args[2]), 'Line 6:         someShape: React.PropTypes.shape(shape)');
});
ava_1.default.serial('In case of error during enum type inference the error information should be retained', function (t) {
    react2dts.generateFromSource(null, "\n    import React from 'react';\n\n    export class Component extends React.Component {\n      static propTypes = {\n        list: React.PropTypes.oneOf(list)\n      };\n    }\n  ");
    var args = t.context.args.reduce(function (akku, args) { return __spreadArray(__spreadArray([], akku), args); }, []);
    t.is(strip_ansi_1.default(args[2]), 'Line 6:         list: React.PropTypes.oneOf(list)');
});
ava_1.default.serial('In case of error during enum value creation inference the error information should be retained', function (t) {
    react2dts.generateFromSource(null, "\n    import React from 'react';\n\n    export class Component extends React.Component {\n      static propTypes = {\n        list: React.PropTypes.oneOf(Object.keys(object))\n      };\n    }\n  ");
    var args = t.context.args.reduce(function (akku, args) { return __spreadArray(__spreadArray([], akku), args); }, []);
    t.is(strip_ansi_1.default(args[2]), 'Line 6:         list: React.PropTypes.oneOf(Object.keys(object))');
});
ava_1.default.serial('In case of error during shape type inference (indirect reference) the error information should be retained', function (t) {
    react2dts.generateFromSource(null, "\n    import React from 'react';\n\n    export class Component extends React.Component {\n      static propTypes = {\n        shape: React.PropTypes.shape(some.shape)\n      };\n    }\n  ");
    var args = t.context.args.reduce(function (akku, args) { return __spreadArray(__spreadArray([], akku), args); }, []);
    t.is(strip_ansi_1.default(args[2]), 'Line 6:         shape: React.PropTypes.shape(some.shape)');
});
//# sourceMappingURL=error-reporting-test.js.map