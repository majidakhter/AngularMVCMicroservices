﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AromaCareGlow.Commerce.Web.Models;
using AromaCareGlow.Commerce.Web.SOA.Contract;

namespace AromaCareGlow.Commerce.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICustomerDataServiceProxy _customerDataServiceProxy;
        public HomeController(ICustomerDataServiceProxy customerDataServiceProxy)
        {
            _customerDataServiceProxy = customerDataServiceProxy;
        }
        public IActionResult Index()
        {
            var result =_customerDataServiceProxy.GetCustomerByEmail("majid80_sit@yahoo.com");
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
