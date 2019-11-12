"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User(username, password) {
        this.Username = username;
        this.Password = password;
        this.RememberMe = false;
    }
    return User;
}());
exports.User = User;
