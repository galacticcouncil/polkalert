# /packages/client/blueprints

This folder contains Blueprint templates.

# Blueprint

Blueprint offers the functionality of automatic file generation. It saves time and ensures that the file structure will follow the project standards.

### Setup

1.  Install the [Blueprint](https://marketplace.visualstudio.com/items?itemName=teamchilla.blueprint) addon for VSCode
2.  Go to settings in VSCode (`cmd`+`,` on Mac or `ctrl`+`,` on Win/Linux)
3.  Search for "blueprint"
4.  Click `Edit in settings.json`
5.  Add the path to the Blueprint templates folder into `settings.json` - `"blueprint.templatesPath": [ "path/to/project/blueprints" ]`, for example `/Users/polkalertdev/Documents/polkalert/packages/client/blueprints`

### Usage

1.  In VSCode, right click on a folder, in which you want to generate a new file from a Blueprint template (for example `/packages/client/src/components`, `/packages/client/stories/ui` etc.) and select `New File from Template`
2.  Select one of the available templates
3.  Register the new component in the `index.js` file of the folder, where you created the new component. For example, if you created a new component in `/packages/client/src/ui`, you need to open `/packages/client/src/ui/index.js` and export the new component - `export { default as MyNewComponent } from './MyNewComponent`. You don't need to do this with stories since every file with the `.stories.tsx` extension, located in the `/packages/client/stories` folder, is autoloaded into Storybook.
