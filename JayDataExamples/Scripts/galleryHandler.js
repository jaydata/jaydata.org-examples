$(document).ready(function () {
    if ($.fn.prettyPhoto !== undefined) {
        $(".pretty-gallery a").prettyPhoto({
            theme: 'dark_square', /*'pp_default', light_rounded / dark_rounded / light_square / dark_square / facebook */
            social_tools: '',
            slideshow: false,
            autoplay_slideshow: false
        });
    }
});