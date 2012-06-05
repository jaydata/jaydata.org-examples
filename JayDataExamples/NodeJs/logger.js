var $data = require('jaydata');
var url = require('url');
var http = require('http');
var url = require('url');
var qs = require('querystring');

var port = parseInt(process.argv[2]) || 12345;

$data.Class.define('$logger.Types.Request', $data.Entity, null, {
    Id: { type: 'int', key: true, computed: true },
    URL: { type: 'string' },
    Method: { type: 'string' },
    IPAddress: { type: 'string' },
    UserAgent: { type: 'string' },
    Headers: { type: 'Array', elementType: '$logger.Types.HTTPHeader', inverseProperty: 'Request' }
});

$data.Class.define('$logger.Types.HTTPHeader', $data.Entity, null, {
    Id: { type: 'int', key: true, computed: true },
    Key: { type: 'string' },
    Value: { type: 'string' },
    Request: { type: '$logger.Types.Request', inverseProperty: 'Headers', required: true }
});

$data.Class.define("$logger.Types.LoggerContext", $data.EntityContext, null, {
    Requests: { type: $data.EntitySet, elementType: $logger.Types.Request },
    HTTPHeaders: { type: $data.EntitySet, elementType: $logger.Types.HTTPHeader }
});

$logger.context = new $logger.Types.LoggerContext({ name: 'sqLite', databaseName: 'logger', dbCreation: $data.storageProviders.sqLite.DbCreationType.Default });
$logger.context.onReady(function(db){
    http.createServer(function(req, res){
        var r = new $logger.Types.Request({
            URL: req.url,
            Method: req.method.toUpperCase(),
            IPAddress: req.client.remoteAddress + ':' + req.client.remotePort,
            UserAgent: req.headers['user-agent']
        });
        
        $logger.context.Requests.add(r);

        for (var i in req.headers){
            var v = req.headers[i];
            if (typeof v == 'string'){
                $logger.context.HTTPHeaders.add(new $logger.Types.HTTPHeader({
                    Key: i,
                    Value: v,
                    Request: r
                }));
            }
        }
        
        $logger.context.saveChanges(function(){
            var q = qs.parse(url.parse(req.url).query);
            
            if (q.query){
                var query = $logger.context.Requests;
                
                if (q.url){
                    query = query.filter(function(item){ return item.URL.contains(this.url); }, { url: q.url });
                }
                if (q.method){
                    query = query.filter(function(item){ return item.Method === this.method; }, { method: q.method });
                }
                if (q.ipaddress){
                    query = query.filter(function(item){ return item.IPAddress.contains(this.ipaddress); }, { ipaddress: q.ipaddress });
                }
                if (q.useragent){
                    query = query.filter(function(item){ return item.UserAgent.contains(this.useragent); }, { useragent: q.useragent });
                }
                if (q.orderby){
                    switch (q.orderby.toLowerCase()){
                        case 'url': query = query.orderBy('it.URL'); break;
                        case 'method': query = query.orderBy('it.Method'); break;
                        case 'ipaddress': query = query.orderBy('it.IPAddress'); break;
                        case 'useragent': query = query.orderBy('it.UserAgent'); break;
                        default:
                            break;
                    }l
                }else if (q.orderbydesc){
                    switch (q.orderbydesc.toLowerCase()){
                        case 'url': query = query.orderByDescending('it.URL'); break;
                        case 'method': query = query.orderByDescending('it.Method'); break;
                        case 'ipaddress': query = query.orderByDescending('it.IPAddress'); break;
                        case 'useragent': query = query.orderByDescending('it.UserAgent'); break;
                        default:
                            break;
                    }
                }
                
                query
                .map(function(item){
                    return {
                        Id: item.Id,
                        URL: item.URL,
                        Method: item.Method,
                        IPAddress: item.IPAddress,
                        UserAgent: item.UserAgent
                    };
                })
                .toArray(function(result){
                    var requests = result;
                    var response = [];
                    var ids = result.map(function(item){ return item.Id; });
                     
                    $logger.context.HTTPHeaders
                    .filter(function(item){ return item.Request.Id in this.ids; }, { ids: ids })
                    .map(function(item){
                        return {
                            Key: item.Key,
                            Value: item.Value,
                            RequestId: item.Request.Id
                        };
                    })
                    .toArray(function(result){
                        for (var i = 0; i < result.length; i++){
                            var r = null;
                            for (var j = 0; j < requests.length; j++){
                                if (requests[j].Id == result[i].RequestId){
                                    r = requests[j];
                                    break;
                                }
                            }
                            if (!r.Headers) r.Headers = [];
                            r.Headers.push({
                                Key: result[i].Key,
                                Value: result[i].Value
                            });
                        }
                        
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.write(JSON.stringify(requests));
                        res.end();
                    });
                });
            }else{
                res.writeHead(200);
                res.end();
            }
        });
    }).listen(port);
});