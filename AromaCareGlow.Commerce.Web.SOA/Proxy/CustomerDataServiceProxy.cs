using AromaCareGlow.Commerce.Web.CommonLib;
using AromaCareGlow.Commerce.Web.Model;
using AromaCareGlow.Commerce.Web.Model.DTO;
using AromaCareGlow.Commerce.Web.SOA.Contract;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Polly;
using Polly.CircuitBreaker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace AromaCareGlow.Commerce.Web.SOA.Proxy
{
    public class CustomerDataServiceProxy : ICustomerDataServiceProxy
    {
        private CustomerDataServiceToggleSettings quoteInfoToggle;
        private static HttpClient client;
        private static CircuitBreakerPolicy CircuitBreakerPolicy { get; set; }
        private const string CUSTOMERDATASERVICE_GETCUSTOMER = "v1/Customer/GetCustomerByEmail";
        
        public CustomerDataServiceProxy()
        {
           // quoteInfoToggle = ConsulUtil.GetConsulProperty<QuoteInfoToggleSettings>(ConsulConstants.QuoteInfoToggleSettings);
            if (CircuitBreakerPolicy == null && quoteInfoToggle != null)
            {

                //CircuitBreakerPolicy = Policy.Handle<Exception>()
                //   .CircuitBreakerAsync(exceptionsAllowedBeforeBreaking: quoteInfoToggle.ErrorCountForCircuitbreak,
                //   durationOfBreak: TimeSpan.FromMilliseconds(quoteInfoToggles.CircuitbreakWaitInMilliseconds),
                //  onBreak: (ex, breakDelay) =>
                //  {
                //      Logger.Current.WriteError(ex, (ex.InnerException != null) ? ex.InnerException.Message : ex.Message + "\r\n SolutionQuoteService Circuit broken");
                //  },
                //  onReset: () => { });
            }

            client = HttpClientHelper.GetStaticItemApiHttpClient();
        }
        public async Task<CustomerDto> GetCustomerByEmail(string emailId)
        {
            CustomerDto objResponse = new CustomerDto();
            if (string.IsNullOrEmpty(emailId))
            {
                throw new ArgumentNullException();
            }
            var uri = string.Format("{0}/{1}/{2}",
                                   "https://localhost:44328",
                                   CUSTOMERDATASERVICE_GETCUSTOMER, emailId);
           
            var results= await client.GetAsync(uri).ConfigureAwait(false);
           
            if (results.IsSuccessStatusCode)
            {
                var jsonString = await results.Content.ReadAsStringAsync();
                objResponse = JsonConvert.DeserializeObject<CustomerDto>(jsonString);
                
            }
            return objResponse;
        }
        private HttpContent CreateHttpContent(object content)
        {
            HttpContent httpContent = null;

            if (content != null)
            {
                var ms = new MemoryStream();
                SerializeJsonIntoStream(content, ms);
                ms.Seek(0, SeekOrigin.Begin);
                httpContent = new StreamContent(ms);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            }

            return httpContent;
        }
        private void SerializeJsonIntoStream(object value, Stream stream)
        {
            using (var sw = new StreamWriter(stream, new UTF8Encoding(false), 1024, true))
            using (var jtw = new JsonTextWriter(sw) { Formatting = Formatting.None })
            {
                var js = new JsonSerializer();
                js.Serialize(jtw, value);
                jtw.Flush();
            }
        }
    }
}
