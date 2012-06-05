$data.Queryable.prototype.toTemplate = $data.Queryable.prototype.tojQueryTemplate;
$data.EntitySet.prototype.toTemplate = $data.EntitySet.prototype.tojQueryTemplate;

﻿$data.Class.define("$news.AppClass", null, null, {
	categoryFilter: { dataType: 'string', value: '' },
	tagFilter: { dataType: 'string', value: '' },
	articleFilter: { dataType: 'string', value: '' },
	filterCategory: function(){
        var v = document.getElementById('categoryFilter').value;
        if ($news.App.categoryFilter != v){
            $news.App.categoryFilter = v;
		    document.querySelector('#categories table tbody').innerHTML = '';
		    $news.App.loadCategories();
		}
    },
    filterArticle: function(){
        var v = document.getElementById('articleFilter').value;
        if ($news.App.articleFilter != v){
            $news.App.articleFilter = v;
		    document.querySelector('#articles ul').innerHTML = '';
		    $news.App.loadArticles();
		}
    },
	filterTags: function(){
	    var v = document.getElementById('tagFilter').value;
	    if ($news.App.tagFilter != v){
		    $news.App.tagFilter = document.getElementById('tagFilter').value;
		    document.querySelector('#tags ul').innerHTML = '';
		    $news.App.loadTags();
		}
	},
	clearCategoryFilter: function(){
	    var el = document.getElementById('categoryFilter');
	    if (el.value.length){
	        el.value = '';
	        $news.App.categoryFilter = '';
	        document.querySelector('#categories table tbody').innerHTML = '';
		    $news.App.loadCategories();
	    }
	},
	clearTagFilter: function(){
	    var el = document.getElementById('tagFilter');
	    if (el.value.length){
	        el.value = '';
	        $news.App.tagFilter = '';
	        document.querySelector('#tags ul').innerHTML = '';
		    $news.App.loadTags();
	    }
	},
	clearArticleFilter: function(){
	    var el = document.getElementById('articleFilter');
	    if (el.value.length){
	        el.value = '';
	        $news.App.articleFilter = '';
	        document.querySelector('#articles ul').innerHTML = '';
		    $news.App.loadArticles();
	    }
	},
    loadCategories: function(){
		var tbl = document.querySelector('#categories table tbody');
        tbl.innerHTML = '';
		var query = $news.context.Categories;

		if ($news.App.categoryFilter.length){
			query = query.filter(function(item){ return item.Title.startsWith($news.App.categoryFilter); });
		}

		query
		.orderBy(function(item){ return item.Title; })
		.toTemplate('category-tr-item', tbl);
    },
    loadTags: function(){
        var ul = document.querySelector('#tags ul');
        ul.innerHTML = '';
        var query = $news.context.Tags;

        if ($news.App.tagFilter.length){
            query = query.filter(function(item){ return item.Title.contains($news.App.tagFilter); });
        }

        query
        .map(function(item){ return { Id: item.Id, Title: item.Title }})
        .orderBy(function(item){ return item.Title; })
        .toTemplate('tag-list-item', ul);
    },
    loadArticles: function(id, type){
        $news.App.activateItem();
        var ul = document.querySelector('#articles ul');
        ul.innerHTML = '';
        
        var query = $news.context.Articles;

        if (type == 'Category') query = query.filter(function(item){ return item.Category.Id == this.id; }, { id: id });
        else if (type == 'Author') query = query.filter(function(item){ return item.Author.Id == this.id; }, { id: id });

        switch(type){
            case 'Category':
            case 'Author':
                query = query.map(function (item){ return { Id: item.Id, Title: item.Title }; });
                break;
            case 'Tags':
                query = $news.context.TagConnections
                    .filter(function(item){ return item.Tag.Id == this.id; }, { id: id })
                    .map(function (item){ return { Id: item.Article.Id, Title: item.Article.Title }; });
                break;
            default:
                if ($news.App.articleFilter) query = query.filter(function(item){ return item.Title.contains($news.App.articleFilter); });
                query = query.map(function (item){ return { Id: item.Id, Title: item.Title }; });
                break;
        }

        query.toTemplate('article-list-item', ul);
    },
    showArticle: function(id){
        $news.App.activateItem();
        document.getElementById('article').className = 'active';
        var a = document.querySelector('#article .content');
        a.innerHTML = '';
        
        $news.context.Articles
        .filter(function(item){ return item.Id == this.id }, { id: id })
        .map(function(item){
            return {
                Id: item.Id,
                Title: item.Title,
                Lead: item.Lead,
                Body: item.Body,
                CreateDate: item.CreateDate
            };
        })
        .toTemplate('article-content', a, null, function(result){
            var id = result[0].Id;

            $news.context.TagConnections
            .filter(function(item){ return item.Article.Id == this.id; }, { id: id })
            .map(function(item){ return { Id: item.Tag.Id, Title: item.Tag.Title }; })
            .orderBy(function(item){ return item.Tag.Title; })
            .toTemplate('article-tag-item', document.querySelector('#article ul.tags'));
        });
    },
    newArticle: function(){
        document.getElementById('article').className = 'active';
        var a = document.querySelector('#article .content');
        a.innerHTML = '';

        $.tmpl('article-edit-content', [{
            Title: '',
            Lead: '',
            Body: ''
        }], {
            Action: 'New'
        }).appendTo($(a));

        $('#article-edit-body').wysihtml5();

        $news.context.Categories
        .orderBy(function(item){ return item.Title; })
        .toTemplate('article-category-item', document.querySelector('#article-edit-category'), { CategoryId: -1 });
    },
    editArticle: function(id){
        document.getElementById('article').className = '';
        setTimeout(function(){
            document.getElementById('article').className = 'active';
            var a = document.querySelector('#article .content');
            a.innerHTML = '';
            
            $news.context.Articles
            .filter(function(item){ return item.Id == this.id; }, { id: id })
            .map(function(item){
                return {
                    Id: item.Id,
                    Category: item.Category,
                    Title: item.Title,
                    Lead: item.Lead,
                    Body: item.Body,
                    CreateDate: item.CreateDate
                };
            })
            .toTemplate('article-edit-content', a, { Action: 'Edit' }, function(result){
                $('#article-edit-body').wysihtml5();

                $news.context.Categories
                .orderBy(function(item){ return item.Title; })
                .toTemplate('article-category-item', document.getElementById('article-edit-category'), { CategoryId: result[0].Category.Id });

                $news.context.TagConnections
                .filter(function(item){ return item.Article.Id == this.id; }, { id: result[0].Id })
                .map(function(item){ return item.Tag.Title; })
                .orderBy(function(item){ return item.Tag.Title; })
                .toArray(function(result){
                    var t = document.querySelector('#article .controls input.tags');
                    if (t) t.value = result.join(',');
                });
            });
        }, 500);
    },
    saveArticle: function(id){
        if (id){
            $news.context.Articles
            .filter(function(item){ return item.Id == this.id }, { id: id })
            .toArray(function(result){
                var articleEntity = result[0];
                $news.context.Articles.attach(articleEntity);

                articleEntity.Title = document.getElementById('article-edit-title').value;
                articleEntity.Lead = document.getElementById('article-edit-lead').value;
                articleEntity.Body = document.getElementById('article-edit-body').value;
                articleEntity.CreateDate = articleEntity.CreateDate || new Date();

                $news.context.saveChanges(function(){
                    $news.App.loadArticles();
                    $news.App.cancelEditArticle();
                    
                    var tags = document.getElementById('article-edit-tags').value.split(',');
                    $news.context.TagConnections
                    .filter(function(item){ return item.Article.Id == this.id; }, { id: articleEntity.Id })
                    .toArray(function(result){
                        for (var i = 0; i < result.length; i++){
                            $news.context.TagConnections.remove(result[i]);
                        }
                        
                        $news.context.saveChanges(function(){
                            $news.context.Tags
                            .filter(function(item){ return item.Title in this.tags; }, { tags: tags })
                            .toArray(function(result){
                                var existing = [];
                                for (var i = 0; i < result.length; i++){
                                    existing.push(result[i].Title);
                                }
                                for (var i = 0; i < tags.length; i++){
                                    var t = tags[i];
                                    if (existing.indexOf(t) < 0){
                                        $news.context.TagConnections.add(new $news.Types.TagConnection({ Article: articleEntity, Tag: new $news.Types.Tag({ Title: t }) }));
                                    }else{
                                        $news.context.TagConnections.add(new $news.Types.TagConnection({ Article: articleEntity, Tag: result[i] }));
                                    }
                                }
                                    
                                $news.context.saveChanges(function(){
                                    $news.context.TagConnections
                                    .map(function(item){ return item.Tag.Id; })
                                    .toArray(function(result){
                                        $news.context.Tags
                                        .filter(function(item){ return !(item.Id in this.tags); }, { tags: result })
                                        .toArray(function(result){
                                            for (var i = 0; i < result.length; i++){
                                                $news.context.Tags.remove(result[i]);
                                            }

                                            $news.context.saveChanges(function(){
                                                $news.App.loadTags();
                                            });
                                        });
                                    });

                                    $news.App.articleFilter = document.getElementById('articleFilter').value = articleEntity.Title;
                                    $news.App.loadArticles();
                                    $news.App.loadTags();
                                });
                            });
                        });
                    });
                });
            });
        }else{
            $news.context.Categories
            .filter(function(item){ return item.Id == this.id; }, { id: parseInt(document.getElementById('article-edit-category').value) })
            .toArray(function(result){
                var category = result[0];
                var articleEntity = new $news.Types.Article({
                    Title: document.getElementById('article-edit-title').value,
                    Lead: document.getElementById('article-edit-lead').value,
                    Body: document.getElementById('article-edit-body').value,
                    Category: category
                });
                $news.context.Articles.add(articleEntity);
                $news.context.saveChanges(function(){
                    $news.App.loadArticles(category.Id, 'Category');
                    $news.App.cancelEditArticle();

                    var tags = document.getElementById('article-edit-tags').value.split(',');
                    $news.context.Tags
                    .filter(function(item){ return item.Title in this.tags; }, { tags: tags })
                    .toArray(function(result){
                        var existing = [];
                        for (var i = 0; i < result.length; i++){
                            existing.push(result[i].Title);
                        }
                        for (var i = 0; i < tags.length; i++){
                            var t = tags[i];
                            if (existing.indexOf(t) < 0){
                                $news.context.TagConnections.add(new $news.Types.TagConnection({ Article: articleEntity, Tag: new $news.Types.Tag({ Title: t }) }));
                            }else{
                                $news.context.TagConnections.add(new $news.Types.TagConnection({ Article: articleEntity, Tag: result[i] }));
                            }
                        }
                                    
                        $news.context.saveChanges(function(){
                            $news.context.TagConnections
                            .map(function(item){ return item.Tag.Id; })
                            .toArray(function(result){
                                $news.context.Tags
                                .filter(function(item){ return !(item.Id in this.tags); }, { tags: result })
                                .toArray(function(result){
                                    for (var i = 0; i < result.length; i++){
                                        $news.context.Tags.remove(result[i]);
                                    }

                                    $news.context.saveChanges(function(){
                                        $news.App.loadTags();
                                    });
                                });
                            });

                            $news.App.articleFilter = document.getElementById('articleFilter').value = articleEntity.Title;
                            $news.App.loadArticles();
                            $news.App.loadTags();
                        });
                    });
                });
            });
        }
    },
    deleteArticle: function(id, title){
        if (confirm('Do you really want to delete the article titled "' + title + '"?')){
            $news.context.TagConnections
            .filter(function(item){ return item.Article.Id == this.id; }, { id: id })
            .toArray(function(result){
                for (var i = 0; i < result.length; i++){
                    $news.context.TagConnections.remove(result[i]);
                }
                $news.context.saveChanges(function(){
                    $news.context.Articles
                    .filter(function(item){ return item.Id == this.id; }, { id: id })
                    .toArray(function(result){
                        $news.context.Articles.remove(result[0]);
                        $news.context.saveChanges(function(){
                            $news.App.loadArticles();
                            $news.App.backArticle();

                            $news.context.TagConnections
                            .map(function(item){ return item.Tag.Id; })
                            .toArray(function(result){
                                $news.context.Tags
                                .filter(function(item){ return !(item.Id in this.tags); }, { tags: result })
                                .toArray(function(result){
                                    for (var i = 0; i < result.length; i++){
                                        $news.context.Tags.remove(result[i]);
                                    }

                                    $news.context.saveChanges(function(){
										$news.App.loadTags();
									});
                                });
                            });
                        });
                    });
                });
            });
        }
    },
    cancelEditArticle: function(id){
        var li = document.querySelector('li.active');
        if (li) li.className = '';
        document.getElementById('article').className = '';

        if (id) setTimeout(function(){ $news.App.showArticle(id); }, 500);
    },
    backArticle: function(){
        var li = document.querySelector('li.active');
        if (li) li.className = '';
        document.getElementById('article').className = '';
    },
    newCategory: function(){
        var category = new $news.Types.Category({ Title: '<unknown>' });
        $news.context.Categories.add(category);
        $news.context.saveChanges(function(){
            var tbl = document.querySelector('#categories table tbody');
            $(tbl).prepend($.tmpl('category-tr-new-item', category));
        });
    },
    editCategory: function(id, title, subtitle, description){
        var tr = document.getElementById('category-tr-' + id);
        if (tr){
            tr.style.display = 'none';
            $(tr).after(
                $.tmpl('category-tr-edit-item', {
                    Id: id,
                    Title: title,
                    Subtitle: subtitle,
                    Description: description
                })
            );
        }
    },
    deleteCategory: function(id, title){
        $news.context.Articles
        .filter(function(item){ return item.Category.Id == this.id; }, { id: id })
        .toArray(function(result){
            if (result.length){
                alert('The "' + title + '" category contains articles!');
            }else{
                $news.context.Categories
                .filter(function(item){ return item.Id == this.id; }, { id: id })
                .toArray(function(result){
                    if (result.length){
                        $news.context.Categories.remove(result[0]);
                    
                        $news.context.saveChanges(function(count){
                            if (count){
                                tr = document.getElementById('category-tr-' + id);
                                if (tr) tr.parentNode.removeChild(tr);
                            }
                        });
                    }
                });
            }
        });
    },
    saveCategory: function(id){
        $news.context.Categories
        .filter(function(item){ return item.Id == this.id; }, { id: id })
        .toArray(function(result){
            if (result.length){
                var save = result[0];
                $news.context.Categories.attach(save);

                save.Title = document.querySelector('#category-tr-edit-' + id + ' #title').value;
                save.Subtitle = document.querySelector('#category-tr-edit-' + id + ' #subtitle').value;
                save.Description = document.querySelector('#category-tr-edit-' + id + ' #description').value;

                $news.context.saveChanges(function(count){
                    var tr = document.getElementById('category-tr-' + id) || document.getElementById('category-tr-edit-' + id);
                    if (tr) $(tr).replaceWith($.tmpl('category-tr-item', save));

                    $news.App.cancelEditCategory(id);
                });
            }
        });
    },
    cancelEditCategory: function(id){
        var tr = document.getElementById('category-tr-edit-' + id);
        if (tr) tr.parentNode.removeChild(tr);

        tr = document.getElementById('category-tr-' + id);
        if (tr) tr.style.display = '';
    },
    activateItem: function(){
        if (e = window.event){
            var li = document.querySelector('li.active, td.active');
            if (li) li.className = '';
            if (e.srcElement && e.srcElement.parentNode) e.srcElement.parentNode.className = 'active';
        }
    }
}, null);

$(document).ready(function () {
    $news.context = new $news.Types.NewsContext({
        name: "oData",
        oDataServiceHost: "newsReader.svc",
        databaseName: "NewsReader",
        dbCreation: $data.storageProviders.sqLite.DbCreationType.DropAllExistingTables
    });

    var tmpls = document.querySelectorAll('script[type="template"]');
    for (var i = 0; i < tmpls.length; i++){
        var t = tmpls[i];
        $(t).template(t.id);
    }
    
    $news.context.onReady(function (db) {
        $news.App = new $news.AppClass();
        
        $news.App.loadCategories();
        $news.App.loadTags();
        $news.App.loadArticles();
    });
});