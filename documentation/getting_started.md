# Getting Started 
### Prerequisites

This chart is a developed mod based on [Tibco platform](https://www.tibco.com/).
To start with this mod you need to have either the web client or [desktop client Tibco Spotfire](https://support.tibco.com/s/article/How-to-download-TIBCO-Spotfire-Desktop).
To run this mode you need to download and install [Node.js](https://nodejs.org/en/).
The complete guide to get start with the [Tibco platform can be found here](https://tibcosoftware.github.io/spotfire-mods/docs/getting-started/).

### Installation guide

-   First you need to download or clone the last version of the mod.

#### Clone

To clone this repository, you should go to the front page of the repository and and click on the Code button and copy the HTTPS address of the repository.
In the next step you need to clone it on your system. You can find the complete guide to [clone a github repository here](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop).
Or you can run the following command in the [Gitbash](https://gitforwindows.org/).
`git clone https://github.com/MajaLinder/SEMFIRE.git`

#### Download

To download the mode you need to go to the front page of the repository and click on the <> Code button and choose "Download ZIP" option.
After downloading the file you need to extract it and open it with you IDE.

##### In the IDE

-   Open a terminal at the location of this example.
-   Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
-   Run `npm start`. This will compile the code and place the bundle in the `dist` folder. This task will watch for changes in code and will continue running until it is stopped. Whenever you save a file, the changes will be reflected in the visualization mod.
-   Run `npm run server` in a separate terminal. This will start a development server.
-   Start editing, for example `src/index.ts`.
-   In Spotfire, follow the steps of creating a new mod and connecting to the development server.
-   TIBCO Spotfire Mod guide [documentation](https://tibcosoftware.github.io/spotfire-mods/docs/using-the-api/api-docs/).
