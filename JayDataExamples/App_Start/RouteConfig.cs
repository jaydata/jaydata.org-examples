using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace JayDataExamples
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            
           // routes.MapRoute(
           //               name: "ExampleRoute2",
           //               url: "General/{id}",
           //               defaults: new { controller = "Home", action = "Example", id = UrlParameter.Optional }
           //);
            routes.MapRoute(
                name: "Default1",
                url: "",
                defaults: new { controller = "Home", action = "Index" }
            );
            routes.MapRoute(
                           name: "ExampleRoute",
                           url: "{type}/{id}",
                           defaults: new { controller = "Home", action = "Example", type="General", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}",
                defaults: new { controller = "Home", action = "Index" }
            );

        }
    }
}