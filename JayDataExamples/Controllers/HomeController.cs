using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.Controllers
{
    [XmlRoot("MainPage")]
    public class ExampleDoc 
    {
        [XmlArray("Examples")]
        [XmlArrayItem(typeof(Example))]
        public List<Example> Examples { get; set; }
    }
    public class Example {
        [XmlElement("Title")]
        public string Title { get; set; }
        [XmlElement("Description")]
        public string Description { get; set; }
        [XmlElement("Image")]
        public string Image { get; set; }
        [XmlElement("Link")]
        public string Link { get; set; }
        [XmlElement("Tags")]
        public string Tags { get; set; }
        [XmlIgnore]
        public List<string> TagList {
            get {
                if (this.Tags == null) { return new List<string>(); }
                return this.Tags.Split(',').Select(s => s.Trim()).ToList();
            }
        }
    }
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ExampleDoc configDoc = null;
            using (XmlReader reader = XmlReader.Create(Server.MapPath("~/ExampleList.xml")))
            {
                reader.MoveToContent();
                configDoc = new XmlSerializer(typeof(ExampleDoc)).Deserialize(reader) as ExampleDoc;
            }

            return View(configDoc);
        }
        public ActionResult Example(string id) {
            return View(id);
        }
    }
}
