using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Objects;
using System.Data.Services;
using System.Data.Services.Common;
using System.Linq;
using System.Web;
using JayData.NewsReader;


namespace JayData
{
    public class NewsReaderService : DataService<ObjectContext>
    {
        // This method is called only once to initialize service-wide policies.
        public static void InitializeService(DataServiceConfiguration config)
        {
            // TODO: set rules to indicate which entity sets and service operations are visible, updatable, etc.
            // Examples:
            config.SetEntitySetAccessRule("*", EntitySetRights.All);
            // config.SetServiceOperationAccessRule("MyServiceOperation", ServiceOperationRights.All);
            config.DataServiceBehavior.MaxProtocolVersion = DataServiceProtocolVersion.V2;
        }

        protected override ObjectContext CreateDataSource()
        {
            NewsReaderContext newsReader = new NewsReaderContext();
            var context = ((IObjectContextAdapter)newsReader).ObjectContext;
            context.ContextOptions.ProxyCreationEnabled = false;
            return context;
        }
        //protected override void OnStartProcessingRequest(ProcessRequestArgs args)
        //{
        //    if (args.RequestUri.Segments[2] == "$resetdb")
        //    {
        //        this.CurrentDataSource.DeleteDatabase();
        //        return;
        //    }
        //    base.OnStartProcessingRequest(args);
        //}
    }
}
