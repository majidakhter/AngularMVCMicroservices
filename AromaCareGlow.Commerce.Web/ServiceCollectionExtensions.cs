using AromaCareGlow.Commerce.Web.Domain.Implementaion;
using AromaCareGlow.Commerce.Web.Domain.Interface;
using AromaCareGlow.Commerce.Web.SOA.Contract;
using AromaCareGlow.Commerce.Web.SOA.Proxy;
using Microsoft.Extensions.DependencyInjection;

namespace AromaCareGlow.Commerce.Web
{
    public static class ServiceCollectionExtensions
    {
      
            public static void AddDependencyServices(this IServiceCollection services)
            {

                services.AddSingleton<ICustomerService, CustomerService>();
                services.AddSingleton<ICustomerDataServiceProxy, CustomerDataServiceProxy>();
        }
    }
}
