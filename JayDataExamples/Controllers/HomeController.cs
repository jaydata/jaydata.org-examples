using System.Web.Mvc;
using JayDataExamples.App_Code;

namespace JayDataExamples.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(ExampleDoc.Instnace);
        }
        public ActionResult Example(string id)
        {
            return View(id);
        }
    }
}
