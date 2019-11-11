using System;
using System.Collections.Generic;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Model.DTO
{
    public partial class CustomerCustomerRoleMappingDto:BaseEntityDto
    {
        /// <summary>
        /// Gets or sets the customer identifier
        /// </summary>
        public int CustomerId { get; set; }

        /// <summary>
        /// Gets or sets the customer role identifier
        /// </summary>
        public int CustomerRoleId { get; set; }

        /// <summary>
        /// Gets or sets the customer
        /// </summary>
        public virtual CustomerDto Customer { get; set; }

        /// <summary>
        /// Gets or sets the customer role
        /// </summary>
        public virtual CustomerRoleDto CustomerRole { get; set; }
    }
}
