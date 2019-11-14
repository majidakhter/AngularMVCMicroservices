"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Registration = (function () {
    function Registration(username, password, email, firstName, lastName, gender, companyName, newsLetter, dateOfBirth, selectedGender, day, month, year) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Gender = gender;
        this.CompanyName = companyName;
        this.NewsLetter = newsLetter;
        this.DateOfBirth = dateOfBirth;
        this.SelectedGender = selectedGender;
        this.Day = day;
        this.Month = month;
        this.Year = year;
    }
    return Registration;
}());
exports.Registration = Registration;
