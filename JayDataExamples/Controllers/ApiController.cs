using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Xml;
using System.Xml.Serialization;

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