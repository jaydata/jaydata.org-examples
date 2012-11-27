using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using Windows.ApplicationModel.Resources.Core;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using System.Collections.Specialized;
using System.Data.Services.Client;
using System.Threading.Tasks;
using FlowerShop.JayStorm.Repository;

// The data model defined by this file serves as a representative example of a strongly-typed
// model that supports notification when members are added, removed, or modified.  The property
// names chosen coincide with data bindings in the standard item templates.
//
// Applications may use this model as a starting point and build on it, or discard it entirely and
// replace it with something appropriate to their needs.

namespace FlowerShop.Data
{
    /// <summary>
    /// Base class for <see cref="SampleDataItem"/> and <see cref="SampleDataGroup"/> that
    /// defines properties common to both.
    /// </summary>
    [Windows.Foundation.Metadata.WebHostHidden]
    public abstract class SampleDataCommon : FlowerShop.Common.BindableBase
    {
        private static Uri _baseUri = new Uri("ms-appx:///");

        public SampleDataCommon(String uniqueId, String title, String subtitle, String imagePath, String description)
        {
            this._uniqueId = uniqueId;
            this._title = title;
            this._subtitle = subtitle;
            this._description = description;
            this._imagePath = imagePath;
        }

        private string _uniqueId = string.Empty;
        public string UniqueId
        {
            get { return this._uniqueId; }
            set { this.SetProperty(ref this._uniqueId, value); }
        }

        private string _title = string.Empty;
        public string Title
        {
            get { return this._title; }
            set { this.SetProperty(ref this._title, value); }
        }

        private string _subtitle = string.Empty;
        public string Subtitle
        {
            get { return this._subtitle; }
            set { this.SetProperty(ref this._subtitle, value); }
        }

        private string _description = string.Empty;
        public string Description
        {
            get { return this._description; }
            set { this.SetProperty(ref this._description, value); }
        }

        private ImageSource _image = null;
        private String _imagePath = null;
        public ImageSource Image
        {
            get
            {
                if (this._image == null && this._imagePath != null)
                {
                    this._image = new BitmapImage(new Uri(SampleDataCommon._baseUri, this._imagePath));
                }
                return this._image;
            }

            set
            {
                this._imagePath = null;
                this.SetProperty(ref this._image, value);
            }
        }

        public void SetImage(String path)
        {
            this._image = null;
            this._imagePath = path;
            this.OnPropertyChanged("Image");
        }

        public override string ToString()
        {
            return this.Title;
        }
    }

    /// <summary>
    /// Generic item data model.
    /// </summary>
    public class SampleDataItem : SampleDataCommon
    {
        public SampleDataItem(String uniqueId, String title, double price, String imagePath, String description, String content, SampleDataGroup group)
            : base(uniqueId, title, "", imagePath, description)
        {
            this._content = content;
            this._group = group;
            this._price = price;
        }

        private string _content = string.Empty;
        public string Content
        {
            get { return this._content; }
            set { this.SetProperty(ref this._content, value); }
        }

        private double _price;
        public double Price
        {
            get { return this._price; }
            set { this.SetProperty(ref this._price, value); }
        }

        private SampleDataGroup _group;
        public SampleDataGroup Group
        {
            get { return this._group; }
            set { this.SetProperty(ref this._group, value); }
        }
    }

    /// <summary>
    /// Generic group data model.
    /// </summary>
    public class SampleDataGroup : SampleDataCommon
    {
        public SampleDataGroup(String uniqueId, String title, String subtitle, String imagePath, String description)
            : base(uniqueId, title, subtitle, imagePath, description)
        {
            Items.CollectionChanged += ItemsCollectionChanged;
        }

        private void ItemsCollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            // Provides a subset of the full items collection to bind to from a GroupedItemsPage
            // for two reasons: GridView will not virtualize large items collections, and it
            // improves the user experience when browsing through groups with large numbers of
            // items.
            //
            // A maximum of 12 items are displayed because it results in filled grid columns
            // whether there are 1, 2, 3, 4, or 6 rows displayed

            switch (e.Action)
            {
                case NotifyCollectionChangedAction.Add:
                    if (e.NewStartingIndex < 12)
                    {
                        TopItems.Insert(e.NewStartingIndex, Items[e.NewStartingIndex]);
                        if (TopItems.Count > 12)
                        {
                            TopItems.RemoveAt(12);
                        }
                    }
                    break;
                case NotifyCollectionChangedAction.Move:
                    if (e.OldStartingIndex < 12 && e.NewStartingIndex < 12)
                    {
                        TopItems.Move(e.OldStartingIndex, e.NewStartingIndex);
                    }
                    else if (e.OldStartingIndex < 12)
                    {
                        TopItems.RemoveAt(e.OldStartingIndex);
                        TopItems.Add(Items[11]);
                    }
                    else if (e.NewStartingIndex < 12)
                    {
                        TopItems.Insert(e.NewStartingIndex, Items[e.NewStartingIndex]);
                        TopItems.RemoveAt(12);
                    }
                    break;
                case NotifyCollectionChangedAction.Remove:
                    if (e.OldStartingIndex < 12)
                    {
                        TopItems.RemoveAt(e.OldStartingIndex);
                        if (Items.Count >= 12)
                        {
                            TopItems.Add(Items[11]);
                        }
                    }
                    break;
                case NotifyCollectionChangedAction.Replace:
                    if (e.OldStartingIndex < 12)
                    {
                        TopItems[e.OldStartingIndex] = Items[e.OldStartingIndex];
                    }
                    break;
                case NotifyCollectionChangedAction.Reset:
                    TopItems.Clear();
                    while (TopItems.Count < Items.Count && TopItems.Count < 12)
                    {
                        TopItems.Add(Items[TopItems.Count]);
                    }
                    break;
            }
        }

        private ObservableCollection<SampleDataItem> _items = new ObservableCollection<SampleDataItem>();
        public ObservableCollection<SampleDataItem> Items
        {
            get { return this._items; }
        }

        private ObservableCollection<SampleDataItem> _topItem = new ObservableCollection<SampleDataItem>();
        public ObservableCollection<SampleDataItem> TopItems
        {
            get { return this._topItem; }
        }
    }

    public class SampleCartItem : FlowerShop.Common.BindableBase
    {
        public SampleCartItem(SampleDataItem item, int count, double price)
        {
            this._item = item;
            this._count = count;
            this._price = price;
        }
        private SampleDataItem _item;
        public SampleDataItem Item
        {
            get { return this._item; }
            set { this.SetProperty(ref this._item, value); }
        }
        private int _count = 0;
        public int Count
        {
            get { return this._count; }
            set { this.SetProperty(ref this._count, value); }
        }
        private double _price;
        public double Price
        {
            get { return this._price; }
            set { this.SetProperty(ref this._price, value); }
        }
        public double SumPrice {
            get { 
                return this._count*this._price;
            }
        }
    }

    public class SampleCart : FlowerShop.Common.BindableBase
    {
        private string _name;
        public string Name
        {
            get { return this._name; }
            set { this.SetProperty(ref this._name, value); }
        }
        private string _address;
        public string Address
        {
            get { return this._address; }
            set { this.SetProperty(ref this._address, value); }
        }
        private ObservableCollection<SampleCartItem> _items = new ObservableCollection<SampleCartItem>();
        public ObservableCollection<SampleCartItem> Items
        {
            get { return this._items; }
        }
        public double SumValue {
            get { 
                var a = this._items.Select(i => i.Price * i.Count).Sum();
                if(a==0){a=12;}
                return a;
            }
        }
        public void ChangeSumValue() {
            this.OnPropertyChanged("SumValue");
        }
    }

    /// <summary>
    /// Creates a collection of groups and items with hard-coded content.
    /// 
    /// SampleDataSource initializes with placeholder data rather than live production
    /// data so that sample data is provided at both design-time and run-time.
    /// </summary>
    public sealed class SampleDataSource
    {
        private static mydatabaseService _context = new mydatabaseService(new Uri("https://133e0907-f70b-4f11-92b3-dfebc9bdd6db.jaystack.net/mydatabase"));
        private static SampleDataSource _sampleDataSource = new SampleDataSource();


        private ObservableCollection<SampleDataGroup> _allGroups = new ObservableCollection<SampleDataGroup>();
        public ObservableCollection<SampleDataGroup> AllGroups
        {
            get { return this._allGroups; }
        }

        private SampleCart _cart = new SampleCart();
        public SampleCart Cart
        {
            get { return this._cart; }
        }

        public static IEnumerable<SampleDataGroup> GetGroups(string uniqueId)
        {
            if (!uniqueId.Equals("AllGroups")) throw new ArgumentException("Only 'AllGroups' is supported as a collection of groups");
            return _sampleDataSource.AllGroups;
        }

        public static SampleDataGroup GetGroup(string uniqueId)
        {
            // Simple linear search is acceptable for small data sets
            var matches = _sampleDataSource.AllGroups.Where((group) => group.UniqueId.Equals(uniqueId));
            if (matches.Count() == 1) return matches.First();
            return null;
        }

        public static SampleDataItem GetItem(string uniqueId)
        {
            // Simple linear search is acceptable for small data sets
            var matches = _sampleDataSource.AllGroups.SelectMany(group => group.Items).Where((item) => item.UniqueId.Equals(uniqueId));
            if (matches.Count() == 1) return matches.First();
            return null;
        }

        public static void AddToCart(SampleCartItem item)
        {
            var checkItem = _sampleDataSource.Cart.Items.FirstOrDefault(i => i.Item.UniqueId == item.Item.UniqueId);
            if (checkItem != null) {
                checkItem.Count += item.Count;
            }
            else
            {
                _sampleDataSource.Cart.Items.Add(item);
            }
            _sampleDataSource.Cart.ChangeSumValue();
        }

        internal static void RemoveFromCart(SampleDataItem flower)
        {
            foreach (var item in _sampleDataSource.Cart.Items.Where(i => i.Item.UniqueId == flower.UniqueId).ToArray())
            {
                _sampleDataSource.Cart.Items.Remove(item);

            }
            _sampleDataSource.Cart.ChangeSumValue();
        }

        public static SampleCart GetCart(){
            return _sampleDataSource.Cart;
        }

        public static void SaveCart() {
            var newCustomer = new Customer { Name = _sampleDataSource._cart.Name, Address = _sampleDataSource._cart.Address };
            SampleDataSource._context.AddToCustomers(newCustomer);
            SampleDataSource._context.BeginSaveChanges((custResult) => {
                SampleDataSource._context.EndSaveChanges(custResult);
                var newOrder = new Order { Customer_ID = newCustomer.id, OrderDate = DateTime.Now, OrderState = 1 };
                SampleDataSource._context.AddToOrders(newOrder);
                SampleDataSource._context.BeginSaveChanges((orderResult) => {
                    SampleDataSource._context.EndSaveChanges(orderResult);
                    foreach (var cartItem in _sampleDataSource._cart.Items)
                    {
                        var i = new OrderItem { Order_ID = newOrder.id, Product_ID = cartItem.Item.UniqueId, Amount = cartItem.Count * cartItem.Price };
                        SampleDataSource._context.AddToOrderItems(i);
                    }
                    SampleDataSource._context.BeginSaveChanges((orderItemsResult) => {
                        SampleDataSource._context.EndSaveChanges(orderItemsResult);
                        newOrder.OrderState = 2;
                        SampleDataSource._context.BeginSaveChanges((orderUpdateResult) =>
                        {
                            SampleDataSource._context.EndSaveChanges(orderUpdateResult);
                            _sampleDataSource._cart = new SampleCart();
                        }, null);
                    }, null);
                }, null);
            }, null);
        }

        static void data_LoadCompleted(object sender, LoadCompletedEventArgs e)
        {
            var result = sender as DataServiceCollection<JayStorm.Repository.Category>;
            foreach (var cat in result)
            {
                var group = new SampleDataGroup(cat.id,
                   cat.CategoryName,
                   cat.Name,
                   cat.ImageUrl,
                   cat.Description);

                var flowers = new DataServiceCollection<JayStorm.Repository.Flower>(SampleDataSource._context);
                flowers.LoadCompleted += flowers_LoadCompleted;
                flowers.LoadAsync(SampleDataSource._context.Flowers.Where(f => f.Category_ID == cat.id));

                _sampleDataSource.AllGroups.Add(group);
            }
        }

        static void flowers_LoadCompleted(object sender, LoadCompletedEventArgs e)
        {
            var flowers = (DataServiceCollection<JayStorm.Repository.Flower>)sender;
            if (flowers.Count() == 0) { return; }
            var grp = _sampleDataSource.AllGroups.FirstOrDefault(g => g.UniqueId == flowers[0].Category_ID);
            foreach (var flower in flowers)
            {
                grp.Items.Add(new SampleDataItem(flower.id,
                                   flower.Name,
                                   flower.Price.HasValue?flower.Price.Value:0,
                                   flower.ImageUrl,
                                   flower.Description,
                                   "Item Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.\nItem Description: Pellentesque porta, mauris quis interdum vehicula, urna sapien ultrices velit, nec venenatis dui odio in augue. Cras posuere, enim a cursus convallis, neque turpis malesuada erat, ut adipiscing neque tortor ac erat.",
                                   grp));
            }
        }

        public SampleDataSource()
        {
            var data = new DataServiceCollection<JayStorm.Repository.Category>(SampleDataSource._context);
            data.LoadCompleted += data_LoadCompleted;
            var query = SampleDataSource._context.Categories;
            data.LoadAsync(query);
        }
    }
}
