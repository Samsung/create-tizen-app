# create-tizen-app

`create-tizen-app` is a wizard tool for helping to configure and make a tizen web application.
If you are a developer who prefers commonjs style or typescript language, It would be the best solution to create tizen web application easily.
It also supports the way to use Samsung TV Product API, Tizen common API as a `Commonjs style` or `typescript`.

# Associated Projects

-   [tizen-tv-webapis](https://github.com/Samsung/tizentv-webapis) is for supporting Samsung TV Product API as commonjs style.
-   [@types/tizen-tv-webapis](#) is definitions for supporting Samsung TV Product API as typescript.
-   [tizen-common-web](https://github.com/Samsung/tizen-common-web) is for supporting Tizen Web Device API as commonjs style.
-   [@types/tizen-common-web](https://www.npmjs.com/package/@types/tizen-common-web) is definitions for supporting Tizen Web Device API as typescript.

## Quick Start

```sh
npm install -g @tizentv/create-tizen-app
mkdir workspace
cd workspace
create-tizen-app yourProjectName
```

## Overview

`create-tizen-app` can create your tizen web application with configuration what you select.
You can select `language`, `bundler`, `editor` and even `live reloading tool (WITs)`.

## Command

### `create-tizen-app`

Create your tizen application with **yourProjectName**

```sh
create-tizen-app yourProjectName
```

#### init

if you are behind proxy, you can pass **--proxy** option.

```sh
create-tizen-app init yourProjectName --proxy http://0.0.0.0:8080
```

#### Prompters for selecting

1. ProjectName
    - You can put the name of your application.
        - The character length should be 3~50
        - The starting character should be an alphabet
        - The name should be consisted of alphabet and number
2. Language
    - Select your project's language. `Commonjs` or `Typescript`.
    - If you select the `Commonjs`,
        - then [tizen-tv-webapis](https://www.npmjs.com/package/tizen-tv-webapis) and [tizen-common-web](https://www.npmjs.com/package/tizen-common-web) will be installed.
        - Both packages are essential when you bundle your javascripts.
    - **[Recommand]** If you select the `Typescript`,
        - then [tizen-tv-webapis](https://www.npmjs.com/package/tizen-tv-webapis), [tizen-common-web](https://www.npmjs.com/package/tizen-common-web), [@types/tizen-tv-webapis](https://www.npmjs.com/package/@types/tizen-tv-webapis), [@types/tizen-common-web](https://www.npmjs.com/package/@types/tizen-common-web) and [typescript](https://www.npmjs.com/package/typescript) will be installed.
        - The `@types` packages will increse your developing efficiency.
        - Check out the [Typescript Get Started](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).
3. Bundler
    - Select a bundler. We support `Webpack` and `Parcel`. The [Webpack](https://webpack.js.org/) is most popular bundler. And the [Parcel](https://parceljs.org/) is famous for zero configuration.
    - If you select the `Webpack`,
        - then [webpack](https://www.npmjs.com/package/webpack),[webpack-cli](https://www.npmjs.com/package/webpack-cli) and [file-loader](https://www.npmjs.com/package/file-loader) will be installed.
        - If you select the `typescript`, [ts-loader](https://www.npmjs.com/package/ts-loader) is installed, .
        - If you select the `commonjs` [babel-loader](https://www.npmjs.com/package/babel-loader), [@babel/core](https://www.npmjs.com/package/@babel/core) and [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) are installed, .
        - And `webpack.config.js` is created, so cumtomize your bundler as your project.
    - If you select the `Parcel`,
        - then [parcel](https://github.com/parcel-bundler/parcel) and [parcel-plugin-change-file](https://www.npmjs.com/package/parcel-plugin-change-file) will be installed.
        - It's simple than the `Webpack`.
4. Editor
    - You can select an editor, then we will install the Tizen SDK extensions.  
      Before you select the editor, you should install the editor on your PC.
        - [VScode](https://code.visualstudio.com/)
        - [Atom](https://atom.io/)
    - All applications must be signed with valid samsung certificates before you submit the application to seller office.  
      You should install the [Tizen Studio](https://developer.tizen.org/development/tizen-studio/overview) for making the samsung certificates.  
      You can check the guide for [creating the samsung certificates](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html).
    - If you select the `VScode`, then [tizensdk.tizentv Extension](https://marketplace.visualstudio.com/items?itemName=tizensdk.tizentv) will be installed.
    - If you select the `Atom`, then [atom-tizentv Extension](https://atom.io/packages/atom-tizentv) will be installed.
    - If you select the `None`, then Tizen SDK will be not installed.
5. WITs (Live Reloading tool)
    - You can choose to use it or not. For details, please refer [WITs github](https://github.com/Samsung/Wits).
    - If you decided to use WITs, the some prompters for configuration will be asked.
        - Device Ip address
          : Target TV IP
        - Application width (1920 or 1280)
        - Profile path
          : Required for packaging. You need to create a certification (Tizen or Samsung) via one of the editors. (VSCode / Atom / Tizen Studio)
        - Using chrome Devtools for debugging (Y or N)
          : If you set as "Y", Chrome browser will be opened with inspector

### `create-tizen-app doctor`

Originally Doctor runs at the end of steps when you do `create-tizen-app`.
In case you want to use `Doctor` for diagnosing your development environment,
we support a `doctor` subcommand for that.
If something is missing, `Doctor` will notify you the solution.

```sh
cd workspace/yourProjectName
create-tizen-app doctor
```

## Usage after creating project

```sh
cd workspace/yourProjectName
npm run build

# optional (If you choosed WITs)
#    npm run wits-init (For configuration)
#    npm run wits-start (For packaging, connecting, launching, live reloading)
npm run wits-start
```
## Build to Tizen 2.4 (or below)
If you build a tizen application to old version(v2.2.1, v2.3, v2.4), then you should change the `target` to `es5` in `tsconfig.json`.

``` jsonc
// tsconfig.json
{
  "complierOpitons": {
    //"target" : "es6"    // Tizen 3.0 or higher
    "target" : "es5"      // Tizen 2.4 or below
  }
}
```
