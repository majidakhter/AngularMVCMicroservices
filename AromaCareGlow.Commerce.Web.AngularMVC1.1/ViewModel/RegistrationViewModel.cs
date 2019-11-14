using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.AngularMVC.ViewModel
{
    public class RegistrationViewModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public Item[] Gender { get; set; }
        public Item[] Day { get; set; }
        public Item[] Month { get; set; }
        public Item[] Year { get; set; }
        public string SelectedGender { get; set; }
        public string CompanyName { get; set; }
        public bool NewsLetter { get; set; }
        public string DateOfBirth { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
