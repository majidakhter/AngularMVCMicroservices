using System;
using System.Collections.Generic;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Domain.Interface
{
    public interface IEncryptionService
    {
        /// <summary>
        /// Creates a random salt
        /// </summary>
        /// <returns></returns>
        string CreateSalt();
        /// <summary>
        /// Generates a Hashed password
        /// </summary>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        string EncryptPassword(string password, string salt);
        /// <summary>
        /// Creates a Hash salt
        /// </summary>
        /// <returns></returns>
        string CreatePasswordHash(string password, string saltkey, string passwordFormat);
    }
}
