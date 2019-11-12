"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Customer = (function () {
    function Customer(username, password) {
        this.Username = username;
        this.Password = password;
        this.RememberMe = false;
    }
    return Customer;
}());
exports.Customer = Customer;
