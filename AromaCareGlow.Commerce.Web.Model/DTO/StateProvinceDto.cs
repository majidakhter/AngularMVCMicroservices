﻿using System;
using System.Collections.Generic;
using System.Text;

namespace AromaCareGlow.Commerce.Web.Model.DTO
{
    /// <summary>
    /// Represents a state/province
    /// </summary>
    public partial class StateProvinceDto : BaseEntityDto, ILocalizedEntityDto
    {
        /// <summary>
        /// Gets or sets the country identifier
        /// </summary>
        public int CountryId { get; set; }

        /// <summary>
        /// Gets or sets the name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the abbreviation
        /// </summary>
        public string Abbreviation { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the entity is published
        /// </summary>
        public bool Published { get; set; }

        /// <summary>
        /// Gets or sets the display order
        /// </summary>
        public int DisplayOrder { get; set; }

        /// <summary>
        /// Gets or sets the country
        /// </summary>
        public virtual CountryDto Country { get; set; }
    }
}
