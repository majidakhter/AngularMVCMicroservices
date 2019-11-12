using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AromaCareGlow.Commerce.Web.Domain.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AromaCareGlow.Commerce.Web.AngularMVC.ViewModel;
using AromaCareGlow.Commerce.Web.Model;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using AromaCareGlow.Commerce.Web.Model.DTO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;

namespace AromaCareGlow.Commerce.Web.AngularMVC1._1.Controllers
{
    [Produces("application/json")]
    [Route("api/Customer")]
    public class CustomerController : Controller
    {
        private readonly ICustomerService _customerDataServiceProxy;
        private readonly IMembershipService _membershipService;
        private readonly ILogger _logger;
        public CustomerController(ICustomerService customerDataServiceProxy, IMembershipService membershipService, ILogger logger)
        {
            _customerDataServiceProxy = customerDataServiceProxy;
            _membershipService = membershipService;
            _logger = logger;
        }
        [HttpPost("authenticate")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel user)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _authenticationResult = null;

            try
            {
                MembershipContext _userContext = _membershipService.ValidateUser(user.Username, user.Password);

                if (_userContext.Customer != null)
                {
                    IEnumerable<CustomerRoleDto> _roles = _membershipService.GetCustomerRoles(user.Username);
                    List<Claim> _claims = new List<Claim>();
                    foreach (CustomerRoleDto role in _roles)
                    {
                        Claim _claim = new Claim(ClaimTypes.Role, "Admin", ClaimValueTypes.String, user.Username);
                        _claims.Add(_claim);
                    }

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(new ClaimsIdentity(_claims, CookieAuthenticationDefaults.AuthenticationScheme)),
                        new AuthenticationProperties { IsPersistent = user.RememberMe });


                    _authenticationResult = new GenericResult()
                    {
                        Succeeded = true,
                        Message = "Authentication succeeded"
                    };
                }
                else
                {
                    _authenticationResult = new GenericResult()
                    {
                        Succeeded = false,
                        Message = "Authentication failed"
                    };
                }
            }
            catch (Exception ex)
            {
                _authenticationResult = new GenericResult()
                {
                    Succeeded = false,
                    Message = ex.Message
                };
                _logger.LogError(ex, ex.Message, ex.StackTrace, DateTime.Now);
            }

            _result = new ObjectResult(_authenticationResult);
            return _result;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await HttpContext.SignOutAsync("Cookies");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message, ex.StackTrace, DateTime.Now);
                return BadRequest();
            }

        }

        [Route("register")]
        [HttpPost]
        public IActionResult Register([FromBody] RegistrationViewModel user)
        {
            IActionResult _result = new ObjectResult(false);
            GenericResult _registrationResult = null;

            try
            {
                if (ModelState.IsValid)
                {
                    //User _user = _membershipService.CreateUser(user.Username, user.Email, user.Password, new int[] { 1 });
                    CustomerDto _user = new CustomerDto();
                    if (_user != null)
                    {
                        _registrationResult = new GenericResult()
                        {
                            Succeeded = true,
                            Message = "Registration succeeded"
                        };
                    }
                }
                else
                {
                    _registrationResult = new GenericResult()
                    {
                        Succeeded = false,
                        Message = "Invalid fields."
                    };
                }
            }
            catch (Exception ex)
            {
                _registrationResult = new GenericResult()
                {
                    Succeeded = false,
                    Message = ex.Message
                };
                _logger.LogError(ex, ex.Message, ex.StackTrace, DateTime.Now);
            }

            _result = new ObjectResult(_registrationResult);
            return _result;
        }
    }
}