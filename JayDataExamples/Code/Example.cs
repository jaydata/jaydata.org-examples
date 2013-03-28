using System.Collections.Generic;
using System.Linq;
using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.App_Code
{
    public class Example
    {
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
        [XmlElement("Download")]
        public string Download { get; set; }
        [XmlElement("JsFiddle")]
        public string JsFiddle { get; set; }
        [XmlElement("Suggested")]
        public string Suggested { get; set; }
        [XmlElement("Level")]
        public int Level { get; set; }
        [XmlArray("SupportedBrowsers")]
        [XmlArrayItem(typeof(Browser))]
        public List<Browser> SupportedBrowsers { get; set; }
        [XmlArray("RelatedContents")]
        [XmlArrayItem(typeof(ContentLink))]
        public List<ContentLink> RelatedContents { get; set; }
        [XmlIgnore]
        public List<string> TagList
        {
            get
            {
                if (this.Tags == null) { return new List<string>(); }
                return this.Tags.Split(',').Select(s => s.Trim()).ToList();
            }
        }
        [XmlIgnore]
        public int ComputedLevel
        {
            get
            {
                var i = string.IsNullOrEmpty(this.Suggested) ? 1 : -1;
                return Level * i;
            }
        }
        public Example()
        {
            this.Level = 1000;
        }
    }
}