"use strict";
// ref: http://blog.kwintenp.com/decorators-and-observables-to-implement-retry-logic/
// usage:
// @retry(3, [{name: 'Obi Wan', birth_year: '1234', gender: 'Male'}])
// public getCharacters(): Observable<StarWarsCharacter[]> {
//     return this.http.get('https://swapi.co/api/people/')
//         .map((response: Response) => response.json().results);
// }
Object.defineProperty(exports, "__esModule", { value: true });
// defining the decorator is the same as the defining a
// function with the same name
var Observable_1 = require("rxjs/Observable");
function retry(times, fallback) {
    if (times === void 0) { times = 3; }
    return function (target, key, descriptor) {
        // the descriptor holds a reference to the actual method we are decorating
        var originalMethod = descriptor.value;
        // we replace the old function with a new function
        descriptor.value = function () {
            // call the original method and augment the resulting observable with the retry and fallback mechanism we defined above
            return originalMethod.apply(this)
                .retryWhen(function (errors) {
                return errors.scan(function (errorCount, err) {
                    console.log('Try ' + (errorCount + 1));
                    if (errorCount >= times - 1) {
                        throw err;
                    }
                    return errorCount + 1;
                }, 0).delay(1000);
            })
                .catch(function () { return Observable_1.Observable.of(fallback); });
        };
        // return edited descriptor as opposed to
        // overwriting the descriptor
        return descriptor;
    };
}
exports.retry = retry;
