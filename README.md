Global8Ball3D
=============

This npm-package provides the javascript to run an 8ball-pool-game in 3D in the browser. It's written in ES2015 using [BabylonJs](http://babylonjs.com/) and [CannonJs](http://www.cannonjs.org/).

Contributing
------------

Clone the the repo

```bash
git clone ssh://git@p2501.twilightparadox.com:33333/home/git/git_repos/game3d_poc.git
```
Install dependencies
```bash
npm install
```
Start the server and open the browser on http://localhost:4000/
```bash
./server.js
```
To use the testrunner, you need to install xvfb and firefox. On Ubuntu:
```bash
sudo apt-get install xvfb firefox
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

Happy hacking...
