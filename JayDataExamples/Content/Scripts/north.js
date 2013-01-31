function getLocalNorthwind() {
    return $data.initService("Northwind.svc")
    .then(function (m, f, t) {
        var localDB = new t({ name: 'local', databaseName: 'nw' });
        var remoteDB = f();

        function resetLocal() {
            var suppliers = localDB.Suppliers.toArray();
            var categories = localDB.Categories.toArray();
            var products = localDB.Products.toArray();
            var orders = localDB.Orders.toArray();
            return $.when(suppliers, categories, products)
                    .then(function (suppliers, categories, products, orders) {
                        suppliers.forEach(function (s) { localDB.Suppliers.remove(s); });
                        categories.forEach(function (c) { localDB.Categories.remove(c); });
                        products.forEach(function (p) { localDB.Products.remove(p); });
                        orders.forEach(function (o) { localDB.Orders.remove(o); });
                        return localDB.saveChanges();
                    });
        }

        function sync() {
            var suppliers = remoteDB.Suppliers.toArray();
            var categories = remoteDB.Categories.toArray();
            var products = remoteDB.Products.toArray();
            var orders = localDB.Orders.toArray();
            return $.when(suppliers, categories, products, orders)
                    .then(function (suppliers, categories, products) {
                        localDB.addMany(suppliers);
                        localDB.addMany(categories);
                        localDB.addMany(products);
                        localDB.addMany(orders);
                        return localDB.saveChanges();
                    });
        }

        return $.when(remoteDB.onReady(), localDB.onReady())
        .then(resetLocal)
        .then(sync)
        .then(function () {
            return localDB;
        });
    });
}
