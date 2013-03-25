using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Xml;

namespace JayDataExamples.Controllers
{
    public class ExamplesController : System.Web.Http.ApiController
    {
        [HttpGet]
        public IEnumerable<Example> Examples()
        {

            ExampleDoc configDoc = null;
            using (XmlReader reader = XmlReader.Create(Server.MapPath("~/ExampleList.xml")))
            {
                reader.MoveToContent();
                configDoc = new XmlSerializer(typeof(ExampleDoc)).Deserialize(reader) as ExampleDoc;
            }

            return View(configDoc);


            return new Example[] { 
                new Example{Title="lószar"},
                new Example{Title="lószar1"},
                new Example{Title="lószar2"}
            };
        }
    }
}