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

    var ejs = require('ejs'); //More info: http://embeddedjs.com/
    var nodemailer = require("nodemailer");
    var MailTemplate =
        "Customer name: <%= Name %> <br />\
        Customer address: <%= Address %> <br />\
        <ul>\
        <% for(var i=0; i<Flowers.length; i++) {%> \
           <li><%= Flowers[i].Amount %> pc of <%= Flowers[i].Name %>: - $<%= Flowers[i].Price %></li> \
        <% } %> \
        </ul> \
        Total: $<%= Total %>"

    function NotifyByEmail(context, customer, orderItems) {

        //collect the IDs of all the products in the order
        var product_Ids = orderItems.map(function (order) { return order.Product_ID; });

        //select all the ordered flowers (products) from the database 
        context.Flowers
            .filter(function (f) { return f.id in this.ids; }, { ids: product_Ids })
            .toArray(function (flowers) {

                //build the object to fill the placeholders in the template 
                var flowersToMail = [];
                var total = 0;
                flowers.forEach(function (flower) {
                    var order = orderItems.filter(function (order) { return order.Product_ID === flower.id; })[0];
                    flowersToMail.push({ Name: flower.Name, Price: flower.Price, Amount: order.Amount });

                    total += flower.Price * order.Amount;
                });

                //render the e-mail body with ejs
                var body = ejs.render(MailTemplate, {
                    Name: customer.Name,
                    Address: customer.Address,
                    Flowers: flowersToMail,
                    Total: total
                });

                // create reusable transport method (opens pool of SMTP connections)
                var smtpTransport = nodemailer.createTransport("SMTP", {
                    host: 'YOUR SMTP SERVER',
                    port: 25,
                    secureConnection: true,
                    auth: {
                        user: "YOUR SMTP USER",
                        pass: "YOUR SMTP PASS"
                    }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: "YOUR EMAIL ADDRESS", // sender address
                    to: "THE EMAIL RECIPIENT", 
                    subject: "New order", // Subject line
                    html: body // html body rendered by ejs
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function (err, res) {
                    smtpTransport.close(); // shut down the connection pool, no more messages
                });
            });
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

                                      NotifyByEmail(mydatabase, customer, orderData.OrderItems);
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
