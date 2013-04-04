/// <reference path="../Content/Scripts/JayData.js" />
$(function () {
    $data.Entity.extend('$todo.Types.ToDoEntry', {
        Id: { type: 'int', key: true, computed: true },
        Value: { type: 'string' },
        CreatedAt: { type: 'datetime' },
        ModifiedAt: { type: 'datetime' },
        Done: { type: 'bool' }
    });
    $data.EntityContext.extend('$todo.Types.ToDoContext', {
        TodoEntries: { type: $data.EntitySet, elementType: $todo.Types.ToDoEntry }
    });

    $('#providerSelection > :button').click(function (e) {
        var provider = e.target.value;
        var options = { name: provider, databaseName: 'todo' }
        loadContext(options);
    });

    $('#btnAdd').click(function () {
        var value = $('#txtNew').val();
        var id = $('#txtId').val();
        if (!value) return;
        var now = new Date();
        var entity = new $todo.Types.ToDoEntry({ Value: value, CreatedAt: now, ModifiedAt: now });
        if (id !== "") {
            entity.Id = parseInt(id);
        }
        $todo.unCommitedItems.push(entity);
        updateView();
    });
    $('#btnCommit').click(function () {
        commit($todo.unCommitedItems.pop(), undefined);
    });
    $('#btnCommitTran').click(function () {
        $todo.context.beginTransaction(true, function (tran) {
            commit($todo.unCommitedItems.pop(), tran);
        });
    });
    $('#btnClear').click(function () {
        $('#todoList > div').each(function () {
            var entity = $(this).data('entity');
            $todo.context.TodoEntries.remove(entity);
        });
        $todo.isError = false;
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

    function commit(entity, transaction) {
        saveEntity(entity, transaction)
            .then(function (cnt, innerTran) {
                if ($todo.unCommitedItems.length > 0) {
                    commit($todo.unCommitedItems.pop(), undefined);
                } else {
                    $todo.isError = false;
                    updateView();
                }
            })
            .fail(function (innerTran) {
                $todo.unCommitedItems = [];
                $todo.isError = true;
                console.log("ERROR");
                updateView();
            });
    }

    function saveEntity(entity, transaction) {
        var def = new $.Deferred();
        $todo.context.TodoEntries.add(entity);
        $todo.context.saveChanges({
            success: function () { def.resolve(arguments) },
            error: function () { def.reject(arguments); }
        }, transaction);
        return def;
    }

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
        if ($todo.isError) {
            $('#error').show();
        } else {
            $('#error').hide();
        }
        if ($todo.context) {
            $('#wrapper>div:not(#providerSelection)').show();
            $todo.context.TodoEntries.toArray(function (items) {
                $('#todoList').empty();
                items.forEach(function (entity) {
                    console.log(entity._entityState);
                    $('#todoEntryTemplate').tmpl(entity).data('entity', entity).appendTo('#todoList');
                });
                $todo.unCommitedItems.forEach(function (entity) {
                    console.log(entity._entityState);
                    $('#todoTempEntryTemplate').tmpl(entity).data('entity', entity).appendTo('#todoList');
                });
            });
        } else {
            $('#wrapper>div:not(#providerSelection)').hide();
        }
    }
    $todo.unCommitedItems = $todo.unCommitedItems || [];
    updateView();
});