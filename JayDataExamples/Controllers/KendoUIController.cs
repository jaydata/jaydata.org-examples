using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JayDataExamples.Controllers
{
    public class KendoUIController : Controller
    {
        public ActionResult Index(string id)
        {
            return View(id);
        }

    }
}
