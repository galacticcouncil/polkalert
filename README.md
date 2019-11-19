# Project setup

1.  Install [node.js](https://nodejs.org/en/)
2.  Clone the repository
3.  Open Terminal and navigate to the project folder - `cd path/to/project`
4.  Install Yarn if you don't have it already - `npm i -g yarn`
5.  Run the `yarn` command to install project dependencies
6.  Run the `yarn setup` command to setup environment variables and default settings.
7.  If you don't have docker, install docker and docker-compose `https://docs.docker.com/compose/install/`

# Running the project

You can run the project via Terminal using the following commands:

1.  `yarn start:client`: Runs the client, default on `localhost:8080`
2.  `yarn start:server`: Runs only the server, default on `localhost:4000`
3.  `yarn start:db`: Runs only the db, default on `localhost:5432`

You need all of the three parts: client, server and db running to run Polkalert

4.  `yarn start`: Shortcut which runs the whole project. The client, db and the server parts will run on the ports mentioned above by default or on ports you configured via setup script. Note that you will not have full control over each process if you run the app this way.

5.  `yarn stop:db`: Stops db and resets docker interfaces if it doesn't stop automatically

# Other Yarn scripts

Besides the `start` script, there are other ones which can be used to work with the project. They are supposed to be run in Terminal, while being navigated to the root directory of the project. The available scripts are:

- `yarn`: Installs all the dependencies, needs to be run before using the project
- `yarn install:client`: Installs only the client dependencies
- `yarn install:server`: Installs only the server dependencies

- `yarn setup`: Setup project environment variables and default settings

- `yarn build`: Builds the whole project for production
- `yarn build:client`: Builds only the client for production
- `yarn build:server`: Builds only the server for production

- `yarn add:client [optional: --dev] [packageName]`: Adds a new dependency (or devDependency, based on the inclusion of the `--dev` flag) to the client and installs it
- `yarn add:server [optional: --dev] [packageName]`: Adds a new dependency (or devDependency, based on the inclusion of the `--dev` flag) to the server and installs it

- `yarn remove:client [packageName]`: Removes and uninstalls a dependency from the client
- `yarn remove:server [packageName]`: Removes and uninstalls a dependency from the server

- `yarn storybook`: Runs Storybook (visual documentation of the client)

- `yarn precommit`: Runs pre-commit checks on the whole project
- `yarn precommit:client`: Runs pre-commit checks only on the client

**DEV-IMPORTANT!** Make sure to:

1.  Use [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and have the `Editor: Format On Save` setting in VSCode turned on to keep the code consistent.
2.  Always run pre-commit checks before commiting your code. If it won't pass, it won't be able to be built. More info about the checks can be found below.
3.  Check the other `README.md` files located in subfolders (if provided) for further info.
