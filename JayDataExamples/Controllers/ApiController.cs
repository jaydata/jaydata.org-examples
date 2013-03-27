using System.Linq;
using System.Web.Http;
using JayDataExamples.App_Code;

namespace JayDataExamples.Controllers
{
    public class ExamplesController : System.Web.Http.ApiController
    {
        [HttpGet]
        public IQueryable<Example> GetExamples()
        {
            return ExampleDoc.Instnace.Examples.AsQueryable();
        }
    }
}