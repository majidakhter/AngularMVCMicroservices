export class Registration {
    Username: string;
    FirstName: string;
    LastName: string;
    Password: string;
    Email: string;
    Gender: string;
    CompanyName: string;
    NewsLetter: boolean;
    constructor(username: string,
        password: string,
        email: string, firstName: string, lastName: string, gender: string, companyName: string, newsLetter: boolean) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Gender = gender;
        this.CompanyName = companyName;
        this.NewsLetter = newsLetter;
    }
}