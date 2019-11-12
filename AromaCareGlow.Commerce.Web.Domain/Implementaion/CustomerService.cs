using AromaCareGlow.Commerce.Web.Domain.Interface;
using AromaCareGlow.Commerce.Web.Model.DTO;
using AromaCareGlow.Commerce.Web.SOA.Contract;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.Domain.Implementaion
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerDataServiceProxy _customerDataServiceProxy;
        public CustomerService(ICustomerDataServiceProxy customerDataServiceProxy)
        {
            _customerDataServiceProxy = customerDataServiceProxy;
        }
        public Task<CustomerDto> GetCustomerByEmail(string emailId)
        {
           var result= _customerDataServiceProxy.GetCustomerByEmail(emailId);
            return result;
        }
       
    }
}
