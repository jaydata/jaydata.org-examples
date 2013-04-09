using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
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
                //ExampleDoc._instance = null;
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
        [XmlAnyElement]
        public XmlNode IncludeGroups { get; set; }
        [XmlAnyElement("Includes")]
        public XmlNode GlobalInclude { get; set; }
        [XmlArray("Examples")]
        [XmlArrayItem(typeof(Example))]
        public List<Example> Examples { get; set; }

        internal IEnumerable<XmlNode> GetIncludes(string name)
        {
            var list = new List<XmlNode>();
            foreach (XmlNode node in this.IncludeGroups.SelectNodes(string.Format("/Group[@name='{0}']/*", name))) {
                list.Add(node);
            }
            return list;
        }
        [XmlIgnore]
        public List<XmlNode> ResolvedIncludes
        {
            get
            {
                var list = new List<XmlNode>();
                if (this.GlobalInclude != null)
                {
                    foreach (XmlNode node in this.GlobalInclude.SelectNodes("*"))
                    {
                        if (node.Name != "group")
                        {
                            list.Add(node);
                        }
                        else
                        {
                            var nodeList = this.GetIncludes(node.Attributes["name"].Value);
                            list = new List<XmlNode>(list.Concat(nodeList));
                        }
                    }
                }
                return list;
            }
        }
        [XmlIgnore]
        public string GlobalIncludesString
        {
            get
            {
                var sb = new StringBuilder();
                foreach (XmlNode node in this.ResolvedIncludes)
                {
                    sb.AppendLine(node.OuterXml);
                }
                return sb.ToString();
            }
        }
    }
}