export class CustomerTest {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
    constructor(oldpassword: string, newpassword: string,confirmpassword:string) {
        this.OldPassword = oldpassword;
        this.NewPassword = newpassword;
        this.ConfirmPassword = confirmpassword;
    }
}