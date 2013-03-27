using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.App_Code
{
    public class ContentLink
    {
        [XmlText()]
        public string Title { get; set; }
        [XmlAttribute("css")]
        public string Css { get; set; }
        [XmlAttribute("target")]
        public string Target { get; set; }
        [XmlAttribute("link")]
        public string Link { get; set; }
    }
}