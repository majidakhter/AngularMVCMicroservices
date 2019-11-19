using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.AngularMVC.ViewModel
{
   public class AddressViewModel
   {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Country[] Country { get; set; }
        public State[] State { get; set; }
        public string City { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Zip { get; set; }
        public string PhoneNo { get; set; }
        public string FaxNumber { get; set; }
        public string SelectedCountry { get; set; }
        public string SelectedState { get; set; }
    }
}
