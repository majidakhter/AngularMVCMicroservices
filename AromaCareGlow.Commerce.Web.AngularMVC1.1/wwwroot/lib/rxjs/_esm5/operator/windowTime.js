/** PURE_IMPORTS_START .._scheduler_async,.._util_isNumeric,.._util_isScheduler,.._operators_windowTime PURE_IMPORTS_END */
import { async } from '../scheduler/async';
import { isNumeric } from '../util/isNumeric';
import { isScheduler } from '../util/isScheduler';
import { windowTime as higherOrder } from '../operators/windowTime';
export function windowTime(windowTimeSpan) {
    var scheduler = async;
    var windowCreationInterval = null;
    var maxWindowSize = Number.POSITIVE_INFINITY;
    if (isScheduler(arguments[3])) {
        scheduler = arguments[3];
    }
    if (isScheduler(arguments[2])) {
        scheduler = arguments[2];
    }
    else if (isNumeric(arguments[2])) {
        maxWindowSize = arguments[2];
    }
    if (isScheduler(arguments[1])) {
        scheduler = arguments[1];
    }
    else if (isNumeric(arguments[1])) {
        windowCreationInterval = arguments[1];
    }
    return higherOrder(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler)(this);
}
//# sourceMappingURL=windowTime.js.map 
