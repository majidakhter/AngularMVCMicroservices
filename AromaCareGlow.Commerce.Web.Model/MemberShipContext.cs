using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Model
{
    public class MembershipContext
    {
        public IPrincipal Principal { get; set; }
        public CustomerDto Customer { get; set; }
        public bool IsValid()
        {
            return Principal != null;
        }
    }
}
