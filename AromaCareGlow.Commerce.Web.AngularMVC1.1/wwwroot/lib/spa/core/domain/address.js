"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Address = (function () {
    function Address(firstName, lastName, email, country, state, city, address1, address2, zip, phoneno, faxnumber, selectedCountry, selectedState) {
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Email = email;
        this.Country = country;
        this.State = state;
        this.City = city;
        this.Address1 = address1;
        this.Address2 = address2;
        this.Zip = zip;
        this.PhoneNo = phoneno;
        this.FaxNumber = faxnumber;
        this.SelectedCountry = selectedCountry;
        this.SelectedState = selectedState;
    }
    return Address;
}());
exports.Address = Address;
