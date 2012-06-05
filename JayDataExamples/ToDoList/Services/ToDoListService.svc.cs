using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq;
using System.ServiceModel.Web;
using System.Web;

namespace JayDataExamples.ToDoList.Services
{
    public class ToDoListService : DataService<ObjectContext>
    {
        public static void InitializeService(DataServiceConfiguration config)
        {
            config.SetEntitySetAccessRule("*", EntitySetRights.All);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2;
        }

        protected override ObjectContext CreateDataSource()
        {
            Models.ToDoListContext context = new Models.ToDoListContext();
            
            var objectContext = ((IObjectContextAdapter)context).ObjectContext;
            objectContext.ContextOptions.ProxyCreationEnabled = false;

            return objectContext;
        }
    }
}
