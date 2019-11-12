using AromaCareGlow.Commerce.Web.Model.DTO;
using System;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.SOA.Contract
{
    public interface ICustomerDataServiceProxy
    {
        Task<CustomerDto> GetCustomerByEmail(string emailId);
        Task<CustomerDto> GetCustomerById(int customerId);
        Task<CustomerDto> GetCustomerByUserName(string userName);
        Task<CustomerPasswordDto> GetCurrentPassword(int customerId);
        Task<CustomerRoleDto> GetCustomerRoleBySystemName(string systemName);
    }
}
