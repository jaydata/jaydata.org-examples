using FlowerShop.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Group Detail Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234229

namespace FlowerShop
{
    /// <summary>
    /// A page that displays an overview of a single group, including a preview of the items
    /// within the group.
    /// </summary>
    public sealed partial class CartDetailPage : FlowerShop.Common.LayoutAwarePage
    {
        public CartDetailPage()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Populates the page with content passed during navigation.  Any saved state is also
        /// provided when recreating a page from a prior session.
        /// </summary>
        /// <param name="navigationParameter">The parameter value passed to
        /// <see cref="Frame.Navigate(Type, Object)"/> when this page was initially requested.
        /// </param>
        /// <param name="pageState">A dictionary of state preserved by this page during an earlier
        /// session.  This will be null the first time a page is visited.</param>
        protected override void LoadState(Object navigationParameter, Dictionary<String, Object> pageState)
        {
            // TODO: Assign a bindable group to this.DefaultViewModel["Group"]
            // TODO: Assign a collection of bindable items to this.DefaultViewModel["Items"]
            var cart = SampleDataSource.GetCart();
            this.DefaultViewModel["Group"] = cart;
            this.DefaultViewModel["Items"] = cart.Items;
        }

        private void submitOrder_Click(object sender, RoutedEventArgs e)
        {
            SampleDataSource.SaveCart();
        }

        private void cancelOrder_Click(object sender, RoutedEventArgs e)
        {

        }

        private void itemListView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            bottomAppBar.IsOpen = true;
        }

        private void removeFromCart_Click(object sender, RoutedEventArgs e)
        {
            foreach (var item in itemGridView.SelectedItems)
            {
                var cartItem = item as SampleCartItem;
                SampleDataSource.RemoveFromCart(cartItem.Item);
            }
            bottomAppBar.IsOpen = false;
        }
    }
}
