function toggleLogoFilter() {
    $(".logo-filter").toggleClass("open");
    $(".filter-icon").find(".z-up").toggleClass("hidden");
    $(".filter-icon").find(".z-down").toggleClass("hidden");
}

$(document).on("click", ".main-content", function (e) {
    if ($(".logo-filter").hasClass("open")) {
        toggleLogoFilter();
    }
});

$(".filter-icon").live('click', function (e) {
    e.preventDefault();
    toggleLogoFilter();
});