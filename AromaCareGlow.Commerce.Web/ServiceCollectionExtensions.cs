using AromaCareGlow.Commerce.Web.SOA.Contract;
using AromaCareGlow.Commerce.Web.SOA.Proxy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web
{
    public static class ServiceCollectionExtensions
    {
      
            public static void AddDependencyServices(this IServiceCollection services)
            {

                services.AddSingleton<ICustomerDataServiceProxy, CustomerDataServiceProxy>();

            }
    }
}
