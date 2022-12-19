# System Architecture
The Pareto mod retrieves data from the Spotfire API in the index.ts file.
The data is transformed and set in a Pareto interface that is used to render
the different parts. This architectural decision enhances reusability as the
Pareto funtionalities are not directly connected with the data from the API. Another important architectural driver for this project was to ensure that the mod feels native to the spotfire experience. Architectural decisions made during the project were influenced by this.

### Component Diagram

An overview of the architecture as a component diagram.

![image](/documentation/diagrams/Component_Diagram.png)

Below we provide a detailed narrative description of the somponents and their responsabilities.

_index.ts_
Our main entry point is index.ts where we:

-   initialize connection to the spotfire platform, and get access to the underlying dataView object
-   responsible for transformation of upstream data to pareto data model objects
-   responsible for validation of data, such as checking for negative values
-   listens to changes in the data and repeats the Transform - Validate - Render

_pareto.ts_

-   defines interfaces representing data model for Pareto, StackedBars and Bars and behavior such as mark operation

_renderer.ts_

-   responsible for calling individual methods for rendering different components of the Pareto chart
-   such as axis, stacked bars, cumulative line

_resource.ts_

-   constants that define rendering settings such as padding, lineweight

_settings.ts_

-   settings used for drawing visual elements such as styling and passing rendering information such as window size

_axis.ts_

-   responsible to render axis based on the values that come from Pareto object and Settings passed as parameters
    -- also defines and exposes d3 linear scales for value and percentage axis, and d3 scale band for category axis

_cumulativeLine.ts_

-   responsible for rendering cumulative line for the Pareto given as input and with Settings passed as parameters
-   implements behavior for showing tooltips on mouse over and rectangular selection

_rectangleMarking.ts_

-   responsible to implement the marking behavior when selecting with rectangle selection mouse operation

_stackedBars.ts_

-   renders StackedBar's passed as parameter through the Pareto object, using d3 library methods and constructs.
-   implements the behavior for onclick, onmouseover and onmouseout events for marking, showing tooltips, or outlining the bar under the mouse pointer
    USES: Pareto, StackedBar, Bar, Settings, modules exposed by axis (moduleCategoryAxis, moduleValueAxis, moduleTicks, moduleCategories, modulePercentageAxis)
