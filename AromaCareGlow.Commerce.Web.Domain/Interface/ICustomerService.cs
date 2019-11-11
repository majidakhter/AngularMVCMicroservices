using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.Domain.Interface
{
    public interface ICustomerService
    {
        Task<CustomerDto> GetCustomerByEmail(string emailId);
    }
}
