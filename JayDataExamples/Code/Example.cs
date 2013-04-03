using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.App_Code
{
    public class Example
    {
        [XmlAttribute("wide")]
        public bool IsWide { get; set; }
        [XmlElement("Title")]
        public string Title { get; set; }
        [XmlElement("Lead")]
        public string Lead { get; set; }
        [XmlElement("Description")]
        public string Description { get; set; }
        [XmlElement("Meta-KeyWords")]
        public string MetaKeyWords { get; set; }
        [XmlElement("Meta-Description")]
        public string MetaDescription { get; set; }
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
        [XmlAnyElement]
        public XmlNode Includes { get; set; }
        [XmlAnyElement("GalleryImages")]
        public XmlNode GalleryImagesNode { get; set; }
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
        public List<string> LimitedTagList
        {
            get
            {
                if (this.Tags == null) { return new List<string>(); }
                return this.Tags.Split(',').Take(4).Select(s => s.Trim()).ToList();
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
        [XmlIgnore]
        public List<XmlNode> ResolvedIncludes
        {
            get
            {
                var list = new List<XmlNode>();
                if (this.Includes != null)
                {
                    foreach (XmlNode node in this.Includes.SelectNodes("*"))
                    {
                        if (node.Name != "group")
                        {
                            list.Add(node);
                        }
                        else {
                            var nodeList = ExampleDoc.Instnace.GetIncludes(node.Attributes["name"].Value);
                            list = new List<XmlNode>( list.Concat(nodeList));
                        }
                    }
                }
                return list;
            }
        }
        [XmlIgnore]
        public string IncludesString
        {
            get {
                var sb = new StringBuilder();
                foreach (XmlNode node in this.ResolvedIncludes)
                {
                    sb.AppendLine(node.OuterXml);
                }
                return sb.ToString();
            }
        }
        public string GlobalIncludesString
        {
            get
            {
                return ExampleDoc.Instnace.GlobalIncludesString;
            }
        }
        [XmlIgnore]
        public XmlNodeList GalleryImages {
            get {
                if (this.GalleryImagesNode != null)
                {
                    return this.GalleryImagesNode.SelectNodes("*");
                }
                return null;
            }
        }
        public Example()
        {
            this.IsWide = false;
            this.Level = 1000;
        }
    }
}