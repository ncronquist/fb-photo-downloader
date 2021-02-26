# Contributing

Local development environment and workflow


## Development Prerequisites

- [NodeJS](https://nodejs.org/en/) - JavaScript runtime
  - See [.tool-versions](./.tool-versions) for expected version
- [Yarn](https://yarnpkg.com/) - Package manager for NodeJS packages

These tools can be installed anyway you want, but if you don't already have a preference, the [asdf](https://asdf-vm.com/#/) is general purpose runtime version manager and this project is setup with an asdf configuration file to use the correct versions of NodeJS and Yarn.

After installing `asdf`, NodeJS and Yarn can be installed with the following commands:

```sh
asdf plugin add nodejs

# Import the Node.js release team's OpenPGP keys to main keyring:
bash -c '${ASDF_DATA_DIR:=$HOME/.asdf}/plugins/nodejs/bin/import-release-team-keyring'

asdf install nodejs 14.16.0

asdf plugin add yarn

asdf install yarn 1.22.10
```


## Development

1. Clone this repository

```sh
git clone git@github.com:ncronquist/fb-photo-downloader.git
```

2. Navigate into the project and checkout the `mvp` (minimum viable product) branch. All work is being done on the MVP branch for now until something actually works. I'll make sure to update these docs then :)

```sh
cd ./fb-photo-downloader

git checkout mvp
```

3. Navigate into the project and install dependencies

```sh
cd ./fb-photo-downloader

yarn install
```

4. Add your feature or tests

5. Run the tests and make sure they are passing

```sh
yarn test
```

See below for how to actually run the CLI from the code directly (rather than installing as a global npm module).


## Run the CLI

While developing, you can run the CLI from the code with the following command. Remember that this will only do anything on the `mvp` branch for now.

```sh
./bin/run
```

A browser window will open and you'll have 30 seconds to login before the tool attempts to navigate through your tagged photos.
