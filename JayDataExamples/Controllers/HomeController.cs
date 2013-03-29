using JayDataExamples.App_Code;
using System.Linq;
using System.Web.Mvc;

namespace JayDataExamples.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(ExampleDoc.Instnace);
        }

        public ActionResult Example(string id, string type)
        {
            var ex = ExampleDoc.Instnace.Examples.Where(e => e.Link == type + "/" + id).FirstOrDefault();
            var viewPath = type.Equals("General") ? id : type + "/" + id;
            return View(viewPath, ex);
        } 
    }
}
