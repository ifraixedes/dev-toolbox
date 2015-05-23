Static Website development with Sass and Swigjs
===============================================

This gulpfile allows to develop a static web site using [Sass](http://sass-lang.com/) and [swigjs](http://paularmstrong.github.io/swig/) in an opinionated way, so no configurations files, put each file in the right directory and have fun!

## How To Start (the fast way)

Create a directory and copy inside `gulpfile.js` and `package.json`.

You should modify `package.json` to get out some values that I setup for my own purpose, as "license", "author", etc.

Then install the dependencies with `npm install`
Create the directories with `npm run bootstrap`

And then `npm run dev` to start [BrowserSync](http://www.browsersync.io/) server to get your awesome development environment up and running.


## How Works

This instructions consider that you're in the root folder of your project which must contains the `package.json` and `gulpfile.js` of this git repository's directory.

### Dependencies

Any required dependency will be installed with `npm install`

### Bootstrap

Run `npm run bootstrap` and you will get the project folder structure used by `gulpfile`

### Directory Structure

The root directory contains two directories "dev" and "dist"; you may not see "dist" directory, that's OK, it's created when you run `npm run dev` or `npm run build` at the first time.

The important directory is "dev", because it's where you have to add your files; "dist" directory is auto-generated, so you shouldn't commit into your repository.

In "dev" directory contains a bunch of subdirectories, each one should contain different types of files; the directories are:

* __image__ contains all the image files; ___gulpfile___ has a task that optimise them.
* __fonts__ contains all the fonts files; ___gulpfile___ only copies the files, it doesn't do any processing task.
* __styles__ contains all the "css" and "sass" files; "css" files will be __automatically added the browser prefixes__ and "scss" files will be compiled to "css" and left in "dist" directory; bear in mind that the main "scss" must be named "main.scss", which must import everything that you want to be compiled, the compiled file will be name __"main.css"__ and it will be dropped in "dist/styles".
  If you have vendor styles that you don't want to be processed, just copied, you should add them in a subfolder named "vendor", in this case they will be just copied.
* __scripts__ contains all the ___javascripts___ files with [browserify](http://browserify.org/) format which main file must be named "__index.js__" and which must include that your application needs; the files will be lint by [ESLint](http://eslint.org/) and optimised (concatenated and minified) by [browserify]http://browserify.org/) and the result file, named __"bundle.js"__, will be dropped in "dist/scripts".
  If you have vendor scripts that you don't want to be added to "bundle.js", just copied, you should add them in a subfolder named "vendor"
  If you want to have your own settings for [ESLint](http://eslint.org/), then create a `[.eslintrc](http://eslint.org/docs/user-guide/configuring)` in the root directory; if you want to see my `.eslintrc` you can see [here](/ifraixedes/dev-toolbox/blob/master/nodejs/eslintrc-default)
* __views__ contains all the swigjs files; ___gulpfile___ compiles swigjs files to "html" and drop them into "dist" folder, note __they won't go into subfolder__. __Note__ swigjs files must have "html" extension.


Moreover any "html" file which is in "dev" directory will be copied to "dist" directory.

You'll also see a file in the root folder named "view-vars.js", it is empty by default and you cannot remove it otherwise [Development Process](#development-process) won't work. This file is use to define variables that you want to use in your "swigjs" files; you can define them exporting an object with the name of those, e.g.

```js

module.exports = {
  title: "My web site"
  author: "Ivan Fraixedes"
};

```


### Development Process

To work in your project run `npm run dev`

That task will run all the tasks which processes the files; each one for the corresponding directory, which are mentioned in [Directory Structure](#directory-structure) section.

The tasks also runs [BrowserSync](http://www.browsersync.io/) which runs an HTTP server which serves the files in "dist" directory, hence in your "html" files you must reference the files are created in "dist" folder not in "dev".

Files created in "dist" directory are not always in the same place and name that the ones under "dev", it means that you have to know that some files are processed and bundled into one file which is dropped into "dist" folder to be able to refer them correctly in your "html" and "swigjs" files; you can know aobut it in [Directory Structure](#directory-structure) section.

The HTTP server running by [BrowserSync](http://www.browsersync.io/) will listen in port 8000; note that it uses [BrowserSync](http://www.browsersync.io/) 2.x, hence you can get access to its administration interface through 8080 port.

`npm run dev` keep a long process, with [BrowserSync](http://www.browsersync.io/) running and watching changes in the files in your folders, so each change will run the associated task with that file type and [BrowserSync](http://www.browsersync.io/) will refresh your browser automatically, making your development process comfortable and more productive.

You should frequently check the console's output, because if there's any error compiling, linting or whatever task associated with a file type which fails, the error message will be showed in it, so you will know about the issue; you'll also see several info messages, which are useful to know what tasks are running on each change.

__NOTE__ file watching process sometimes doesn't consider new files created in that folder, therefore it that happens it won't be processed then won't be available in "dist" folder; if that happens, close the process (ctrl + c) and run again `npm run dev`
