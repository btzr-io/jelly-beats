<img src="https://user-images.githubusercontent.com/39308480/43605302-e794780c-9665-11e8-9e25-7abefc7a3092.png" alt="jelly-beats" width="54%">

[![David](https://img.shields.io/david/btzr-io/jelly-beats.svg?style=flat-square)](https://david-dm.org/btzr-io/jelly-beats)
[![GitHub license](https://img.shields.io/github/license/btzr-io/jelly-beats.svg?style=flat-square)](https://github.com/btzr-io/electron-preact-app/blob/master/LICENSE)

## What's this?

A Decentralized music streaming platform.

## The lbry protocol

[LBRY](https://github.com/lbryio/lbry) is an open-source protocol providing distribution, discovery, and purchase of digital content via a decentralized network. We use this protocol to discover and stream music and other audio files such as podcasts.

## Dependencies required

In order to run this app you need to install all these dependencies:

- [Git](https://git-scm.com/)
- [Node.js LTS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [LBRY Daemon](https://lbry.io/quickstart/install)

> **Only for Linux**
>
> You may also require make tools. For example, on Debian you can install [Build-essentials](https://packages.debian.org/stretch/build-essential) package.

## How to run

```sh
# Clone this repository
$ git clone https://github.com/btzr-io/jelly-beats.git
$ cd jelly-beats

# Install NPM dependencies
$ yarn

# Run the app
$ yarn dev
```

## How to package

```sh
# Run the app
$ yarn dist
```

- On Linux you will get .deb file inside dist folder.
- On Windows you will get .exe file inside dist folder.
- On MacOS you will get .dmg file inside dist folder.
