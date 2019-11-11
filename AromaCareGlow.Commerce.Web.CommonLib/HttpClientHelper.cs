using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace AromaCareGlow.Commerce.Web.CommonLib
{
    public static class HttpClientHelper
    {
       
        private static readonly HttpClient httpClientEndpoint;
        static HttpClientHelper()
        {
            httpClientEndpoint = new HttpClient();
        }
        public static HttpClient GetStaticItemApiHttpClient()
        {
            return httpClientEndpoint;
        }

    }
}

