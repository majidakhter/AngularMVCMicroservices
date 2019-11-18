import { Country } from '../../core/common/country';
import { State} from '../../core/common/state';
export class Address {
    FirstName: string;
    LastName: string;
    Email: string;
    Country: Country[];
    State: State[];
    City: string;
    Address1: string;
    Address2: string;
    Zip: string;
    PhoneNo: string;
    FaxNumber: string;
    SelectedCountry: string;
    SelectedState: string;
    constructor(firstName: string, lastName: string, email: string, country: Country[], state: State[], city: string, address1: string, address2: string, zip: string, phoneno: string, faxnumber: string,selectedCountry :string,selectedState:string) {
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
}