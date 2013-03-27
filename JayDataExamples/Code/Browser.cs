using System;
using System.Xml;
using System.Xml.Serialization;

namespace JayDataExamples.App_Code
{
    public class Browser
    {
        [XmlAttribute("name")]
        public string Name { get; set; }
        [XmlAttribute("title")]
        public string Title { get; set; }
        [XmlAttribute("minVersion")]
        public string MinVersion { get; set; }
        [XmlAttribute("maxVersion")]
        public string MaxVersion { get; set; }

        public string GetClass
        {
            get
            {
                var css = "browser " + this.Name;
                return css;
            }
        }
        public string GetTitle
        {
            get
            {
                string strFormat = "{0} {1} {2}";
                if (!String.IsNullOrEmpty(this.MinVersion) && !String.IsNullOrEmpty(this.MaxVersion))
                {
                    strFormat = "{0} {1}-{2}";
                }
                if (String.IsNullOrEmpty(this.MinVersion) && !String.IsNullOrEmpty(this.MaxVersion))
                {
                    strFormat = "{0} < {2}";
                }
                if (!String.IsNullOrEmpty(this.MinVersion) && String.IsNullOrEmpty(this.MaxVersion))
                {
                    strFormat = "{0} {1}+";
                }
                if (String.IsNullOrEmpty(this.MinVersion) && String.IsNullOrEmpty(this.MaxVersion))
                {
                    strFormat = "{0} all version";
                }
                string title = String.Format(strFormat, this.Title, this.MinVersion, this.MaxVersion); ;
                return title;
            }
        }
    }
}