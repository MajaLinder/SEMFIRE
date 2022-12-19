# Pareto Chart
### Overview

![image](/documentation/paretoChart.png)

Pareto Analysis is a technique used for decision making based on the Pareto Principle. Pareto Principle is based on 80/20 rule which says “80% of impacts are due to 20% of causes”. It emphasizes that a major number of issues are created by a relatively smaller number of underlying causes. You can focus on a vital few root causes of the problem and ignore the trivial many.

This chart makes sense for data with counts for values of a nominal variable or category. They show the ordered frequency counts of values for the different levels of a categorical or nominal variable.

A Pareto Chart is a statistical chart which orders the causes or problems in the descending order of their frequency and their cumulative impact. Histogram chart is used inside the Pareto chart to rank the causes.
This is a special example of a combination chart where the bars are ordered from highest to lowest with the axis on the left and a line for the cumulative frequency represented as a curve with its axis on the right.

### Mod Features

The Pareto visualization mod is composed of

-   A value axis, a category axis and a percentage scale,
-   Bars sorted in descending order that can be rendered with or without Spotfire's Color by feature,
-   A cumulative frequency line with markers and,
-   A line to show the 80 % mark.

#### Marking

-   Click on bar segments or line markers to mark them,
-   Hold the ctrl key to mark several bar and line markers,
-   Click and drag to mark several bar and line segments and markers with a rectangle,
-   Clear any marking by clicking on the background.

#### Hover

-   Hover over a bar segment and get prompted with a customizable tooltip,
-   Hover over a line marker and a tooltip with the cumulative percentage will be displayed,
-   Hover over a label on one of the axises and a tooltip with the label name is displayed
-   Hover over a bar segement, 80% cutoff line and line markers and they are highlighted with a border.

#### Tooltip

-   Customize the tooltip displayed when hovering over a bar through the visualisation properties.
-   The tooltip for the line markers and the labels is not customizable.

#### Other

-   Click on the 80 % line to mark the corresponding bar segments,
-   Customize the settings of colors, font style and font size,
-   No negative values are allowed in the Pareto chart and if any are detected an error message is displayed.

#### Use case diagram

![image](/documentation/diagrams/use-case-diagram.png)

### Future improvements

Improvement can always be made and suggestions for the Pareto mod include:

-   Checkbox to:
    -   show the cumulative frequency line,
    -   show the line markers,
    -   show the 80/20 cut-off line,
    -   set the position of labels for bars and complete bars,
    -   select the type of labels for percentage, value and category.
-   A radio button to show labels for "all", "marked rows" and "none",
-   An option for users to choose between a linear and logarithmic scale,
-   Flexible labels on the value axis to display larger numbers,
-   Color selection for cumulative and cutoff lines,
-   Removing axes through canvas settings.
