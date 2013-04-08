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
        TodoEntries: { type: $data.EntitySet, elementType: $todo.Types.ToDoEntry, indices: [{ name: 'idx_Value', unique: true, keys: ['Value'] }] }
    });

    $('#providerSelection > :button').click(function (e) {
        var provider = e.target.value;
        var options = { name: provider, databaseName: 'todo_indices' }

        $("#providerSelection .btn").removeClass("btn-info");
        $(e.target).addClass("btn-info");

        loadContext(options);
    });

    $('#btnAdd').click(function () {
        var value = $('#txtNew').val();
        if (!value) return;
        var now = new Date();
        var entity = new $todo.Types.ToDoEntry({ Value: value, CreatedAt: now, ModifiedAt: now });
        $todo.context.TodoEntries.add(entity);
        $todo.context.saveChanges()
            .then(function (cnt) { updateView(); })
            .fail(function () { $todo.context.stateManager.reset(); alert("Error! Todo value is not unique!"); updateView(); });
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
        } else {
            $('#wrapper>div:not(#providerSelection)').hide();
        }
    }
    updateView();
});