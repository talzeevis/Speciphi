var ajax_que = [];

// affiliation
$('#nl-type-field input').on('change', function () {
    AJAX_manager(this, 'affiliation_choosing', true);
});
// application
$('#nl-needs-field input').on('change', function () {
    AJAX_manager(this, 'use_ranking', true);
});
// focalization
$('#nl-questions-field input').on('change', function () {
    AJAX_manager(this, 'question_answering', true);
});
// info element
$('#info-elements button').on('click', function () {
    AJAX_userAction(this, 'advice_clicking');
});
// switch menu type
$('#menu-type-field input').on('change', function () {
    AJAX_userAction(this, 'menu_type_changing');
});
// open my specs
$('button#my-specs-btn').on('click', function () {
    AJAX_userAction(this, 'my_specs_viewing');
});
// close my specs
$('button#specs-close').on('click', function () {
    AJAX_userAction(this, 'my_specs_viewing');
});
// my specs share
$('div#share-icons-container button').on('click', function () {
    AJAX_userAction(this, 'my_specs_sharing');
});
// user exits
window.onbeforeunload = function () {
    console.log('exit');
    $.ajax({
        url: '/user_exit/',
        type: 'POST',
        async: false
    });
    // or delay here or cancel http response or GET -> POST
};


function AJAX_manager(object, action_name, ajax_request) {
    if (ajax_request) {
        ajax_que.push([object, action_name]);
        console.log('New Request: action name - ' + action_name);
        console.log('ajax_que : ');
        console.log(ajax_que);
        if (ajax_que.length == 1) {
            console.log('First element triggering AJAX');
            AJAX_userAction(object, action_name);
        }
    } else {
        console.log('New Response');
        ajax_que.shift();
        console.log('Item Deleted - Update ajax_que : ');
        console.log(ajax_que);
        if (ajax_que.length > 1) {
            console.log('Triggering ' + ajax_que[0][1] + ' next AJAX');
            AJAX_userAction(ajax_que[0][0], ajax_que[0][1]);
        }
    }
}

function AJAX_userAction(object, action_name) {
    var action_type;
    var object_id;
    var action_content;
    // affiliation_choosing
    if (action_name == 'affiliation_choosing') {
        if ($(object).is(':checked')) action_type = 1;
        else action_type = -1;
        object_id = $(object).val();
        console.log('affilliation action type: ' + action_type);
        // use_ranking
    } else if (action_name == 'use_ranking') {
        action_type = $(object).val();
        if (!$(object).is(':checked')) action_type = -action_type;
        object_id = $(object).prop('id').substr(0, $(object).prop('id').indexOf('_'));
        // question_answering
    } else if (action_name == 'question_answering') {
        action_type = $(object).val().substr($(object).val().indexOf('_') + 1);
        if (!$(object).is(':checked')) action_type = -action_type;
        object_id = $(object).val().substr(0, $(object).val().indexOf('_'));
        // advice_clicking
    } else if (action_name == 'advice_clicking') {
        // open advisor
        if ($(object).parent().prop('id') == 'info-elements' && $(object).children('span').text()) {
            object_id = $(object).val();
            action_type = 1;
            console.log('open', object_id);
            // tried to open info element
        } else if ($(object).parent().prop('id') == 'info-elements') {
            object_id = $(object).val();
            action_name = 'advice_opening_unsuccessful_attempt';
            console.log('tried to open', object_id);
            // close advisor
        } else if ($(object).prop('id') == 'info-close') {
            action_type = -1;
            object_id = get_advisor_id(object);
            console.log('closed', object_id);
            // forward pagination
        } else if ($(object).parent().prop('id') == 'info-pagination' && $(object).index() == 2) {
            action_type = 2;
            object_id = get_advisor_id($(object).parent('div#info-pagination'));
            console.log('forward', object_id);
            // backward pagination
        } else if ($(object).parent().prop('id') == 'info-pagination' && $(object).index() == 0) {
            action_type = -2;
            object_id = get_advisor_id($(object).parent('div#info-pagination'));
            console.log('backward', object_id);
        }
    } else if (action_name == 'menu_type_changing') {
        if ($(object).parent('label').prop('id') == 'needs-btn') {
            action_type = 1;
            console.log('needs');
        } else if ($(object).parent('label').prop('id') == 'specs-btn') {
            action_type = -1;
            console.log('specs');
        }
    } else if (action_name == 'my_specs_viewing') {
        if ($(object).prop('id') == 'my-specs-btn') {
            action_type = 1;
            console.log('open my specs');
        } else if ($(object).prop('id') == 'specs-close') {
            action_type = -1;
            console.log('close my specs');
        }
    } else if (action_name == 'my_specs_sharing') {
        switch (String($(object).prop('id'))) {
            case 'share-facebook':
                action_type = 1;
                console.log('share-facebook');
                break;
            case 'share-twitter':
                action_type = 2;
                console.log('share-twitter');
                break;
            case 'share-email':
                action_type = 3;
                console.log('share-email');
                break;
            case 'share-pdf':
                action_type = 4;
                console.log('share-pdf');
                break;
        }
    }
    // send AJAX post request to NewConsulteeAffiliation view
    $.ajax({
        url: '/user_actions/',
        type: 'POST',
        data: {
            action_name: action_name,
            action_type: action_type,
            object_id: object_id,
            action_content: action_content
        },
        // handle a successful response
        success: function (json) {
            // Trigger ajax
            AJAX_manager(null, null, false);
            // Update deals data
            update_deals(json['offers']);
            console.log('success'); // log the returned json to the console
        },
        // handle a non-successful response
        error: function (xhr, errmsg, err) {
            console.log(xhr.status + ": " + xhr.responseText, errmsg, err); // provide a bit more info about the error to the console
        }
    });
}

function update_deals(offers) {

    $('#results-section .results-deal').each(function () {
        var sort_ind = $(this).attr('id');
        for (var i = 0; i < offers.length; i++) {
            if (offers[i]['sort_indicator'] == sort_ind) {
                // ---Change deal <a> header---
                // image url
                $(this).children('a').children('img').attr('src', offers[i]['image_url']);
                // brand and line
                $(this).children('a').children('span').text(offers[i]['Brand'] + ' ' + offers[i]['Line']);
                // deal url
                $(this).children('a').attr('href', offers[i]['offers'][0]['deal_url']);
                // ---Change deal <div> drop down price---
                // deal url

                // ---Change deal <table> specification---
                var $specs_raw;
                var specs_index = 0;
                for (var feature_key in offers[i]['features']) {
                    // get feature raw
                    $specs_raw = $(this).find('tbody').children('tr').eq(specs_index);
                    // change feature value name
                    if (feature_key != 'Storage') {
                        $specs_raw.children('td').eq(1).text(offers[i]['features'][feature_key]);
                    } else {
                        $specs_raw.children('td').eq(1).text(offers[i]['features'][feature_key][0] + ' SSD\n' + offers[i]['features'][feature_key][1] + ' HDD');
                    }
                    specs_index += 1;
                }
            }
        }
    });
}

// function count_matches(arr, target_val) {
//     var count = 0;
//     for (var i=0; i<ajax_que.length; i++){
//
//     }
//     return (count%2 == 0) ? -1:1;
// }

function get_advisor_id(obj) {
    var info_type = null;
    $(obj).siblings('div.info-type').each(function () {
        if ($(this).css('display') == 'block') {
            info_type = String($(this).prop('id'));
        }
    });
    if (info_type) {
        switch (info_type) {
            case 'statistic-text':
                return 1;
                break;
            case 'insight-text':
                return 2;
                break;
            case 'objective-text':
                return 3;
                break;
            default:
                return 0;
                break;
        }
    }
}
