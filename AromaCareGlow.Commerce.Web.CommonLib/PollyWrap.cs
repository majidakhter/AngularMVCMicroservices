using AromaCareGlow.Commerce.Web.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Polly;
using Polly.CircuitBreaker;
using Polly.Timeout;
using Polly.Wrap;
using System;

namespace AromaCareGlow.Commerce.Web.CommonLib
{
    public class PollyWrap<T> where T : class
    {
        private readonly IOptionsMonitor<CustomerDataServiceToggleSettings> _policyConfigSettings;
        private readonly ILogger _logger;
        private int _timeoutSeconds, _retryCount, _sleepTimeAfterFail, _errorCountForCircuitbreak, _circuitBreakDuration;
        private AsyncCircuitBreakerPolicy circuitBreakerPolicy;
        public PollyWrap(IOptionsMonitor<CustomerDataServiceToggleSettings> policyConfigSettings, ILogger logger)
        {
            _policyConfigSettings = policyConfigSettings;
            _logger = logger;
            _timeoutSeconds = Convert.ToInt32(_policyConfigSettings.CurrentValue.TimeOut);
            _retryCount = Convert.ToInt32(_policyConfigSettings.CurrentValue.RetryCount);
            _sleepTimeAfterFail = Convert.ToInt32(_policyConfigSettings.CurrentValue.SleepTimeAfterFailure);
            _errorCountForCircuitbreak = Convert.ToInt32(_policyConfigSettings.CurrentValue.ErrorCountForCircuitbreak);
            _circuitBreakDuration = Convert.ToInt32(_policyConfigSettings.CurrentValue.CircuitbreakWaitInMilliseconds);
        }

        public AsyncPolicyWrap GetPolicyConfig(T request,string handlerName) 
        {
            var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromSeconds(_timeoutSeconds), TimeoutStrategy.Pessimistic);
            var retryPolicy = Policy.Handle<Exception>((ex) =>
            {
                _logger.LogError((ex.InnerException != null) ? ex.InnerException.Message : ex.Message + "\r\n" + handlerName + "\r\n Handle retry FAILURE - " + JsonConvert.SerializeObject(request), ex);
                return !(ex is Exception);
            })
           .Or<Exception>((ex) =>
           {
               _logger.LogError((ex.InnerException != null) ? ex.InnerException.Message : ex.Message + "\r\n" + handlerName + "\r\n Handle retry FAILURE - " + JsonConvert.SerializeObject(request), ex);
               return true;
           })
           .WaitAndRetryAsync(retryCount: _retryCount, sleepDurationProvider: x => TimeSpan.FromMilliseconds(_sleepTimeAfterFail));

            circuitBreakerPolicy = Policy.Handle<Exception>().CircuitBreakerAsync(exceptionsAllowedBeforeBreaking: _errorCountForCircuitbreak, durationOfBreak: TimeSpan.FromMilliseconds(_circuitBreakDuration),
              onBreak: (ex, breakDelay) =>
              {
                  _logger.LogError(ex, (ex.InnerException != null) ? ex.InnerException.Message : ex.Message + "\r\n "+ handlerName + " Circuit broken");
              },
              onReset: () => { });

            var pollyWrap = Policy.WrapAsync(circuitBreakerPolicy, timeoutPolicy, retryPolicy);

            return pollyWrap;
        }
    }
}
