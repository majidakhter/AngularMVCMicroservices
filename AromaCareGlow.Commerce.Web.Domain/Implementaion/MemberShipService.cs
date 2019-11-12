using AromaCareGlow.Commerce.Web.Domain.Interface;
using AromaCareGlow.Commerce.Web.Model;
using AromaCareGlow.Commerce.Web.Model.DTO;
using AromaCareGlow.Commerce.Web.SOA.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Domain.Implementaion
{

    public class MemberShipService : IMembershipService
    {
        private readonly ICustomerDataServiceProxy _customerDataServiceProxy;
        private readonly IEncryptionService _encryptionService;
        public MemberShipService(ICustomerDataServiceProxy customerDataServiceProxy, IEncryptionService encryptionService)
        {
            _customerDataServiceProxy = customerDataServiceProxy;
            _encryptionService = encryptionService;
        }
        //public CustomerDto CreateCustomer(string username, string email, string password, int[] roles)
       // {
            //var existingUser = _customerDataServiceProxy.GetCustomerByUserName(username);

            //if (existingUser != null)
            //{
            //    throw new Exception("Username is already in use");
            //}

            //var passwordSalt = _encryptionService.CreateSalt();

            //var user = new CustomerPasswordDto()
            //{
            //    CustomerId = username,
            //    PasswordFormatId =
            //    PasswordSalt = passwordSalt,
            //    Password = _encryptionService.EncryptPassword(password, passwordSalt),
            //    CreatedOnUtc = DateTime.Now
            //};

            //_userRepository.Add(user);

            //_userRepository.Commit();

            //if (roles != null || roles.Length > 0)
            //{
            //    foreach (var role in roles)
            //    {
            //        addUserToRole(user, role);
            //    }
            //}

            //_userRepository.Commit();

           // return user;
        //}

        public CustomerDto GetCustomer(int customerId)
        {
            var result = _customerDataServiceProxy.GetCustomerById(customerId);
            var Customer = result.Result;
            return Customer;
        }

        public List<CustomerRoleDto> GetCustomerRoles(string username)
        {
            List<CustomerRoleDto> _result = new List<CustomerRoleDto>();

            var existingUser = _customerDataServiceProxy.GetCustomerRoleBySystemName(username);

            if (existingUser != null)
            {
                _result.Add(existingUser.Result);
            }

            return _result.Distinct().ToList();
        }

        public MembershipContext ValidateUser(string username, string password)
        {
            var membershipCtx = new MembershipContext();

            var user = _customerDataServiceProxy.GetCustomerByUserName(username);
            if (user != null && isUserValid(user.Result, password))
            {
                var userRoles = GetCustomerRoles(user.Result.SystemName);
                membershipCtx.Customer = user.Result;

                var identity = new GenericIdentity(user.Result.Username);
                membershipCtx.Principal = new GenericPrincipal(
                    identity,
                    userRoles.Select(x => x.Name).ToArray());
            }

            return membershipCtx;
        }
        #region Helper methods
        //private void addUserToRole(User user, int roleId)
        //{
        //    var role = _roleRepository.GetSingle(roleId);
        //    if (role == null)
        //        throw new Exception("Role doesn't exist.");

        //    var userRole = new UserRole()
        //    {
        //        RoleId = role.Id,
        //        UserId = user.Id
        //    };
        //    _userRoleRepository.Add(userRole);

        //    _userRepository.Commit();
        //}

        private bool isPasswordValid(CustomerPasswordDto user, string password)
        {
            //return string.Equals(_encryptionService.EncryptPassword(password, user.Password), user.PasswordSalt);
            var hashPassword = _encryptionService.CreatePasswordHash(password, user.PasswordSalt, "SHA512");
            return   user.Password.Equals(hashPassword);
        }

        private bool isUserValid(CustomerDto user, string password)
        {
            var customerPasswordDto = _customerDataServiceProxy.GetCurrentPassword(user.Id);
            if (isPasswordValid(customerPasswordDto.Result, password))
            {
                return true;
            }

            return false;
        }
        //public virtual CustomerPasswordDto GetCurrentPassword(int customerId)
        //{
        //    if (customerId == 0)
        //        return null;

        //    //return the latest password
        //    return GetCustomerPasswords(customerId, passwordsToReturn: 1).FirstOrDefault();
        //}
        //public virtual List<CustomerPasswordDto> GetCustomerPasswords(int? customerId = null,
        //  PasswordFormat? passwordFormat = null, int? passwordsToReturn = null)
        //{
        //    //var query = _customerPasswordRepository.Table;
        //    //Get all password from Customer Password Table 
        //    IEnumerable<CustomerPasswordDto> query = new CustomerPasswordDto[] { new CustomerPasswordDto() };
        //    var list = new List<CustomerPasswordDto>();
        //    list.Add(new CustomerPasswordDto { CustomerId = 1, PasswordFormat = PasswordFormat.Hashed, CreatedOnUtc = new DateTime("2019-11-07") });
        //    list.Add(new CustomerPasswordDto { CustomerId = 6, PasswordFormat = PasswordFormat.Hashed, CreatedOnUtc = new DateTime() });
        //    list.Add(new CustomerPasswordDto { CustomerId = 7, PasswordFormat = PasswordFormat.Hashed, CreatedOnUtc = new DateTime() });
        //    query = (IEnumerable<CustomerPasswordDto>)list;
        //    //filter by customer
        //    if (customerId.HasValue)
        //        query = query.Where(password => password.CustomerId == customerId.Value);

        //    //filter by password format
        //    if (passwordFormat.HasValue)
        //        query = query.Where(password => password.PasswordFormatId == (int)passwordFormat.Value);

        //    //get the latest passwords
        //    if (passwordsToReturn.HasValue)
        //        query = query.OrderByDescending(password => password.CreatedOnUtc).Take(passwordsToReturn.Value);

        //    return query.ToList();
        //}
        #endregion
    }
}
