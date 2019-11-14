# Project setup

1.  Install [node.js](https://nodejs.org/en/)
2.  Clone the repository
3.  Open Terminal and navigate to the project folder - `cd path/to/project`
4.  Install Yarn if you don't have it already - `npm i -g yarn`
5.  Run the `yarn` command to install project dependencies
6.  If you don't have docker, install docker and docker-compose `https://docs.docker.com/compose/install/`

**IMPORTANT!** Make sure to:

1.  Have the `Editor: Format On Save` setting in VSCode turned on to keep the code consistent.
2.  Always run pre-commit checks before commiting your code. If it won't pass, it won't be able to be built. More info about the checks can be found below.
3.  Check the other `README.md` files located in subfolders (if provided) for further info.

# Running the project

You can run the project via Terminal using one of the following commands:

1.  `yarn start:client`: Runs only the client on `localhost:8080`
2.  `yarn start:server`: Runs only the server on `localhost:4000`
3.  `yarn start:db`: Runs only the db on `localhost:5432`
4.  `yarn start`: Runs the whole project, the client and the server parts will run on the addresses mentioned above

5.  `yarn stop:db`: Stops db and resets docker interfaces if it doesn't stop automatically

# Other Yarn scripts

Besides the `start` script, there are other ones which can be used to work with the project. They are supposed to be run in Terminal, while being navigated to the root directory of the project. The available scripts are:

- `yarn`: Installs all the dependencies, needs to be run before using the project
- `yarn install:client`: Installs only the client dependencies
- `yarn install:server`: Installs only the server dependencies

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
