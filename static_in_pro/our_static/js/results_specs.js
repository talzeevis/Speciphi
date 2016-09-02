/**

 */

$(document).ready(function(){
    // Menu Type Buttons
    $('#specs-btn').on('click',function () {
        $('#filters-menu fieldset').slice(3,6).fadeOut(150, function () {
            $('#filters-menu fieldset').slice(6).fadeIn(150);
            $('#filters-menu fieldset').slice(6).css('display', 'inline-block');
        });
    });
    $('#needs-btn').on('click',function () {
        $('#filters-menu fieldset').slice(6).fadeOut(150, function () {
            $('#filters-menu fieldset').slice(3,6).fadeIn(150);
        });
    });
    // Mobile Filter Button
    var direction;
    var filters_menu = $('#filters-menu');
    var filters_button = document.getElementById('filters-btn');
    var filter_button_jq = $('#filters-btn');
    var mc_filters = new Hammer(filters_button);
    mc_filters.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    mc_filters.on("panleft panright panup pandown tap press panend", function(ev) {
        console.log(ev);
        switch (ev.type) {
            case 'panleft':
                if (ev.center.x > 30){
                    filters_menu.width($(window).width()-ev.center.x);
                    filters_menu.css('left', String(ev.center.x)+'px');
                    filter_button_jq.css('left', String(ev.center.x)+'px');
                }
                direction = ev.type;
                break;
            case 'panright':
                if (ev.center.x / $(window).width() < 0.9){
                    filter_button_jq.css('left', String(ev.center.x)+'px');
                    filters_menu.width($(window).width()-ev.center.x);
                    filters_menu.css('left', String(ev.center.x)+'px');
                }else {
                    filters_menu.width($(window).width()-ev.center.x);
                    filters_menu.css('left', String(ev.center.x)+'px');
                }
                direction = ev.type;
                break;
            default:
                break;
        }
    });
    mc_filters.on("panstart panend", function(ev) {
        switch (ev.type) {
            case 'panend':
                if (direction == 'panleft'){
                    $(function () {
                        filter_button_jq.animate({
                            left: '15px'
                        }, { duration: 800, queue: false });
                        filters_menu.animate({
                            width: String($(window).width()-15)+'px',
                            left: '15px'
                        }, { duration: 800, queue: false });
                    });
                }
                else if (direction == 'panright'){
                    $(function () {
                        filter_button_jq.animate({
                            left: '96%'
                        }, { duration: 800, queue: false });
                        filters_menu.animate({
                            left: '100%'
                        }, { duration: 800, queue: false });
                    });
                }
                direction = ev.type;
                break;
            default:
                break;
        }
    });
    // Adjust filters button and menu on window resize
    var init_width = $(window).width();
    var cur_width;
    $(window).resize(function () {
        cur_width = $(this).width();
        if (cur_width != init_width){
            (cur_width <= 480) ? filter_button_jq.css('left', '94%') : filter_button_jq.css('left', '96%');
            if (window.matchMedia('(max-width: 767px)').matches) {
                filters_menu.css('left', '100%');
                filters_menu.width('130');
                $('#filters-menu fieldset').width('100%');
            } else if (window.matchMedia('(min-width: 768px)').matches){
                filters_menu.css('left', '0');
                filters_menu.width('');
                $('#filters-menu fieldset').width('100%');
            }

        }
    });
    // Ajax call on checkbox change
    $('#filters-menu .checkbox input').on('change', function () {
        // alert('ajax call on checkbox change');
    });
    // Price Slider Filter (jQuery UI)
    $(function() {
        $("#slider-range").slider({
            range: true,
            min: 200,
            max: 9500,
            values: [200, 9500],
            disabled: false,
            slide: function(event, ui){
                $("#slider-min").val("$" + ui.values[0]);
                $("#slider-max").val("$" + ui.values[1]);
            },
            stop: function(event, ui){
                // alert('Define ajax callback to get results');
            },
        });
        $("#slider-min").val("$"+$("#slider-range").slider("values", 0));
        $("#slider-max").val("$"+$("#slider-range").slider("values", 1));
    });
});


