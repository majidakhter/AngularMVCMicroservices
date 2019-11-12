using AromaCareGlow.Commerce.Web.Model;
using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Domain.Interface
{
    public interface IMembershipService
    {
        MembershipContext ValidateUser(string username, string password);
        CustomerDto GetCustomer(int userId);
        List<CustomerRoleDto> GetCustomerRoles(string username);
    }
}
