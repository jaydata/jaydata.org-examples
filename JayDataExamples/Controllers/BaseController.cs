using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JayDataExamples.Controllers
{
    public class BaseController :Controller
    {
        public ActionResult Index(string id)
        {
            Example ex = ExampleDoc.Instnace.Examples.Where(e => e.Link == RouteData.Values["controller"] + "/" + id).FirstOrDefault();
            return View(id, ex);
        }
    }
}