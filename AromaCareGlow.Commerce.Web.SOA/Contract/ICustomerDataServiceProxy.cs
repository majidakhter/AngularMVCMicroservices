using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.SOA.Contract
{
    public interface ICustomerDataServiceProxy
    {
        Task<CustomerDto> GetCustomerByEmail(string emailId);
    }
}
