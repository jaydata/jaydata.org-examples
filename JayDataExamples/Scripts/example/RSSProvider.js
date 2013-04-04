$data.Entity.extend('$data.RSS.RSSItem', {
    Title: { type: 'string' },
    Description: { type: 'string' },
    Link: { type: 'string' },
    Guid: { type: 'string' },
    PubDate: { type: 'datetime' }
});

$data.EntityContext.extend('$data.RSS.RSSContext', {
    Items: { type: $data.EntitySet, elementType: $data.RSS.RSSItem }
});

$data.StorageProviderBase.extend('$data.StorageProviders.RSS.RSSProvider', {
    constructor: function(config, context){
        var provider = this;
        this.providerConfiguration = $data.typeSystem.extend({
            binder: {
                $type: $data.Array,
                $selector: 'xml:rss channel item',
                $item: {
                    $type: $data.RSS.RSSItem,
                    Title: { $selector: 'xml:title', $source: 'textContent' },
                    Description: { $selector: 'xml:description', $source: 'textContent' },
                    Link: { $selector: 'xml:link', $source: 'textContent' },
                    Guid: { $selector: 'xml:guid', $source: 'textContent' },
                    PubDate: { $selector: 'xml:pubDate', $source: 'textContent' }
                }
            }
        }, config);
        this.initializeStore = function(callback){
            callback = $data.typeSystem.createCallbackSetting(callback);
            callback.success(this.context);
        };
    },
    executeQuery: function(query, callback){
        var provider = this;
        if (this.providerConfiguration.url){
            $.ajax({
                url: this.providerConfiguration.url,
                success: function(data){
                    query.rawDataList = data;
                    query.modelBinderConfig = provider.providerConfiguration.binder;
                    callback.success(query);
                }
            });
        }else{
            
        }
    },
    supportedDataTypes: { value: [$data.Integer, $data.String, $data.Number, $data.Blob, $data.Boolean, $data.Date, $data.Array], writable: false },
    fieldConverter: {
        value: {
            fromDb: {
                '$data.Integer': function (number) { return number; },
                '$data.Number': function (number) { return number; },
                '$data.Date': function (dbData) { return dbData ? new Date(parseInt(dbData.substr(6))) : undefined; },
                '$data.String': function (text) { return text; },
                '$data.Boolean': function (bool) { return bool === 1 ? true : false; },
                '$data.Blob': function (blob) { return blob; }
            },
            toDb: {
                '$data.Integer': function (number) { return number; },
                '$data.Number': function (number) { return number % 1 == 0 ? number : number + 'm'; },
                '$data.Date': function (date) { return date ? "datetime'" + date.toISOString() + "'" : null; },
                '$data.String': function (text) { return "'" + text + "'"; },
                '$data.Boolean': function (bool) { return bool ? 'true' : 'false'; },
                '$data.Blob': function (blob) { return blob; }
            }
        }
    },
});

$data.StorageProviderBase.registerProvider("RSS", $data.StorageProviders.RSS.RSSProvider);
