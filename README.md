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

* NodeJS 0.10.24 or newer
* Grunt 0.4.2
* bower 1.2.8

### Command reference:

**Bootstrap & build the CI environment**

* `./bin/bootstrap.sh`
* `./bin/build.sh`

**Run a local development server**

`grunt server`

**Run the test suite**

`grunt test`

**Package the distro**

`grunt build`