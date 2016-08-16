StoryBoard Web Client
=====================

A WebClient for the OpenStack StoryBoard project.

Motivation
----------

StoryBoard was created to serve the needs of highly-distributed systems
that span multiple projects, to enable cross-project work on a massive
scale.  The best concepts were adapted from existing tools, and as many
potential points of contention were removed as possible, to better
facilite coordination of project work by stakeholders with widely
varied interest and needs.

Project Resources
-----------------

  - [Project status, bugs, and blueprints](http://storyboard.openstack.org)
  - [Source code](https://git.openstack.org/cgit/openstack-infra/storyboard-webclient)
  - [Documentation](http://docs.openstack.org/infra/storyboard)
  - [Additional resources are linked from the project wiki page](https://wiki.openstack.org/wiki/StoryBoard)
  - [How to contribute to OpenStack](http://docs.openstack.org/infra/manual/developers.html)
  - [Code reviews workflow](http://docs.openstack.org/infra/manual/developers.html#development-workflow)

Getting Started
---------------

First of all, read the "If you're a developer, start here" section of the
OpenStack Developers Manual ("How to contribute to OpenStack", above).

Next, be sure to have tox installed on your machine then:

  - Install the virtualenv containing nodejs: `tox -evenv`
  - Source the new path containing grunt:
`source .tox/venv/bin/activate`
  - Now you can launch the grunt tasks of storyboard-webclient, by default run
the development server with the following command: `grunt serve`

NPM Commands
-----------
The following are commands that may be used during project development.

  - `npm run lint`: Runs a linter on the javascript sources files of the
    project, this will help us keeping style consistency across our files and
    can reduce the risk of bugs.
  - `npm run clean`: Erases the temporary folders created by various grunt
    tasks, such as reports, cover and dist.
  - `npm run build`: Compile and packages our code.
  - `npm run serve`: Development server - runs a build and sets up concurrent
    watchers that will automatically lint, test, and refresh the code when a
    change is detected.
  - `npm run test-unit`: This command will create a clean build against which
    our unit tests will be run. For more information, please see
    karma-unit.conf.js
  - `npm run test-integration`: This command will create a clean build against
    which our functional tests will be run. For more information, please see
    protractor-integration.conf.js
  - `npm run test-functional`: This command will create a clean build against
    which our functional tests will be run. For more information, please see
    protractor.conf.js

Grunt tasks
-----------

For more detailed development, the following commands are available via grunt.
To run them, you will need to install grunt globally: `npm install -g grunt`.

  - `compile`: Compiles all of our sources in the dist directory.
  - `package`: Built code into a release package.
  - `serve:dist`:  This task performs a full build of our application,
and then runs that source in a local web server. It does no watching,
it simply hosts the files.
  - `serve:prod`: This task is identical to 'server:dist',
with the exception that it will proxy the API requests against the production
API. *USE WITH CAUTION*
