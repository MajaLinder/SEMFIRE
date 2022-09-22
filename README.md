# SEMFIRE

## Pareto Chart ##

## How to get started (with development server)

- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm start`. This will compile JavaScript and place the bundle in the `dist` folder. This task will watch for changes in code and will continue running until it is stopped. Whenever you save a file, the changes will be reflected in the visualization mod.
- Run `npm run server` in a separate terminal. This will start a development server.
- Start editing, for example `src/index.js`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.

## GitFlow ## 
This repository has a protected main branch, with the latest stable version. We will use topic branches to work on during increments. Once the team/developers on the topic are done, they will do a merge request and assign someone not involved in the development to review and the developer who issued the merge request approves it making sure that the main branch remains stable. Ideally we will be updated about teamwork during standups and we can guesstimate potential conflicts with specific teams/developers who we will aim to choose to assign for review.

The agreed syntax for branch name, commit messages and merge requests:

* **Branch name:** #< nr of issue on board > < short description of feature/topic >  
  
* **Commits:** #< nr of issue on board > < short descriptive message > {co-authors} 
  
* **Merge requests:** #< nr of issue on board > < descriptive message > The merge request shall explain the implementation, with pictures as a complementation if necessary.
