using System.Collections.Generic;
using System.Web;
using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.App_Code
{
    [XmlRoot("MainPage")]
    public class ExampleDoc
    {
        private static ExampleDoc _instance;
        internal static ExampleDoc Instnace
        {
            get
            {
                ExampleDoc._instance = null;
                if (ExampleDoc._instance == null)
                {
                    using (XmlReader reader = XmlReader.Create(HttpContext.Current.Server.MapPath("~/ExampleList.xml")))
                    {
                        reader.MoveToContent();
                        ExampleDoc._instance = new XmlSerializer(typeof(ExampleDoc)).Deserialize(reader) as ExampleDoc;
                    }
                }
                return ExampleDoc._instance;
            }
        }
        [XmlArray("Examples")]
        [XmlArrayItem(typeof(Example))]
        public List<Example> Examples { get; set; }
    }
}