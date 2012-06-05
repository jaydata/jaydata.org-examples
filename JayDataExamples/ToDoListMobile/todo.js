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


    $todo.context = new $todo.Types.ToDoContext({ name: 'webSql', databaseName: 'todo' });
    $todo.context.onReady({
        success: updateView,
        error: function () {
            $todo.context = null;
            updateView();
        }
    });

    $('#btnAdd').click(function () {
        var value = $('#txtNew').val();
        if (!value) return;
        var now = new Date();
        //JayData code begins here
        var entity = new $todo.Types.ToDoEntry({ Value: value, CreatedAt: now, ModifiedAt: now });
        $todo.context.TodoEntries.add(entity);
        $todo.context.saveChanges(updateView);
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