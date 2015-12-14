# react-to-typescript-definitions

[![GitHub license](https://img.shields.io/github/license/KnisterPeter/react-to-typescript-definitions.svg)]()
[![Travis](https://img.shields.io/travis/KnisterPeter/react-to-typescript-definitions.svg)](https://travis-ci.org/KnisterPeter/react-to-typescript-definitions)
[![David](https://img.shields.io/david/KnisterPeter/react-to-typescript-definitions.svg)](https://david-dm.org/KnisterPeter/react-to-typescript-definitions)
[![David](https://img.shields.io/david/dev/KnisterPeter/react-to-typescript-definitions.svg)](https://david-dm.org/KnisterPeter/react-to-typescript-definitions#info=devDependencies&view=table)
[![npm](https://img.shields.io/npm/v/react-to-typescript-definitions.svg)](https://www.npmjs.com/package/react-to-typescript-definitions)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Create typescript definitions files (d.ts) from react components.

# Usage

## Installation
Install as npm package:

```sh
npm install react-to-typescript-definitions --save-dev
```
or
```sh
npm install -g react-to-typescript-definitions
```


## CLI

```sh
cat <some/react/component.jsx> |react2dts --name module-name
```

## API

```js
import * as react2dts from 'react-to-typescript-definitions';

// react2dts.generateFromFile('<module-name>', '<path/to/react-component>');
react2dts.generateFromFile('component', path.join(__dirname, 'component.jsx'));

// react2dts.generate('<module-name>', '<code of the component>');
react2dts.generate('component', 'component-code');
```