Storyboard Web Client
=====================

A WebClient for the OpenStack Storyboard project.


Project Resources
-----------------

  - [Project status, bugs, and blueprints](http://storyboard.openstack.org)
  - [Source code](https://git.openstack.org/cgit/openstack-infra/storyboard-webclient)
  - [Documentation](http://ci.openstack.org/storyboard)
  - [Additional resources are linked from the project wiki page](https://wiki.openstack.org/wiki/StoryBoard)
  - [How to contribute to OpenStack](https://wiki.openstack.org/wiki/HowToContribute)
  - [Code reviews workflow](https://wiki.openstack.org/wiki/GerritWorkflow)

Getting Started
---------------

First of all be sure to have tox installed on your machine then:

  - Install the virtualenv containing nodejs: `tox -evenv`
  - Source the new path containing grunt: 
`source .tox/grunt_no_api/bin/activate`
  - Now you can launch the grunt tasks of storyboard-webclient, by default run 
the development server with the following command: `grunt server` 


Grunt tasks
-----------

Here are the grunt tasks available with the storyboard-webclient project, the
following commands must be prefixed by grunt, example for the first one, the
command to run will be `grunt jshint`, the virtualenv must have been 
activated see previous section:

  - `jshint`: Runs a linter on the javascript sources files of the project,
this will help us keeping style consistency across our files and can reduce the
risk of bugs.
  - `clean`: Erases the temporary folders created by various grunt tasks, such
as reports, cover and dist.
  - `less`: Compiles the themes files present in `/src/theme/custom` and 
`/src/theme/custom` using [less compiler](http://lesscss.org/), the result
which is a plain css file is stored into `dist/styles/main.css` 
  - `compile`: Compiles all of our sources in the dist directory.
  - `package`: Built code into a release package.
  - `build`: Compile and packages our code.
  - `server:dist`:  This task performs a full build of our application, 
and then runs that source in a local web server. It does no watching, 
it simply hosts the files.
  - `server:prod`: This task is identical to 'server:dist', 
with the exception that it will proxy the API requests against the production 
API. *USE WITH CAUTION*
  - `server`: Development server - runs a build and sets up concurrent watchers 
that will automatically lint, test, and refresh the code when a change is 
detected.
  - `test`: Run all the tests.
  - `test:unit`: This command will create a clean build against which 
our unit tests will be run. For more information, please see karma-unit.conf.js
  - `test:integration`: This command will create a clean build against which 
our integration tests will be run. For more information, please see 
karma-integration.conf.js
  - `test:functional`: This command will create a clean build against which our 
functional tests will be run. For more information, please see 
karma-functional.conf.js