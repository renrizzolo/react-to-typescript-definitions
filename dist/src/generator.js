"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
var deprecated_1 = require("./deprecated");
var Generator = /** @class */ (function () {
    function Generator() {
        this.indentLevel = 0;
        this.code = '';
    }
    Generator.prototype.indent = function () {
        var result = '';
        var n = this.indentLevel;
        for (var i = 0; i < n; i++) {
            result += '\t';
        }
        this.code += result;
    };
    Generator.prototype.nl = function () {
        this.code += Generator.NL;
    };
    Generator.prototype.declareModule = function (name, fn) {
        this.indent();
        this.code += "declare module '" + name + "' {";
        this.nl();
        this.indentLevel++;
        fn();
        this.indentLevel--;
        this.indent();
        this.code += '}';
        this.nl();
    };
    Generator.prototype.import = function (decl, from, fn) {
        this.indent();
        this.code += "import " + decl + " from '" + from + "';";
        this.nl();
        if (fn) {
            fn();
        }
    };
    Generator.prototype.props = function (name, props, fn) {
        var _this = this;
        this.interface(name + "Props", function () {
            Object.keys(props).forEach(function (propName) {
                var prop = props[propName];
                _this.prop(propName, prop.type, prop.optional, prop.documentation);
            });
        });
        if (fn) {
            fn();
        }
    };
    Generator.prototype.prop = function (name, type, optional, documentation) {
        this.indent();
        if (documentation) {
            this.comment(documentation);
        }
        this.code += "" + name + (optional ? '?' : '') + ": " + type + ";";
        this.nl();
    };
    Generator.prototype.comment = function (comment) {
        var _this = this;
        this.code += '/*';
        var lines = (comment || '').replace(/\t/g, '').split(/\n/g);
        lines.forEach(function (line, index) {
            _this.code += line;
            if (index < lines.length - 1) {
                _this.nl();
                _this.indent();
            }
        });
        this.code += '*/';
        this.nl();
        this.indent();
    };
    Generator.prototype.interface = function (name, fn) {
        this.indent();
        this.code += "export interface " + name + " {";
        this.nl();
        this.indentLevel++;
        fn();
        this.indentLevel--;
        this.indent();
        this.code += '}';
        this.nl();
    };
    Generator.prototype.exportDeclaration = function (exportType, fn) {
        this.indent();
        this.code += 'export ';
        if (exportType === deprecated_1.ExportType.default) {
            this.code += 'default ';
        }
        fn();
    };
    Generator.prototype.class = function (name, props, fn) {
        this.code += "class " + name + " extends React.Component<" + (props ? name + "Props" : 'any') + ", any> {";
        this.nl();
        this.indentLevel++;
        if (fn) {
            fn();
        }
        this.indentLevel--;
        this.indent();
        this.code += '}';
        this.nl();
    };
    Generator.prototype.toString = function () {
        return this.code;
    };
    Generator.NL = '\n';
    return Generator;
}());
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map