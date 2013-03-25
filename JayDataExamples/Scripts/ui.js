$(".tags-inline .tags .icon-remove").live('click', function () {
    $(this).parent(".label").parent("li").remove();
    console.log("do tag de-filtering here..");
});

$(".well-white .tags .label").live('click', function () {
    console.log("do tag filtering here..");

    $(".tags-inline .tags").append("<li><a class='label label-purple' href='javascript:void(0)'>" + this.innerHTML + "<i class='icon-remove'></i></a></li>");
});

$(".filter-icon").live('click', function (e) {
    e.preventDefault();

    $(".logo-filter").toggleClass("open");

    $(this).find(".z-up").toggleClass("hidden");
    $(this).find(".z-down").toggleClass("hidden");
});