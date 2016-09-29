# Custom Themes for StoryBoard
This folder provides an extension mechanism by which you can apply your own
custom bootstrap theme to StoryBoard. By creating your own theme.less file in
this directory, your own custom adjustments will be used to compile bootstrap.

## Quickstart
*  Copy `./src/theme/storyboard/theme.less` to `./src/theme/custom/theme.less`
*  Edit your new `theme.less`
*  Run `grunt build` or `grunt server`

You can override any variables supported in the bootstrap native variables file.
 At this time, StoryBoard does not include its own variables.

## How it works

This folder is included in the dependency resolution path for our LESS files, in
 the following order.

* `./src/theme/main.less`
* `./src/theme/custom/`
* `./src/theme/storyboard/`
* `./bower_components/bootstrap/less/`
* `./bower_components/font-awesome/less/`

This means that you can override any file directly imported into main.less by
adding your own version of this file. You can also add your own file inclusions
by using `@import` directives in your own theme file. Note that `@include`
resolves first from the current directory before checking the resolution path.

All files in this directory with the `*.less` extension are included in our
`.gitignore`, so updating your codebase will not override those files.
