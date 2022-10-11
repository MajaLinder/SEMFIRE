# SEMFIRE #
SEMFIRE is the name of the student group for the course DIT827 Software Innovation. 
SEMFIRE works in cooperation with Tibco Spotfire to develop a visualisation mod for Pareto chart. 

## How to get started (with development server)

- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm start`. This will compile JavaScript and place the bundle in the `dist` folder. This task will watch for changes in code and will continue running until it is stopped. Whenever you save a file, the changes will be reflected in the visualization mod.
- Run `npm run server` in a separate terminal. This will start a development server.
- Start editing, for example `src/index.js`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.
- TIBCO Spotfire Mod guide [documentation](https://tibcosoftware.github.io/spotfire-mods/docs/using-the-api/api-docs/).
> Group members:

1. Maja Linder - Scrum Master 
2. Bardha Ahmeti- Product Owner 
3. Malik Hannan - Developer
4. Astrid Berntsson - Developer
5. Yuhan Li - Developer
6. Malik Waleed Mahboob - Developer
7. Mohammad Zandkarimi - Developer
8. Navya Pulikandla Satyanarayanachetty - Developer 

## Pareto Chart ##

![Pareto Chart Prototype](https://github.com/MajaLinder/SEMFIRE/blob/main/Pareto_Chart_Prototype.png)
Pareto Analysis is a technique used for decision making based on the Pareto Principle. Pareto Principle is based on 80/20 rule which says “80% of impacts are due to 20% of causes”. It emphasizes that a major number of issues are created by a relatively smaller number of underlying causes. You can focus on a vital few root causes of the problem and ignore the trivial many.

This chart makes sense for data with counts for values of a nominal variable or category. They show the ordered frequency counts of values for the different levels of a categorical or nominal variable.

A Pareto Chart is a statistical chart which orders the causes or problems in the descending order of their frequency and their cumulative impact. Histogram chart is used inside the Pareto chart to rank the causes.
This is a special example of a combination chart where the bars are ordered from highest to lowest with the axis on the left and a line for the cumulative frequency represented as a curve with its axis on the right.


## GitFlow ## 
This repository has a protected main branch, with the latest stable version. We will use topic branches to work on during increments. Once the team/developers on the topic are done, they will do a merge request and assign someone not involved in the development to review and the developer who issued the merge request approves it making sure that the main branch remains stable. Ideally we will be updated about teamwork during standups and we can guesstimate potential conflicts with specific teams/developers who we will aim to choose to assign for review.

The agreed syntax for branch name, commit messages and merge requests:

* **Branch name:** < short description of feature/topic >  
  
* **Commits:** #< nr of issue on board > < short descriptive message > {co-authors} 
  
* **Merge requests:** #< nr of issue on board > < descriptive message > The merge request shall explain the implementation, with pictures as a complementation if necessary.
