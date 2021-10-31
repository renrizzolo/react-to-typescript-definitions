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
// tslint:disable:no-implicit-dependencies
var ava_1 = __importDefault(require("ava"));
var chalk_1 = __importDefault(require("chalk"));
var diff = __importStar(require("diff"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var react2dts = __importStar(require("../src/index"));
var basedir = path.join(__dirname, '..', '..', 'tests');
if (process.env.WALLABY) {
    basedir = path.join(__dirname);
}
function normalize(input) {
    return input.replace(/\s+/g, ' ').replace(/ => /g, '=>');
}
function textDiff(t, actual, expected) {
    if (diff.diffChars(normalize(expected), normalize(actual)).length > 1) {
        var differences = diff.diffChars(expected, actual);
        var result = differences
            .map(function (part) {
            var value = part.value.trim()
                ? part.value
                : (part.added ? '+' : '-') + part.value;
            return part.added
                ? chalk_1.default.green(value)
                : part.removed
                    ? chalk_1.default.red(value)
                    : chalk_1.default.grey(value);
        })
            .join('');
        t.fail("\n" + result);
    }
    else {
        t.pass();
    }
}
function compare(t, moduleName, file1, file2, opts, reactImport) {
    if (opts === void 0) { opts = {}; }
    if (reactImport === void 0) { reactImport = 'react'; }
    textDiff(t, react2dts.generateFromFile(moduleName, path.join(basedir, file1), opts, reactImport), fs.readFileSync(path.join(basedir, file2)).toString());
}
ava_1.default('Parsing should create definition from es6 class component', function (t) {
    var opts = {
        instanceOfResolver: function () { return './path/to/Message'; }
    };
    compare(t, 'component', 'es6-class.jsx', 'es6-class.d.ts', opts);
});
ava_1.default('Parsing should create definition from es7 class component', function (t) {
    var opts = {
        instanceOfResolver: function () { return './path/to/Message'; }
    };
    compare(t, 'component', 'es7-class.jsx', 'es7-class.d.ts', opts);
});
ava_1.default('Parsing should create top-level module definition from es7 class component', function (t) {
    var opts = {
        instanceOfResolver: function () { return './path/to/Message'; }
    };
    compare(t, null, 'es7-class.jsx', 'es7-class-top-level-module.d.ts', opts);
});
ava_1.default('Parsing should create definition from babeled es7 class component', function (t) {
    var opts = {
        instanceOfResolver: function () { return './path/to/Message'; }
    };
    compare(t, 'component', 'es7-class-babeled.js', 'es7-class.d.ts', opts);
});
ava_1.default('Parsing should create definition from es7 class component babeled to es6', function (t) {
    var opts = {
        instanceOfResolver: function () { return './path/to/Message'; }
    };
    compare(t, 'component', 'es7-class-babeled-to-es6.js', 'es7-class-babeled-to-es6.d.ts', opts);
});
ava_1.default('Parsing should create definition from es7 class component with separate default export', function (t) {
    compare(t, 'component', 'es7-class-separate-export.jsx', 'es7-class-separate-export.d.ts');
});
ava_1.default('Parsing should create definition from stateless function component', function (t) {
    compare(t, 'component', 'stateless.jsx', 'stateless.d.ts');
});
ava_1.default('Parsing should create definition from class extending Component', function (t) {
    compare(t, 'component', 'import-react-component.jsx', 'import-react-component.d.ts');
});
ava_1.default('Parsing should create definition from component exported as an object of components', function (t) {
    compare(t, 'component', 'multiple-components-object.jsx', 'multiple-components-object.d.ts');
});
ava_1.default("Parsing should create definition from default export that's an object of components", function (t) {
    compare(t, 'component', 'multiple-components-object-default.jsx', 'multiple-components-object-default.d.ts');
});
ava_1.default("Parsing should create definition from unnamed default export that's an object of components", function (t) {
    compare(t, 'component', 'multiple-components-object-unnamed-default.jsx', 'multiple-components-object-unnamed-default.d.ts');
});
ava_1.default('Parsing should add dot notation members for component', function (t) {
    compare(t, 'component', 'multiple-components-dot-notation.jsx', 'multiple-components-dot-notation.d.ts');
});
ava_1.default('Parsing should add dot notation members for default export component', function (t) {
    compare(t, 'component', 'multiple-components-dot-notation-default.jsx', 'multiple-components-dot-notation-default.d.ts');
});
ava_1.default('Parsing should create definition from class import PropTypes and instanceOf dependency', function (t) {
    compare(t, 'component', 'instance-of-proptype-names.jsx', 'instance-of-proptype-names.d.ts');
});
ava_1.default('Parsing should create definition from file without propTypes', function (t) {
    compare(t, 'component', 'component-without-proptypes.jsx', 'component-without-proptypes.d.ts');
});
ava_1.default('Parsing should create definition from file with references in propTypes', function (t) {
    compare(t, 'component', 'references-in-proptypes.jsx', 'references-in-proptypes.d.ts');
});
ava_1.default('Parsing should create definition from file with reference as propTypes', function (t) {
    compare(t, 'component', 'reference-as-proptypes.jsx', 'reference-as-proptypes.d.ts');
});
ava_1.default('Parsing should create definition from file with unnamed default export', function (t) {
    compare(t, 'path', 'unnamed-default-export.jsx', 'unnamed-default-export.d.ts');
});
ava_1.default('Parsing should create definition from file with named export specifiers', function (t) {
    compare(t, 'component', 'named-export-specifiers.jsx', 'named-export-specifiers.d.ts');
});
ava_1.default('Parsing should create preact definition', function (t) {
    compare(t, 'path', 'preact-definition.jsx', 'preact-definition.d.ts', {}, 'preact');
});
ava_1.default('Parsing should suppport props-types repo', function (t) {
    compare(t, 'path', 'prop-types.jsx', 'prop-types.d.ts', {});
});
ava_1.default('Parsing should suppport props-types repo (with a default import)', function (t) {
    compare(t, 'path', 'prop-types-default-import.jsx', 'prop-types.d.ts', {});
});
ava_1.default('Parsing should support an SFC with default export', function (t) {
    compare(t, 'component', 'stateless-default-export.jsx', 'stateless-default-export.d.ts');
});
ava_1.default('Parsing should support an SFC with default export babeled to es6', function (t) {
    compare(t, 'component', 'stateless-export-as-default.js', 'stateless-export-as-default.d.ts');
});
ava_1.default('Parsing should support components that extend PureComponent', function (t) {
    compare(t, 'component', 'pure-component.jsx', 'pure-component.d.ts');
});
ava_1.default('Parsing should support prop-types as reference to constant', function (t) {
    compare(t, 'component', 'const-as-proptypes.jsx', 'const-as-proptypes.d.ts');
});
ava_1.default('Parsing should suppport custom eol style', function (t) {
    textDiff(t, react2dts.generateFromFile('component', path.join(basedir, 'pure-component.jsx'), { eol: '\n' }, 'react'), fs
        .readFileSync(path.join(basedir, 'pure-component.d.ts'))
        .toString()
        .replace('\r\n', '\n'));
});
ava_1.default('Parsing should suppport users to set additional babylon plugins', function (t) {
    compare(t, 'Component', 'babylon-plugin.jsx', 'babylon-plugin.d.ts', {
        babylonPlugins: ['dynamicImport']
    });
});
//# sourceMappingURL=parsing-test.js.map