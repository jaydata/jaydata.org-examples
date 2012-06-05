using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JayDataExamples.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public RedirectResult Index()
        {
            return new RedirectResult("examples/index.html");
        }

    }
}
