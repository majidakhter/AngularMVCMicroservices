using AromaCareGlow.Commerce.Web.Domain.Interface;
using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.Domain.Implementaion
{
    public class CustomerInfo : ICustomerInfo
    {
        public Task<CustomerDto> GetCustomerByEmail(string emailId)
        {
            throw new NotImplementedException();
        }
    }
}
