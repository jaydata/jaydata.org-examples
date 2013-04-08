/// <reference path="../Content/Scripts/JayData.js" />
$(function () {
    $data.Entity.extend('$todo.Types.ToDoEntry', {
        Id: { type: 'int', key: true, computed: true },
        Value: { type: 'string' },
        CreatedAt: { type: 'datetime' },
        ModifiedAt: { type: 'datetime' },
        Done: { type: 'bool' },
        CategoryId: { type: 'int' }
    });
    $data.Entity.extend('$todo.Types.CategoryEntry', {
        Id: { type: 'int', key: true, computed: true },
        Value: { type: 'string' }
    });
    $data.EntityContext.extend('$todo.Types.ToDoContext', {
        TodoEntries: { type: $data.EntitySet, elementType: $todo.Types.ToDoEntry, indices: [{ name: 'idx_Value', unique: true, keys: ['Value'] }] },
        CategoryEntries: { type: $data.EntitySet, elementType: $todo.Types.CategoryEntry }
    });

    $('#providerSelection > :button').click(function (e) {
        var provider = e.target.value;
        var options = { name: provider, databaseName: 'todo_complex' }

        $("#providerSelection .btn").removeClass("btn-info");
        $(e.target).addClass("btn-info");

        loadContext(options);
    });

    $('#btnAdd').click(function () {
        var value = $('#txtNew').val();
        var catText = $('#txtCat').val();
        if (!value) return;
        var now = new Date();
        //begin readonly transaction for check category
        $todo.context.beginTransaction(false, function (readTran) {
            $todo.context.CategoryEntries.filter("it.Value == this.txt", { txt: catText }).toArray({
                success: function (items) {
                    if (items.length == 0) {
                        //begin write transaction both EntitySet
                        $todo.context.beginTransaction(true, function (globalWriteTran) {
                            var category = new $todo.Types.CategoryEntry({ Value: catText });
                            $todo.context.CategoryEntries.add(category);
                            $todo.context.saveChanges({
                                success: function (cnt, innerTran) {
                                    console.log("New category id: ", category.Id);
                                    var entity = new $todo.Types.ToDoEntry({ Value: value, CategoryId: category.Id, CreatedAt: now, ModifiedAt: now });
                                    $todo.context.TodoEntries.add(entity);
                                    //now save ToDo entity with the same transaction which we used to save category
                                    $todo.context.saveChanges({
                                        success: function (cnt) { updateView(); },
                                        error: function () { $todo.context.stateManager.reset(); alert("ToDo save error! New category entry is rollback!") }
                                    },
                                    innerTran);
                                },
                                error: function () { $todo.context.stateManager.reset(); alert('Category save error!'); updateView(); }
                            }, globalWriteTran);
                        });
                    } else {
                        var cat = items[0];
                        //begin write transaction only TodoEntries so don't block reading from CategoryEntries
                        $todo.context.beginTransaction(['TodoEntries'],true,  function (writeTran) {
                            var entity = new $todo.Types.ToDoEntry({ Value: value, CategoryId: cat.Id, CreatedAt: now, ModifiedAt: now });
                            $todo.context.TodoEntries.add(entity);
                            $todo.context.saveChanges({
                                success: function (cnt, saveTran) { updateView(); },
                                error: function () { $todo.context.stateManager.reset(); alert("ToDo save error!"); updateView(); }
                            }, writeTran);
                        });

                    }
                },
                error: function () { alert('General error!'); }
            }, readTran);
        });
    });

    $('#btnClear').click(function () {
        $('#todoList > div').each(function () {
            var entity = $(this).data('entity');
            $todo.context.TodoEntries.remove(entity);
        });
        $todo.context.saveChanges(updateView);
    });

    $('#todoList').on('click', ':button', function (e) {
        var cmd = $(this).val();
        var entry = $(this).parent().data('entity');
        switch (cmd) {
            case 'undone':
            case 'done':
                $todo.context.TodoEntries.attach(entry);
                entry.Done = (cmd == 'done');
                break;
            case 'delete':
                $todo.context.TodoEntries.remove(entry);
                break;
        }
        $todo.context.saveChanges(updateView);
    });

    function loadContext(options) {
        $todo.context = new $todo.Types.ToDoContext(options);
        $todo.context.onReady({
            success: updateView,
            error: function () {
                $todo.context = null;
                updateView();
            }
        });
    }

    function updateView() {
        if ($todo.context) {
            $('#wrapper>div:not(#providerSelection)').show();
            $todo.context.TodoEntries.toArray(function (items) {
                $('#todoList').empty();
                items.forEach(function (entity) {
                    $('#todoEntryTemplate').tmpl(entity).data('entity', entity).appendTo('#todoList');
                });
            });
            $todo.context.CategoryEntries.toArray(function (items) {
                $('#categoryList').empty();
                items.forEach(function (entity) {
                    $('#categoryEntryTemplate').tmpl(entity).data('entity', entity).appendTo('#categoryList');
                });
            });
        } else {
            $('#wrapper>div:not(#providerSelection)').hide();
        }
    }
    updateView();
});