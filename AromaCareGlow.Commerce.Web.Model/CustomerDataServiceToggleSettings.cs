using System;

namespace AromaCareGlow.Commerce.Web.Model
{
    public class CustomerDataServiceToggleSettings
    {
        public string CustomerServiceUri { get; set; }
        public int TimeOut { get; set; }
        public int RetryCount { get; set; }
        public int SleepTimeAfterFailure { get; set; }
        public int ErrorCountForCircuitbreak { get; set; }
        public int CircuitbreakWaitInMilliseconds { get; set; }
    }
}
