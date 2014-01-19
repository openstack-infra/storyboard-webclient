storyboard-webclient
====================

A PoC WebClient for the OpenStack Storyboard project.

### Prerequisites: Quick build/CI

* Xvfb
* GCC 4.2 or newer
* Python 2.6 or 2.7
* GNU Make 3.81 or newer
* libexecinfo (FreeBSD and OpenBSD only)

### Prerequisites: Dev

* tox

or

* NodeJS 0.10.24 or newer
* Grunt 0.4.2
* bower 1.2.8

### Use tox:

**Run the test suite**

* `tox -enode`

**Run a local development server**

* `tox -evenv server`

**Package the distro**

* `tox -evenv build`

### Install and work with things more globally:

**Install node and npm**

* `sudo apt-get install nodejs npm`

**Install grunt and bower globall**

* `sudo npm install -g grunt-cli bower`

**Install dev and build needs locally in the build directory**

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
