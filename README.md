# ananas-ts
Rot.js tutorial using TypeScript

## Setup

Steps I used to set up the project:

1. `npm init`
2. `npm install -D typescript webpack webpack-cli ts-loader live-server rot-js`
3. `touch webpack.config.js`
4. (manually added contents of webpack.config.js)
5. `touch tsconfig.json`
6. (manually added contents of tsconfig.json)
7. `npm start`

## Toolchain elements

My current understanding of the dependencies installed:

- **typescript**: compiler for TS
- **webpack**: the build tool -- allows use of `require` in JS/TS, minifies and bundles code, etc.
- **webpack-cli**: provides the watch command for live reloading/compiling
- **ts-loader**: (not sure yet, used by webpack config)
- **live-server**: CLI equivalent of that live-server extension I have in VS Code
- **rot-js**: the ROT.js library, rather than manually putting a CDN reference in a script tag in the HTML
