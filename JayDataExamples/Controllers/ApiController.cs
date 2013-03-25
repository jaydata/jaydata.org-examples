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
            ExampleDoc configDoc = null;

            using (XmlReader reader = XmlReader.Create(HttpContext.Current.Server.MapPath("~/ExampleList.xml")))
            {
                reader.MoveToContent();
                configDoc = new XmlSerializer(typeof(ExampleDoc)).Deserialize(reader) as ExampleDoc;
            }

            return configDoc.Examples.AsQueryable();
        }
    }
}