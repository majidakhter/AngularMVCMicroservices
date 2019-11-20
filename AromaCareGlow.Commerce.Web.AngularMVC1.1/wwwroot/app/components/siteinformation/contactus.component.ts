import { Component, OnInit } from '@angular/core';
import { Contactus } from '../../core/domain/contactus';
@Component({
    selector: 'order',
    templateUrl: './app/components/siteinformation/contactus.component.html'
})
export class ContactusComponent implements OnInit {
    ContactUs: Contactus;
    constructor() {

    }
    ngOnInit() {
        this.ContactUs = this.getContactUs();
    }
    send(contactUs: Contactus) {

    }
    getContactUs(): Contactus {
        var contact = {
            'Email': '',
            'Enquiry': '',
            'FullName': '',
            'Subject': '',
            'FirstName': '',
            'LastName':''
        }
        return contact;
    }
}