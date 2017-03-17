Global8Ball3D
=============

This npm-package provides the javascript to run an 8ball-pool-game in 3D in the browser. It's written in ES2015 using [BabylonJs](http://babylonjs.com/) and [CannonJs](http://www.cannonjs.org/).

Contributing
------------

Clone the the repo

```bash
git clone ssh://git@p2501.twilightparadox.com:33333/home/git/git_repos/global8ball3d.git
```
Install dependencies
```bash
npm install
```
Start the server and open the browser on http://localhost:4000/
```bash
npm start
```
To use the testrunner, you need to install chromium and firefox. On Ubuntu:
```bash
sudo apt-get install chromium-browser firefox
```
After installing the requires dependencies, run
```bash
npm test
```
For convenience, install some npm-packages globally
```bash
npm install -g karma-cli gulp-cli
```
I recommend nvm to handle node-versions and npm-packages w/o hassle.

Running test on CI-server
--------------------

Because we use BabylonJs directly in unit-tests, we need a WebGL-context provided by the browser. To run the tests headless on a CI-server you need to install firefox and [xpra](https://www.xpra.org/trac/wiki/Xdummy) and start the server using Xdummy as driver on DISPLAY :100. After this you can run the tests once with

```bash
npm run test_ci
```

Happy hacking...
