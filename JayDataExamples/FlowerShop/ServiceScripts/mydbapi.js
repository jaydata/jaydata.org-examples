// paste this code as "Source" for the mydatabase Data Service in your JayStorm app
// https://admin.jaystack.com
// In case you don't have a JayStorm PaaS app, read the following article: 
// http://jaystack.com/blog/jaystorm-open–starting-point

exports = module.exports = function (type) {
    "use strict";
    function checkPerm(access, user, entitysets, callback) {
        var pHandler = new $data.PromiseHandler();
        var clbWrapper = pHandler.createCallback(callback);
        var pHandlerResult = pHandler.getPromise();
        clbWrapper.success(true);
        return pHandlerResult;
    }


    var ret = type.extend('mydatabase.dbAPI', {
        placeOrder: function (orderData) {
            ///<param name='orderData' type='Object' />
            ///<returns type='Object' />   
            try {
                var mydatabase = this.executionContext.request.databases.mydatabase({ checkPermission: checkPerm });
                return function (success, error) {
                    var customer = mydatabase.Customers.add({
                        Name: orderData.Name,
                        Address: orderData.Address
                    });
                    mydatabase.saveChanges(
                      function () {
                          //when new customer is added, add a new order
                          var order = mydatabase.Orders.add({
                              Customer_ID: customer.id,
                              OrderDate: new Date(),
                              OrderState: 1 //order is in "create" state
                          });
                          mydatabase.saveChanges(function () {
                              //when the new order is created add order items
                              orderData.OrderItems.forEach(function (item) {
                                  item.Order_ID = order.id;
                                  mydatabase.OrderItems.add(item);
                              });
                              mydatabase.saveChanges(function () {
                                  //when OrderItems are inserted modify OrderState to 2 ("ready")
                                  mydatabase.attach(order);
                                  order.OrderState = 2;
                                  mydatabase.saveChanges(function () {
                                      orderData.Order_ID = order.id;
                                      orderData.Customer_ID = customer.id;
                                      success(orderData);
                                  });
                              });
                          });
                      });
                };
            } catch (err) {
                return { err: err.message };
            }
        }
    });
    ret.annotateFromVSDoc();
    return ret;
};