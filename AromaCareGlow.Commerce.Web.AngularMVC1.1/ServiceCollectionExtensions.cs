using AromaCareGlow.Commerce.Web.Domain.Implementaion;
using AromaCareGlow.Commerce.Web.Domain.Interface;
using AromaCareGlow.Commerce.Web.SOA.Contract;
using AromaCareGlow.Commerce.Web.SOA.Proxy;
using Microsoft.Extensions.DependencyInjection;

namespace AromaCareGlow.Commerce.Web.AngularMVC1._1
{
    public static class ServiceCollectionExtensions
    {
        public static void AddDependencyServices(this IServiceCollection services)
        {
            services.AddSingleton<ICustomerService, CustomerService>();
            services.AddSingleton<ICustomerDataServiceProxy, CustomerDataServiceProxy>();
            services.AddSingleton<IEncryptionService, EncryptionService>();
            services.AddSingleton<IMembershipService, MemberShipService>();
        }
    }
}
