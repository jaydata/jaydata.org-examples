
function getRemoteNorthwind() {
    return $data.initService("/examples/Northwind.svc")
    .then(function (m, f, t) {
        return m;
    });
}

function getLocalNorthwind() {
    return $data.initService("/examples/Northwind.svc")
    .then(function (m, f, t) {

        var localDB = new t({ name: 'local', databaseName: 'nw' });
        var remoteDB = f();

        function resetLocal() {
            var categories = localDB.Categories.toArray();
            var products = localDB.Products.toArray();
            return $.when(categories, products)
                    .then(function (categories, products) {
                        categories.forEach(function (c) { localDB.Categories.remove(c); });
                        products.forEach(function (p) { localDB.Products.remove(p); });
                        return localDB.saveChanges();
                    });
        }

        function sync() {
            var categories = remoteDB.Categories.toArray();
            var products = remoteDB.Products.toArray();
            return $.when(categories, products)
                    .then(function (categories, products) {
                        localDB.Categories.addMany(categories);
                        localDB.Products.addMany(products);
                        return localDB.saveChanges();
                    })
                    .fail(function (reason) {
                        console.log(reason);
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
