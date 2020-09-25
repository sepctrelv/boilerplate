# Web Boilerplate

> A starter template for Handlebar, ECMAScript(latest), sass and postcss.

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Getting Started](#getting-started)
* [List of Npm tasks](#list-of-npm-tasks)
* [Configuration](#configuration)
* [Directory Structure](#directory-structure)

## Features
This starter also features a number of great software (in the words of their creators):

* [Lanyon](http://lanyon.getpoole.com/) - a content-first, sliding sidebar theme (originally) for Jekyll (by [mdo](http://mdo.fm)).
* [Browsersync](https://www.browsersync.io/) - time-saving synchronised browser testing, keep multiple browsers & devices in sync when editing files.
* [EditorConfig](http://editorconfig.org/) - a config file for maintaining  consistent coding styles.

### Assets

* [svgo](https://github.com/svg/svgo) - a Node.js module for optimizing SVG vector graphics files.
* [Favicons](https://github.com/evilebottnawi/favicons) - a Node.js module for generating favicons and their associated files.
* [imagemin](https://github.com/imagemin/imagemin) - a Node.js module for minify images seamlessly.
* [assets-manager](https://github.com/thecreation/assets-manager) - a Node.js module for transfer the required files from your registry distributions to the target.

### JavaScript

* [Babel](http://babeljs.io/) - a JavaScript compiler for es5 to es6/7.
* [rollup](https://rollupjs.org/) - a module bundler for JavaScript.
* [ESLint](http://eslint.org/) - the pluggable linting utility for JavaScript and JSX (with preconfigured ruleset by [Google](https://github.com/google/eslint-config-google).
* [UglifyES](https://github.com/mishoo/UglifyJS2) - A JavaScript parser, mangler/compressor and beautifier toolkit for ES6+.

### StyleSheet

* [Sass](http://sass-lang.com/) - CSS with superpowers.
* [PostCSS](https://github.com/postcss/postcss) - a tool for transforming styles with JS plugins.
* [Autoprefixer](https://github.com/postcss/autoprefixer) - adding vendor prefixes by the rules of [Can I Use](http://caniuse.com/).
* [cssnano](http://cssnano.co/) - A modular minifier based on the PostCSS ecosystem..
* [Stylelint](http://stylelint.io/) - a mighty, modern CSS linter (with preconfigured ruleset by [Hugo Giraudel](https://sass-guidelin.es/)).

### Html

* [handlebars](https://github.com/wycats/handlebars.js) - a javascript template engine.
* [handlebars-wax](https://github.com/shannonmoeller/handlebars-wax) - Effortless registration of data, partials, helpers, and decorators using file-system globs, modules, and plain-old JavaScript objects.
* [handlebars-layouts](https://github.com/shannonmoeller/handlebars-layouts) - a handlebars helpers which implement layout blocks.
* [handlebars-helpers](https://github.com/helpers/handlebars-helpers) - More than 180 Handlebars helpers in ~20 categories.
* [HTMLHint](https://github.com/yaniswang/HTMLHint) - a Static Code Analysis Tool for HTML.

### Rollup plugins

* [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) - Use the Node.js resolution algorithm with Rollup.
* [rollup-plugin-commonjs](https://github.com/rollup/rollup-plugin-commonjs) - Convert CommonJS modules to ES2015.

### Git Hooks manager

* [husky](https://github.com/typicode/husky)
* [lint-staged](https://github.com/okonet/lint-staged)

## Installation

### Node version manager

Install [NVM](https://github.com/creationix/nvm). And use the latest version of NodeJS.

```bash
nvm install node
nvm use node
```

### Install Sass

Go to [sass-lang.com/install](http://sass-lang.com/install) for installation in command line.

```bash
gem install sass
```

Before install sass, you should [install Ruby](https://www.ruby-lang.org/en/documentation/installation/) and [install Gem](https://rubygems.org/pages/download).

## Getting started

1. Clone this Boilerplate

   ```bash
   git clone https://git.creationstudio.work/creation/landing.git <PROJECT_NAME>
   cd <PROJECT_NAME>
   ```

2. Install Dependencies

   ```bash
   npm install
   ```

3. Build the project

   ```bash
   npm run build
   ```

4. Stay up-to-date

   ```bash
   git remote add upstream https://git.creationstudio.work/creation/landing.git
   git pull upstream master
   ```

## List of Npm tasks

To run separate task type in command line `npm run [task_name]`.

### Main tasks
Task name          | Description
:------------------|:----------------------------------
`start`            | will start all tasks required by project in dev mode: initial build, watch files, run server with livereload
`build`            | builds all content and assets from `src` to `dist`.
`dev`              | builds your project without optimization.

### Core tasks
Task name          | Description
:------------------|:----------------------------------
`css`              | compile all scss from `src/styles` to `dist/assets/css` folder.
`js`               | compile all js from `src/scripts` to `dist/assets/js` folder.
`html`             | compile all hbs files to html files.

### Assets related tasks
Task name          | Description
:------------------|:----------------------------------
`copy`             | copy files from `src/assets` path to `dist/assets` path.
`vendor`           | copy vendor files from registry distributions to `dist/assets/vendor` path.
`svg`              | optimize svg files.
`favicon`          | generate favicons to `dist/assets/favicon` path.
`img`              | optimize and copies images in `src/images` to `dist/assets/images`.

### Dev tasks
Task name          | Description
:------------------|:----------------------------------
`clean`            | remove `dist` folder.
`serve`            | start a BrowserSync instance.
`watch`            | watchs for changes in `src/` path and rebuilds parts of the site as necessary.

All available tasks are placed in a folder `scripts`.

### Flags
`npm run [task_name] --prod` or `npm run [task_name] --production` to run task in production mode.

### Workflow
Everything's ready to get started right away:

`npm start` - Compiles assets & html, launches development server:

* compiles styles & scripts are being compiled & concatenated
* compresses images & svgs
* builds the site & opens it in your default browser
* watches for changes and injects them right away

`npm run build` - Same as above, but in production mode:

* compiles & builds everything
* minifies & compresses everything

## Configuration
Global variables and site metadata can be found inside `config.js`. Your can make some modification in the file.

## Directory Structure

The `source` directory contains your entire application code, including CSS, JavaScript, HTML.

The rest of the folders and files only exist to make your life easier, and should not need to be touched.

Below you can find full details about significant files and folders.

```bash
├── README.md               # Readme file
├── package.json            # Dependencies for node.js
├── LICENSE                 # License
├── .gitignore              # Git ignore rules
├── .htmlhintrc             # Settings for HTMLHint
├── /scripts/               # Npm scripts definitions
├── /dist/                  # Minified, optimized and compiled files
│   ├── /assets/            # Assets folder
│   │   ├── /css/           # CSS files
│   │   ├── /js/            # JS files
│   │   ├── /img/           # Images folder
│   │   ├── /svg/           # Svg files
│   │   └── /favicon/       # Favicon files
│   └── *.html              # Rendered and compiled HTMLs from hbs
└── /src/                   # The source code of the application
    ├── /assets/            # Static assets files copy to dist
    ├── /data/              # Metadata associated with the site.
    ├── /favicon/           # Favicon image
    ├── /styles/            # Stylesheets source
    ├── /scripts/           # Javascript source
    ├── /images/            # Non compressed image files
    ├── /svgs/              # Non compressed svg files
    ├── /helpers/           # Handlebars helpers
    ├── /layouts/           # Handlebars layouts that are based on
    ├── /partials/          # Handlebars partials that are included / extended
    └── /pages/             # Handlebars pages, one per page on the site
```

## License

The code is available under the [MIT](https://github.com/thecreation/web-boilerplate/blob/master/LICENSE) license.
