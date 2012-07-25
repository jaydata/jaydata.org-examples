$(function () {
    $data.Class.define("$todo.Types.ToDoEntry", $data.Entity, null, {
        Id: { type: "int", key: true, computed: true },
        Subject: { type: "string" },
        Details: { type: "string" },
        Repeat: { type: "string" },
        StartAt: { type: "datetime" },
        EndAt: { type: "datetime" },
        Reminders: { type: "Array", elementType: "$todo.Types.Reminder", inverseProperty: "ToDo" }
    });

    $data.Class.define("$todo.Types.Reminder", $data.Entity, null, {
        Id: { type: "int", key: true, computed: true },
        AlarmAt: { type: "datetime" },
        AlarmTone: { type: "string" },
        ToDo: { type: "$todo.Types.ToDoEntry", inverseProperty: "Reminders" }
    });

    $data.Class.define("$todo.Types.ToDoListContext", $data.EntityContext, null, {
        ToDoEntries: { type: $data.EntitySet, elementType: $todo.Types.ToDoEntry },
        Reminders: { type: $data.EntitySet, elementType: $todo.Types.Reminder }
    });

    function createContext(options, readyCallback) {
        $todo.Context = new $todo.Types.ToDoListContext(options);
        $todo.Context.onReady(function (db) {
            seed(db, readyCallback);
        });
    }

    function seed(db, readyCallback) {
        db.ToDoEntries.length(function (count) {
            if (count > 0) {
                readyCallback(db);
                return;
            }

            var dataSet = [
                new $todo.Types.ToDoEntry({
                    Subject: "Refactoring", Details: "Apply camelCasing to Scripts/order.js", StartAt: new Date(2012, 6, 1, 8), EndAt: new Date(2012, 6, 1, 8, 30), Repeat: 'Once',
                    Reminders: [
                        new $todo.Types.Reminder({ AlarmAt: new Date(2012, 6, 1, 7), AlarmTone: 'Ring' })
                    ]
                }),
                new $todo.Types.ToDoEntry({
                    Subject: "Call mom", Details: "say: Happy birthday", StartAt: new Date(2012, 6, 3), EndAt: new Date(2012, 6, 3), Repeat: 'Yearly',
                    Reminders: [
                        new $todo.Types.Reminder({ AlarmAt: new Date(2012, 5, 25, 12), AlarmTone: 'Ring' }),
                        new $todo.Types.Reminder({ AlarmAt: new Date(2012, 6, 2, 12), AlarmTone: 'Ring' }),
                        new $todo.Types.Reminder({ AlarmAt: new Date(2012, 6, 3, 12), AlarmTone: 'Ring' })
                    ]
                })
            ];

            for (var i = 0; i < dataSet.length; i++) {
                db.ToDoEntries.add(dataSet[i]);
            }

            db.saveChanges(function () {
                readyCallback(db);
            });
        });
    }


    function addPageConstraints(query, page, rowsPerPage) {
        return query
            .skip((page - 1) * rowsPerPage)
            .take(rowsPerPage);
    }

    function addSortOrder(query, fieldName, sortOrder) {
        if (fieldName != '') {
            if (sortOrder == 'desc') {
                query = query.orderByDescending('it.' + fieldName);
            }
            else {
                query = query.orderBy('it.' + fieldName);
            }
        }
        return query;
    }

    function setTableData(grid, query, postData, ui) {
        var rowsPerPage = postData.rows;
        var result = {
            page: postData.page
        };

        $(grid).jqGrid("clearGridData");
        $("#" + ui).show(); // show Loading...

        function setJson() {
            grid.addJSONData(result);
            $("#" + ui).hide(); // hide Loading...
        }

        query.length(function (count) {
            result.total = Math.ceil(count / rowsPerPage);
            result.records = count;

            if (result.rows !== undefined) {
                setJson();
            }
        });

        query = addSortOrder(query, postData.sidx, postData.sord);
        query = addPageConstraints(query, postData.page, postData.rows);
        query.toArray(function (array) {
            result.rows = array;

            if (result.total !== undefined) {
                setJson();
            }
        });
    }

    function defineGrid() {
        $("#todoGrid").jqGrid({
            caption: "ToDo List",

            colNames: ["Subject", "Details", "Start at", "End at", "Repeat"],
            colModel: [
                { name: 'Subject', index: 'Subject' },
   		        { name: 'Details', index: 'Details' },
                { name: 'StartAt', index: 'StartAt' },
                { name: 'EndAt', index: 'EndAt' },
                { name: "Repeat", index: "Repeat" }
            ],

            datatype: function (postData, ui) {
                setTableData($("#todoGrid")[0], $todo.Context.ToDoEntries, postData, ui);
            },
            subGrid: true,
            subGridRowExpanded: function (subgridId, rowId) {
                var subgridTableId = subgridId + "_t";
                var pagerId = "p_" + subgridTableId;
                $("#" + subgridId).html("<table id=\"" + subgridTableId + "\"></table><div id=\"" + pagerId + "\"></div>");

                var subgrid = $("#" + subgridTableId);
                subgrid.jqGrid({
                    colNames: ["Alarm at", "Alarm tone"],
                    colModel: [
                        { name: 'AlarmAt', index: 'AlarmAt' },
                        { name: 'AlarmTone', index: 'AlarmTone' }
                    ],

                    datatype: function (postData, ui) {
                        var query = $todo.Context.Reminders
                            .where(function (m) { return m.ToDo.Id == this.rowId }, { rowId: parseInt(rowId) });
                        setTableData(subgrid[0], query, postData, ui);
                    },
                    jsonReader: {
                        repeatitems: false,
                        id: "Id"
                    },

                    rowNum: 2,
                    sortname: 'AlarmAt',

                    pager: "#" + pagerId,
                    viewrecords: true
                });
            },
            subGridRowColapsed: function (subgridId, rowId) {
                var subgridTableId = subgridId + "_t";
                $("#" + subgridTableId).remove();
            },
            jsonReader: {
                repeatitems: false,
                id: "Id"
            },

            rowNum: 3,
            sortname: 'StartAt',
            sortorder: 'desc',

            pager: "#todoNavGrid",
            viewrecords: true
        });
    };



    $('#btnOData').click(function () {
        var options = { name: "oData", oDataServiceHost: "Services/ToDoListService.svc" };

        createContext(options, defineGrid);
    });

    $('#btnSqlite').click(function () {
        var options = { name: "sqLite", databaseName: "ToDoList", dbCreation: $data.storageProviders.DbCreationType.DropAllExistsTables };

        createContext(options, defineGrid);
    });
});