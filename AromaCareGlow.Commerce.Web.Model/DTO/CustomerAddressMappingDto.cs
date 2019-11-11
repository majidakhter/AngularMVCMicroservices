using System;
using System.Collections.Generic;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Model.DTO
{
    /// <summary>
    /// Represents a customer-address mapping class
    /// </summary>
    public partial class CustomerAddressMappingDto : BaseEntityDto
    {
        /// <summary>
        /// Gets or sets the customer identifier
        /// </summary>
        public int CustomerId { get; set; }

        /// <summary>
        /// Gets or sets the address identifier
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// Gets or sets the customer
        /// </summary>
        public virtual CustomerDto Customer { get; set; }

        /// <summary>
        /// Gets or sets the address
        /// </summary>
        public virtual AddressDto Address { get; set; }
    }
}
