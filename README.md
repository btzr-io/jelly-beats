<img src="https://user-images.githubusercontent.com/39308480/43605302-e794780c-9665-11e8-9e25-7abefc7a3092.png" alt="jelly-beats" width="54%">

# Decentralized music streaming platform [![David](https://img.shields.io/david/btzr-io/jelly-beats.svg?style=flat-square)](https://david-dm.org/btzr-io/jelly-beats)[![GitHub license](https://img.shields.io/github/license/btzr-io/jelly-beats.svg?style=flat-square)](https://github.com/btzr-io/electron-preact-app/blob/master/LICENSE)

> What? A decentralized music streaming platform.
How? We are developing an open source desktop application using the electron framework, react, web workers, unistore.js and the lbry-protocol.
**Disclaimer:**
We don’t intend to develop a real working product that can compete or replace other centralized platforms such as soundcloud, spotify, deezer (At least not right now).
Our main goal right now it’s to develop a simple but functional application to showcase the current potential of the lbry-protocol for media distribution and discovery using simple web technologies.



### Development

Install dependencies.

1. Windows
- Git for Windows
- Node.js LTS
- Yarn
 2. Linux
 - Git `sudo apt-get install git`
 - Build-essential `sudo apt-get install build-essential`
 - Node.js LTS
 - Yarn
 3. Mac OS
 - [Brew](https://brew.sh/index_pl)
 - Node.js + Yarn `brew install yarn`
 

> All operating systems requires runing LBRY daemon. You can easily start daemon by runing LBRY Desktop App or by runing separate daemon. [Click here to download latest daemon](https://github.com/lbryio/lbry/releases).
> Guide for daemon can be found [here](https://github.com/lbryio/lbry) 

Clone this repository.

```Shell
git clone https://github.com/btzr-io/jelly-beats.git
```
Use cd to get inside cloned directory.

    cd jelly-beats

Use `yarn` command to install the dependencies,

Now you can run the app.

```Shell
yarn dev
```
If you want build binaries execute this command inside app folder.

    yarn dist

> On Linux you will get .deb file inside dist folder.
> On Windows you will get .exe file inside dist folder.
> On MacOS you will get .dmg file inside dist folder.
