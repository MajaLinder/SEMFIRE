# SEMFIRE #
SEMFIRE is the name of the student group for the course DIT827 Software Innovation. 
SEMFIRE works in cooperation with Tibco Spotfire to develop a visualisation mod for Pareto chart. 

## Pareto Chart ##

### Overview
 
[insert Pareto chart image]

Pareto Analysis is a technique used for decision making based on the Pareto Principle. Pareto Principle is based on 80/20 rule which says “80% of impacts are due to 20% of causes”. It emphasizes that a major number of issues are created by a relatively smaller number of underlying causes. You can focus on a vital few root causes of the problem and ignore the trivial many.

This chart makes sense for data with counts for values of a nominal variable or category. They show the ordered frequency counts of values for the different levels of a categorical or nominal variable.

A Pareto Chart is a statistical chart which orders the causes or problems in the descending order of their frequency and their cumulative impact. Histogram chart is used inside the Pareto chart to rank the causes.
This is a special example of a combination chart where the bars are ordered from highest to lowest with the axis on the left and a line for the cumulative frequency represented as a curve with its axis on the right.

### Mod Features

The Pareto visualization mod is composed of 
- a value axis, a category axis and a percentage scale,
- bars sorted in descending order that can be rendered with or without Spotfire's Color by feature, 
- a cumulative line with markers and,
- a line to show the 80 % mark.

#### Marking
- click on bar segments or line markers to mark them,
- hold the ctrl key to mark several bar and line segments,
- click and drag to mark several bar and line segments with a rectangle,
- clear any marking by clicking on the background

#### Hover
- hover over a bar segment and get prompted with a customizable tooltip,
- hover over a line marker and a tooltip with the cumulative percentage will be displayed,
- hover over a label on one of the axises and a tooltip with the label name is displayed
- hover over a bar segement and it is highlighted with a border. 

#### Tooltip
- Customize the tooltip displayed when hovering over a bar through the visualisation properties. 
- The tooltip for the line markers and the labels are not customizable.

#### Other
- click on the 80 % line to mark the corresponding bar segments,
- customize the settings of colors, font style and font size.

[insert use case diagram]

### Future improvements

Improvement can always be made and suggestions for the Pareto mod include:
- a checkbox to show the cumulative frequency line
- a checkbox to show the line markers,
- a checkbox to show the 80/20 cut-off line,
- a checkbox to set the position of labels for bars and complete bars,
- a checkbox to select the type of labels for percentage, value and category,
- a radio button to show labels for "all", "marked rows" and "none"
- a option for users to choose between a linear and logarithmic scale.

## How to get started (with development server)

- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm start`. This will compile the code and place the bundle in the `dist` folder. This task will watch for changes in code and will continue running until it is stopped. Whenever you save a file, the changes will be reflected in the visualization mod.
- Run `npm run server` in a separate terminal. This will start a development server.
- Start editing, for example `src/index.ts`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.
- TIBCO Spotfire Mod guide [documentation](https://tibcosoftware.github.io/spotfire-mods/docs/using-the-api/api-docs/).

## System Architecture

The Pareto mod retrieves data from the Spotfire API in the index.ts file. 
The data is transformed and set in a Pareto interface that is used to render 
the different parts. This architectural decision enhances reusability as the 
Pareto funtionalities are not directly connected with the data from the API. 

[insert component diagram]

## GitFlow ## 
This repository has a protected main branch, with the latest stable version. We will use topic branches to work on during increments. Once the team/developers on the topic are done, they will do a merge request and assign someone not involved in the development to review and the developer who issued the merge request approves it making sure that the main branch remains stable. Ideally we will be updated about teamwork during standups and we can guesstimate potential conflicts with specific teams/developers who we will aim to choose to assign for review.

The agreed syntax for branch name, commit messages and merge requests:

* **Branch name:** < short description of feature/topic >  
  
* **Commits:** #< nr of issue on board > < short descriptive message > {co-authors} 
  
* **Merge requests:** #< nr of issue on board > < descriptive message > The merge request shall explain the implementation, with pictures as a complementation if necessary.

#### Group members:

1. Maja Linder - Scrum Master and developer
2. Bardha Ahmeti- Product Owner and developer
3. Astrid Berntsson - Developer
4. Yuhan Li - Developer
5. Mohammad Zandkarimi - Developer
6. Navya Pulikandla Satyanarayanachetty - Developer 
7. Malik Hannan - Developer in early development
8. Malik Waleed Mahboob - Developer in early development
