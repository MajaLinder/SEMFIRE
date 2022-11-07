/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var hierarchyAxisName = "HierarchyAxis";
var colorAxisName = "Color";
var valueAxisName = "ValueAxis";
var percentageAxisName = "PercentageAxis";
window.Spotfire.initialize(function (mod) { return __awaiter(void 0, void 0, void 0, function () {
    function onChange(dataView, windowSize, hierarchyAxis, colorAxis, valueAxis, percentageAxis, showCumulativeFrequencyLine, showLineMarkers) {
        return __awaiter(this, void 0, void 0, function () {
            var rootNode, unSortedStackedBars, sortedStackedBars, prevCumulative, paretoGrandTotal, pareto;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dataView.hierarchy(hierarchyAxisName)];
                    case 1: return [4 /*yield*/, (_a.sent()).root()];
                    case 2:
                        rootNode = (_a.sent());
                        //validate data before transformation
                        validateDataView(rootNode);
                        unSortedStackedBars = rootNode.leaves().map(function (leaf) {
                            var totalValue = 0;
                            var bars = leaf.rows().map(function (row) {
                                var barValue = row.continuous(valueAxisName).value() || 0;
                                totalValue += barValue;
                                return {
                                    color: "red",
                                    value: barValue,
                                };
                            });
                            return {
                                bars: bars,
                                label: leaf.key,
                                totalValue: totalValue,
                                cumulativeValue: 0
                            };
                        });
                        sortedStackedBars = unSortedStackedBars.sort(function (a, b) {
                            return b.totalValue - a.totalValue;
                        });
                        prevCumulative = 0;
                        sortedStackedBars.forEach(function (stackedBar) {
                            stackedBar.cumulativeValue += prevCumulative + stackedBar.totalValue;
                            stackedBar.cumulativePercentage = 100 * stackedBar.cumulativeValue / paretoGrandTotal;
                            prevCumulative = stackedBar.cumulativeValue;
                        });
                        paretoGrandTotal = (sortedStackedBars === null || sortedStackedBars === void 0 ? void 0 : sortedStackedBars.length) ? sortedStackedBars[sortedStackedBars.length - 1].cumulativeValue : 0;
                        sortedStackedBars.forEach(function (stackedBar) { return stackedBar.cumulativePercentage = 100 * stackedBar.cumulativeValue / paretoGrandTotal; });
                        pareto = {
                            stackedBars: sortedStackedBars,
                            maxValue: (sortedStackedBars === null || sortedStackedBars === void 0 ? void 0 : sortedStackedBars.length) ? sortedStackedBars[0].totalValue : 0,
                            minValue: (sortedStackedBars === null || sortedStackedBars === void 0 ? void 0 : sortedStackedBars.length) ? sortedStackedBars[sortedStackedBars.length - 1].totalValue : 0,
                            grandTotal: paretoGrandTotal
                        };
                        //to do: render Pareto
                        pareto.stackedBars.forEach(function (p) {
                            console.log(p.label + " - " + p.totalValue + " (" + p.cumulativePercentage.toFixed(2) + "%)");
                        });
                        console.log("Max value: " + pareto.maxValue);
                        console.log("Min value: " + pareto.minValue);
                        //when renderPareto method has been implemented it should be invoked here
                        //renderPareto(paret, settings);
                        context.signalRenderComplete();
                        return [2 /*return*/];
                }
            });
        });
    }
    var context, reader;
    return __generator(this, function (_a) {
        context = mod.getRenderContext();
        reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.visualization.axis(hierarchyAxisName), mod.visualization.axis(colorAxisName), mod.visualization.axis(valueAxisName), mod.visualization.axis(percentageAxisName), mod.property("showCumulativeFrequencyLine"), mod.property("showLineMarkers"));
        reader.subscribe(onChange);
        return [2 /*return*/];
    });
}); });
/**
 * Validate that no empty path element is followed by a value and that all values are positive.
 * @param rootNode - The hierarchy root.
 * @param warnings - The warnings array
 */
function validateDataView(rootNode) {
    var warnings = [];
    var rows = rootNode.rows();
    //validate data, check if there are negative values, or values outside some range, etc
    return warnings;
}


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWlCLENBQUMsRUFDekMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQ3JDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUNyQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUMxQyxHQUFHLENBQUMsUUFBUSxDQUFVLDZCQUE2QixDQUFDLEVBQ3BELEdBQUcsQ0FBQyxRQUFRLENBQVUsaUJBQWlCLENBQUMsQ0FDM0MsQ0FBQztRQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7OztLQW9FOUIsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUNGLFNBQVMsZ0JBQWdCLENBQUMsUUFBK0I7SUFDdEQsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUUzQixzRkFBc0Y7SUFFdEYsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3BhcmV0by1jaGFydC1tb2Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGFyZXRvLWNoYXJ0LW1vZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhcmV0by1jaGFydC1tb2QvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IEF4aXMsIERhdGFWaWV3LCBEYXRhVmlld0hpZXJhcmNoeU5vZGUsIERhdGFWaWV3Um93LCBNb2QsIE1vZFByb3BlcnR5LCBTaXplIH0gZnJvbSBcInNwb3RmaXJlLWFwaVwiO1xyXG4vL2ltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xyXG5pbXBvcnQgeyByZXNvdXJjZXMgfSBmcm9tIFwiLi9yZXNvdXJjZXNcIjtcclxuaW1wb3J0IHtQYXJldG8sIFN0YWNrZWRCYXIsIEJhciB9IGZyb20gXCIuL3BhcmV0b1wiO1xyXG5pbXBvcnQgeyByZW5kZXJQYXJldG8gfSBmcm9tIFwiLi9yZW5kZXJlclwiO1xyXG5cclxuY29uc3QgaGllcmFyY2h5QXhpc05hbWUgPSBcIkhpZXJhcmNoeUF4aXNcIjtcclxuY29uc3QgY29sb3JBeGlzTmFtZSA9IFwiQ29sb3JcIjtcclxuY29uc3QgdmFsdWVBeGlzTmFtZSA9IFwiVmFsdWVBeGlzXCI7XHJcbmNvbnN0IHBlcmNlbnRhZ2VBeGlzTmFtZSA9IFwiUGVyY2VudGFnZUF4aXNcIjtcclxuXHJcbndpbmRvdy5TcG90ZmlyZS5pbml0aWFsaXplKGFzeW5jIChtb2QpID0+IHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBtb2QuZ2V0UmVuZGVyQ29udGV4dCgpO1xyXG5cclxuICAgIGNvbnN0IHJlYWRlciA9IG1vZC5jcmVhdGVSZWFkZXIoXHJcbiAgICAgICAgbW9kLnZpc3VhbGl6YXRpb24uZGF0YSgpLFxyXG4gICAgICAgIG1vZC53aW5kb3dTaXplKCksXHJcbiAgICAgICAgbW9kLnZpc3VhbGl6YXRpb24uYXhpcyhoaWVyYXJjaHlBeGlzTmFtZSksXHJcbiAgICAgICAgbW9kLnZpc3VhbGl6YXRpb24uYXhpcyhjb2xvckF4aXNOYW1lKSxcclxuICAgICAgICBtb2QudmlzdWFsaXphdGlvbi5heGlzKHZhbHVlQXhpc05hbWUpLFxyXG4gICAgICAgIG1vZC52aXN1YWxpemF0aW9uLmF4aXMocGVyY2VudGFnZUF4aXNOYW1lKSxcclxuICAgICAgICBtb2QucHJvcGVydHk8Ym9vbGVhbj4oXCJzaG93Q3VtdWxhdGl2ZUZyZXF1ZW5jeUxpbmVcIiksXHJcbiAgICAgICAgbW9kLnByb3BlcnR5PGJvb2xlYW4+KFwic2hvd0xpbmVNYXJrZXJzXCIpXHJcbiAgICApO1xyXG5cclxuICAgIHJlYWRlci5zdWJzY3JpYmUob25DaGFuZ2UpO1xyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIG9uQ2hhbmdlKFxyXG4gICAgICAgIGRhdGFWaWV3OiBEYXRhVmlldywgd2luZG93U2l6ZTogU2l6ZSwgaGllcmFyY2h5QXhpczogQXhpcywgY29sb3JBeGlzOiBBeGlzLFxyXG4gICAgICAgIHZhbHVlQXhpczogQXhpcywgcGVyY2VudGFnZUF4aXM6IEF4aXMsIHNob3dDdW11bGF0aXZlRnJlcXVlbmN5TGluZTogTW9kUHJvcGVydHk8Ym9vbGVhbj4sIHNob3dMaW5lTWFya2VyczogTW9kUHJvcGVydHk8Ym9vbGVhbj5cclxuICAgICkgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHJvb3ROb2RlOiBEYXRhVmlld0hpZXJhcmNoeU5vZGU7XHJcbiAgICAgICAgcm9vdE5vZGUgPSAoYXdhaXQgKGF3YWl0IGRhdGFWaWV3LmhpZXJhcmNoeShoaWVyYXJjaHlBeGlzTmFtZSkpIS5yb290KCkpIGFzIERhdGFWaWV3SGllcmFyY2h5Tm9kZTtcclxuXHJcbiAgICAgICAgLy92YWxpZGF0ZSBkYXRhIGJlZm9yZSB0cmFuc2Zvcm1hdGlvblxyXG4gICAgICAgIHZhbGlkYXRlRGF0YVZpZXcocm9vdE5vZGUpO1xyXG5cclxuICAgICAgICAvL3RyYW5zZm9ybSBkYXRhIGludG8gZGF0YSBtb2RlbCBvYmplY3RzXHJcbiAgICAgICAgbGV0IHVuU29ydGVkU3RhY2tlZEJhcnM6IFN0YWNrZWRCYXJbXSA9IHJvb3ROb2RlIS5sZWF2ZXMoKS5tYXAoKGxlYWYpID0+IHtcclxuICAgICAgICAgICAgbGV0IHRvdGFsVmFsdWUgPSAwOyBcclxuICAgICAgICAgICAgbGV0IGJhcnM6IEJhcltdID0gbGVhZi5yb3dzKCkubWFwKChyb3cpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBiYXJWYWx1ZSA9IHJvdy5jb250aW51b3VzKHZhbHVlQXhpc05hbWUpLnZhbHVlPG51bWJlcj4oKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdG90YWxWYWx1ZSArPSBiYXJWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwicmVkXCIsIC8vdG8gZG86IGdldCB0aGUgY29sb3IgYXV0b21hdGljYWxseSBmcm9tIGNvbG9yIGF4aXNcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogYmFyVmFsdWUsXHJcbiAgICAgICAgICAgICAgICB9IGFzIEJhclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYmFyczogYmFycyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiBsZWFmLmtleSxcclxuICAgICAgICAgICAgICAgIHRvdGFsVmFsdWU6IHRvdGFsVmFsdWUsXHJcbiAgICAgICAgICAgICAgICBjdW11bGF0aXZlVmFsdWU6IDBcclxuICAgICAgICAgICAgfSBhcyBTdGFja2VkQmFyXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBzb3J0ZWRTdGFja2VkQmFyczogU3RhY2tlZEJhcltdID0gdW5Tb3J0ZWRTdGFja2VkQmFycy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBiLnRvdGFsVmFsdWUgLSBhLnRvdGFsVmFsdWU7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBwcmV2Q3VtdWxhdGl2ZSA9IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc29ydGVkU3RhY2tlZEJhcnMuZm9yRWFjaCgoc3RhY2tlZEJhcikgPT4ge1xyXG4gICAgICAgICAgICBzdGFja2VkQmFyLmN1bXVsYXRpdmVWYWx1ZSArPSBwcmV2Q3VtdWxhdGl2ZSArIHN0YWNrZWRCYXIudG90YWxWYWx1ZTtcclxuICAgICAgICAgICAgc3RhY2tlZEJhci5jdW11bGF0aXZlUGVyY2VudGFnZSA9IDEwMCAqIHN0YWNrZWRCYXIuY3VtdWxhdGl2ZVZhbHVlIC8gcGFyZXRvR3JhbmRUb3RhbDtcclxuICAgICAgICAgICAgcHJldkN1bXVsYXRpdmUgPSBzdGFja2VkQmFyLmN1bXVsYXRpdmVWYWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgcGFyZXRvR3JhbmRUb3RhbCA9IHNvcnRlZFN0YWNrZWRCYXJzPy5sZW5ndGg/IHNvcnRlZFN0YWNrZWRCYXJzW3NvcnRlZFN0YWNrZWRCYXJzLmxlbmd0aCAtIDFdLmN1bXVsYXRpdmVWYWx1ZTogMDtcclxuICAgICAgICBzb3J0ZWRTdGFja2VkQmFycy5mb3JFYWNoKHN0YWNrZWRCYXIgPT4gc3RhY2tlZEJhci5jdW11bGF0aXZlUGVyY2VudGFnZSA9IDEwMCAqIHN0YWNrZWRCYXIuY3VtdWxhdGl2ZVZhbHVlIC8gcGFyZXRvR3JhbmRUb3RhbCk7XHJcblxyXG4gICAgICAgIGxldCBwYXJldG86IFBhcmV0byA9IHtcclxuICAgICAgICAgICAgc3RhY2tlZEJhcnM6IHNvcnRlZFN0YWNrZWRCYXJzLFxyXG4gICAgICAgICAgICBtYXhWYWx1ZTogc29ydGVkU3RhY2tlZEJhcnM/Lmxlbmd0aD8gc29ydGVkU3RhY2tlZEJhcnNbMF0udG90YWxWYWx1ZTogMCxcclxuICAgICAgICAgICAgbWluVmFsdWU6IHNvcnRlZFN0YWNrZWRCYXJzPy5sZW5ndGg/IHNvcnRlZFN0YWNrZWRCYXJzW3NvcnRlZFN0YWNrZWRCYXJzLmxlbmd0aCAtIDFdLnRvdGFsVmFsdWU6IDAsXHJcbiAgICAgICAgICAgIGdyYW5kVG90YWw6IHBhcmV0b0dyYW5kVG90YWxcclxuICAgICAgICB9IGFzIFBhcmV0b1xyXG5cclxuICAgICAgICAvL3RvIGRvOiByZW5kZXIgUGFyZXRvXHJcbiAgICAgICAgcGFyZXRvLnN0YWNrZWRCYXJzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocC5sYWJlbCArIFwiIC0gXCIgKyBwLnRvdGFsVmFsdWUgKyBcIiAoXCIgKyBwLmN1bXVsYXRpdmVQZXJjZW50YWdlLnRvRml4ZWQoMikrIFwiJSlcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiTWF4IHZhbHVlOiBcIiArIHBhcmV0by5tYXhWYWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJNaW4gdmFsdWU6IFwiICsgcGFyZXRvLm1pblZhbHVlKTtcclxuXHJcblxyXG4gICAgICAgIC8vd2hlbiByZW5kZXJQYXJldG8gbWV0aG9kIGhhcyBiZWVuIGltcGxlbWVudGVkIGl0IHNob3VsZCBiZSBpbnZva2VkIGhlcmVcclxuICAgICAgICAvL3JlbmRlclBhcmV0byhwYXJldCwgc2V0dGluZ3MpO1xyXG5cclxuXHJcbiAgICAgICAgY29udGV4dC5zaWduYWxSZW5kZXJDb21wbGV0ZSgpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSB0aGF0IG5vIGVtcHR5IHBhdGggZWxlbWVudCBpcyBmb2xsb3dlZCBieSBhIHZhbHVlIGFuZCB0aGF0IGFsbCB2YWx1ZXMgYXJlIHBvc2l0aXZlLlxyXG4gKiBAcGFyYW0gcm9vdE5vZGUgLSBUaGUgaGllcmFyY2h5IHJvb3QuXHJcbiAqIEBwYXJhbSB3YXJuaW5ncyAtIFRoZSB3YXJuaW5ncyBhcnJheVxyXG4gKi9cclxuIGZ1bmN0aW9uIHZhbGlkYXRlRGF0YVZpZXcocm9vdE5vZGU6IERhdGFWaWV3SGllcmFyY2h5Tm9kZSkge1xyXG4gICAgbGV0IHdhcm5pbmdzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgbGV0IHJvd3MgPSByb290Tm9kZS5yb3dzKCk7XHJcblxyXG4gICAgLy92YWxpZGF0ZSBkYXRhLCBjaGVjayBpZiB0aGVyZSBhcmUgbmVnYXRpdmUgdmFsdWVzLCBvciB2YWx1ZXMgb3V0c2lkZSBzb21lIHJhbmdlLCBldGNcclxuXHJcbiAgICByZXR1cm4gd2FybmluZ3M7XHJcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=