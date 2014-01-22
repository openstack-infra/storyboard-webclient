storyboard-webclient
====================

A WebClient for the OpenStack Storyboard project.

### Prerequisites: Quick build/CI

* Xvfb
* GCC 4.2 or newer
* Python 2.6 or 2.7
* GNU Make 3.81 or newer
* libexecinfo (FreeBSD and OpenBSD only)

### Prerequisites: Dev

* tox

### Use tox:

**Run the test suite**

* `tox -enode test`

**Run a local development server**

* `tox -enode server`

**Package the distro**

* `tox -enode build`

### For development.

**Create the virtualenv**

* `tox -enode build`

**Activate the virtualenv**

* `source .tox/node/bin/activate`

#### Within the virtual environment, you have the following options

**Update/refresh the javascript build and runtime dependencies**

* `npm prune`
* `npm install`
* `bower prune`
* `bower install`

**Run a local development server**

`grunt server`

**Run the test suite**

`grunt test`

**Package the distro**

`grunt build`

**Bootstrap your database**

`./bin/api.sh create-db`

**Migrate the database**

`./bin/api.sh migrate-db`

**Start the API**

`./bin/api.sh start`

**Stop the API**

`./bin/api.sh stop`