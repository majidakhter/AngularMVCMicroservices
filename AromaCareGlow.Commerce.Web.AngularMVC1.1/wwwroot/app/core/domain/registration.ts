import { Item } from '../../core/common/item';
export class Registration {
    Username: string;
    FirstName: string;
    LastName: string;
    Password: string;
    Email: string;
    Gender: Item[];
    CompanyName: string;
    NewsLetter: boolean;
    DateOfBirth: string;
    Day: Item[];
    Month: Item[];
    Year: Item[];
    SelectedGender: string;
    constructor(username: string,
        password: string,
        email: string, firstName: string, lastName: string, gender: Item[], companyName: string, newsLetter: boolean, dateOfBirth: string, selectedGender: string, day: Item[], month: Item[], year: Item[]) {
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
}