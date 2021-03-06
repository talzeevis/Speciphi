$(document).ready(function () {
    var desktop_flag = false;
    // add space (or 2) when (1/X) (or X=1) to select box options
    OptionsSpacesFix();

    // show and save first question
    $('div.questions').first().children('div.question').first().css('display', 'inline-block');
    var $current_question = $('div.questions').first().children('div.question').first();
    // show question indicator
    $current_question.parent('div.questions').children('div.question').each(function (index) {
        $('#question_indicators div:nth-child(' + parseInt(index + 1) + ')').css('display', 'inline-block');
    });

    // button clicks bind
    // prevent form submission
    $('button.answer').on('click', PD);
    // increase / decrease subject and option number and style button
    $('button.answer').on('click', AnswerClick);
    // IMPLEMENT: sent taltul question and answer id using ajax

    // display questions according to select chose
    $('select').on('change', DisplayMobileQuestionAndIndicator);

    // forward to next questions
    $('#question_nav_right').on('click', function () {
        if ($current_question.next('div').length) {
            $current_question.css('display', 'none');
            $current_question.next('div').css('display', 'inline-block');
            // update current question
            $current_question = $current_question.next('div');
            // update question indicator
            $('div#question_indicators').children('div.indicator_on').removeClass('indicator_on').next('div.question_indicator').addClass('indicator_on');
        }
    });

    // backward to last question
    $('#question_nav_left').on('click', function () {
        if ($current_question.prev('div').length) {
            $current_question.css('display', 'none');
            $current_question.prev('div').css('display', 'inline-block');
            // update current question
            $current_question = $current_question.prev('div');
            // update question indicator
            $('div#question_indicators').children('div.indicator_on').removeClass('indicator_on').prev('div.question_indicator').addClass('indicator_on');
        }
    });

    // responsive query
    function WidthChange() {
        // mobile screens
        if (window.matchMedia("(max-width: 991px)").matches) {
            // if was on desktop
            if (desktop_flag) {
                // finish animating
                if ($('div.question').is(':animated')) {
                    $('div.question').finish();
                }
                // display only 1 question
                $current_question.siblings('div.question').css('display', 'none');
                // select last displayed questions # adjusted to new select box
                $("select#questions_list").val($current_question.parent('div.questions').prop('id').substring('questions_'.length));
                $('ul#questions_listSelectBoxItOptions').children('li.selectboxit-option').each(function () {
                    if ($(this).data('val') == $current_question.parent('div.questions').prop('id').substring('questions_'.length)) {
                        $('li.selectboxit-option').removeClass('selectboxit-focus selectboxit-selected');
                        $(this).addClass('selectboxit-focus selectboxit-selected');
                        $('span#questions_listSelectBoxItText').val($(this).data('val'));
                        $('span#questions_listSelectBoxItText').text($(this).text());
                    }
                });
                // remove side question style
                $('div.question').removeClass('side_question');
                $('div.question').removeClass('side_question_animate');
                $('div.answers').removeClass('side_answers');
                $('div.question').removeClass('two_questions_fix_left');

                // show all answers
                $('div.answers').css('display', '');
                $('button.answer').css('display', '');

                // reset margins
                $('div.questions').css({'margin-left': '', 'margin-right': ''});
                $('div.questions').removeClass('two_questions_fix');
                $('div.question').css({'width': '', 'height': '', 'margin-left': '', 'margin-right': ''});


                // reset bind answer button functionality
                $('button.answer').off('click', AnswerClick);
                $('button.answer').on('click', AnswerClick);

                DisplayMobileQuestionAndIndicator();
            }
            desktop_flag = false;
        } //end mobile screens
        // desktop screens
        else if (window.matchMedia("(min-width: 992px)").matches) {
            desktop_flag = true;
            // on first desktop entry
            if (!$('#desktop_questions_list').length) {
                // create questions row container
                $('#questions_list').before(
                    "<div id='desktop_questions_list' class='row'>" +
                    "</div>"
                );
                // add elements to questions container
                $('select#questions_list').children('option').each(function () {
                    $('div#desktop_questions_list').append(
                        "<div id='questions_desktop_container_" + $(this).attr('value') + "' class='questions_desktop_container' style='display: inline-block'>" +
                        "<span class='questions_subject' style='display: block;'>" + $(this).attr('data-brand') +
                        "</span>" +
                        "<button id='questions_circle_" + $(this).attr('value') + "' class='questions_circle' style='display: block;'>" +
                        $(this).text()[1] + $(this).text()[2] + $(this).text()[3] +
                        "</button>" +
                        "</div>"
                    )
                });

                // prevent questions circle action
                $('button.questions_circle').on('click', PD);

                // display pressed subject questions (only if user didn't press on displayed subject)
                $('div.questions_desktop_container').on('click', function () {
                    var pressed_subject_id = $(this).children('button').prop('id').substring('questions_circle_'.length);
                    var displayed_subject_id = $current_question.parent('div').attr('id').substring('questions_'.length);
                    if (pressed_subject_id != displayed_subject_id) {
                        $('div.question').css('display', 'none');
                        $('div#questions_' + pressed_subject_id + ' div.question').css('display', 'inline-block');
                        // update current question
                        $current_question = $('div#questions_' + pressed_subject_id).children('div.question').first();
                        StyleQuestions($current_question);
                    }
                    $('div.questions_desktop_container').removeClass('current_subject');
                    $('div#questions_desktop_container_' + $current_question.parent('div.questions').prop('id').substring('questions_'.length)).addClass('current_subject');

                });
                // add line separator
                $('div#questions_holder').before('<hr id="line_separator"/>');

                // add questions subject display
                $('hr#line_separator').before(
                    "<div id='questions_desktop_container_display'>" +
                    "<span id='questions_subject_display' style='display: block;'>" +
                    "</span>" +
                    "<div id='questions_circle_display' style='display: block;'>" +
                    "</div>" +
                    "</div>"
                );

                // on small question click, center (with animation) and bigger question clicked
                $(document).on('click', '.side_question', SwitchQuestion);
                $(document).on('click', '.side_question_animate', SwitchQuestion);

            } // end first desktop entry

            // show current question brothers
            $current_question.parent('div.questions').children('div.question').css('display', 'inline-block');
            StyleQuestions($current_question);


            // update number of answered questions (from mobile select box)
            $('select#questions_list').children('option').each(function () {
                $('button#questions_circle_' + $(this).val()).text($(this).text()[1] + $(this).text()[2] + $(this).text()[3]);
            });

            // color current subject
            $('div.questions_desktop_container').removeClass('current_subject');
            $('div#questions_desktop_container_' + $current_question.parent('div.questions').prop('id').substring('questions_'.length)).addClass('current_subject');

            // fill displayed subject content
            UpdateDisplaySubject($current_question);
        }//end desktop screens
    }// end responsive query

// media query event handler
    if (matchMedia) {
        // define break points
        var mq_mobile = window.matchMedia("(max-width: 991px)");
        // add listeners and callback
        mq_mobile.addListener(WidthChange);
        // invoke layout function
        WidthChange();
    }

    function DisplayMobileQuestionAndIndicator() {
        $('div.question').css('display', 'none');
        // display first question and update current question
        if (this.value) {
            // select box
            $current_question = $('div#questions_' + this.value + ' div.question:nth-child(1)').css('display', 'inline-block');
        } else {
            // desktop to mobile
            $current_question = $current_question.parent('div.questions').children('div.question').first().css('display', 'inline-block');
        }
        // hide last question indicator
        $('.question_indicator').css('display', 'none');
        $('#question_indicators').children('div.indicator_on').removeClass('indicator_on');
        // show current question indicator
        $current_question.parent('div.questions').children('div.question').each(function (index) {
            $('#question_indicators div:nth-child(' + parseInt(index + 1) + ')').css('display', 'inline-block');
        });
        // fill first indicator
        $('#question_indicators div.question_indicator:nth-child(1)').addClass('indicator_on');
    }

    function StyleQuestions($current) {

        // if 1 questions - normal
        // if 2 questions - 1st-cutted, 2nd-normal
        // if 3 questions - 1st-cutted, 2nd-normal, 3rd-cutted
        var $questions = $($current.parent('div.questions')).children('div.question');
        switch ($questions.length) {
            case 2:
                if ($questions.hasClass('two_questions_fix_left')) {
                    StyleQuestionNormal($questions.first(), false);
                    StyleQuestionSmall($($questions.first()).next(), false);
                } else {
                    StyleQuestionSmall($questions.first(), false);
                    // the next is already Normal
                }
                // remove margin from last time
                $questions.first().css({'margin-right': '', 'margin-left': ''});
                // center second question
                $questions.parent().css('margin-left', '');
                $questions.parent().addClass('two_questions_fix');
                break;
            case 3:
                $('div.questions').removeClass('two_questions_fix');
                $('div.questions').css('margin-left', '');
                // style first question
                StyleQuestionSmall($questions.first(), false);
                // style last question
                StyleQuestionSmall($questions.last(), false);
                break;
            default:
                $('div.questions').removeClass('two_questions_fix');
                $('div.questions').css('margin-left', '');
                break;
        }
    }

    // invoked on small/side question click
    // animate: middle to small, animate all moves right/left, switch places, animate new middle to big
    function SwitchQuestion() {

        var small_q_width, small_q_height, small_q_padding_top, small_q_margin_right, normal_q_width, normal_q_height, temp_margin_left_two_q;

        if ($(window).width() < 1200) {
            small_q_width = '215px';
            small_q_height = '120px';
            small_q_padding_top = '80px';
            small_q_margin_right = '-=450px';
            normal_q_width = '300px';
            normal_q_height = '185px';
            temp_margin_left_two_q = '454px';


        } else {
            small_q_width = '260px';
            small_q_height = '155px';
            small_q_padding_top = '90px';
            small_q_margin_right = '-=535';
            normal_q_width = '355px';
            normal_q_height = '230px';
            temp_margin_left_two_q = '539px';


        }
        $current_question = $(this);
        // 3 questions
        if ($(this).siblings('div.question').length == 2) {
            // animate middle to small
            StyleQuestionSmall($(this).parent('div.questions').children('div.question:nth-child(2)'), true, small_q_width, small_q_height, small_q_padding_top);
            // left question pressed
            if ($(this).next('div.question').length) {
                // wait last animate to finish
                var wait1 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait1);
                        // executed after element is complete:
                        // toggle and remove right question
                        $($current_question.next()).next().toggle('slow', function () {
                            $(this).remove();
                        });
                        // copy right question to the other side (while he is toggled)
                        var $switch = $($current_question.next()).next().clone().insertBefore($current_question).css('display', 'none');
                        $($switch.children('div.answers')).children('button.answer').on('click', PD);
                        // hide button
                        $($current_question.next()).next().children('div.answers').children('button.answer').toggleClass('hidden', 150);
                        // animate copied element entrance from the left
                        $switch.toggle('slow');
                        // replace default toggle display attr to inline-block
                        if ($switch.is(':visible'))
                            $switch.css('display', 'inline-block');
                        StyleQuestionNormal($current_question, true, small_q_width, small_q_height, normal_q_width, normal_q_height);
                    }
                }, 200);
            }
            // right question pressed
            else if ($(this).prev('div.question').length) {
                // wait last animate to finish
                var wait2 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait2);
                        // executed after element is complete:
                        // toggle and remove left question
                        $($current_question.prev()).prev().toggle('slow', function () {
                            $(this).remove();
                        });
                        // copy left question to the other side (while he is toggled)
                        var $switch = $($current_question.prev()).prev().clone().insertAfter($current_question).css('display', 'none');
                        $($switch.children('div.answers')).children('button.answer').on('click', PD);
                        // hide button
                        $($current_question.prev()).prev().children('div.answers').children('button.answer').toggleClass('hidden', 150);
                        // animate copied element entrance from the left
                        $switch.toggle('slow');
                        // replace default toggle display attr to inline-block
                        if ($switch.is(':visible'))
                            $switch.css('display', 'inline-block');
                        StyleQuestionNormal($current_question, true, small_q_width, small_q_height, normal_q_width, normal_q_height);
                    }
                }, 200);
            }
            // only 2 questions
        } else if ($(this).siblings('div.question').length == 1) {
            // left question pressed
            if ($(this).next('div.question').length) {
                // animate middle to small
                StyleQuestionSmall($(this).parent('div.questions').children('div.question:nth-child(2)'), true, small_q_width, small_q_height, small_q_padding_top);
                // wait last animate to finish
                var wait3 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait3);
                        // executed after element is complete:
                        // move all to right
                        $current_question.parent('div.questions').children('div.question:nth-child(2)').animate({'margin-right': small_q_margin_right}, 450);
                    }
                }, 200);
                var wait8 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait8);
                        // executed after element is complete:
                        // remove inline css leftovers and keep it on the right side
                        $current_question.parent('div.questions').children('div.question:nth-child(2)').css({'margin-right': ''});
                        $current_question.addClass('two_questions_fix_left');
                        // bigger middle question
                        StyleQuestionNormal($current_question, true, small_q_width, small_q_height, normal_q_width, normal_q_height);
                    }
                }, 200);
            }
            // right question pressed
            else if ($(this).prev('div.question').length) {
                $('div.question').removeClass('two_questions_fix_left');
                // temporary css for animation
                $current_question.prev().css('margin-left', temp_margin_left_two_q);
                console.log($current_question.prev().css('margin-left'));
                // animate middle to small
                StyleQuestionSmall($(this).parent('div.questions').children('div.question:nth-child(1)'), true, small_q_width, small_q_height, small_q_padding_top);
                // wait last animate to finish
                var wait4 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait4);
                        // executed after element is complete:
                        // move all to left
                        $current_question.prev().animate({'margin-left': small_q_margin_right}, 450);
                    }
                }, 200);
                var wait9 = setInterval(function () {
                    if (!$('div.question').is(':animated')) {
                        clearInterval(wait9);
                        // executed after element is complete:
                        // remove inline css leftovers and keep it on the right side
                        $current_question.parent('div.questions').children('div.question:nth-child(2)').css({'margin-left': ''});
                        // bigger middle question
                        StyleQuestionNormal($current_question, true, small_q_width, small_q_height, normal_q_width, normal_q_height);
                    }
                }, 200);
            }
        }
        // remove inline css
        var wait7 = setInterval(function () {
            if (!$('div.question').is(':animated')) {
                clearInterval(wait7);
                // executed after element is complete:
                $current_question.parent('div.questions').children('div.question').css({
                    'margin-left': '',
                    'margin-right': '',
                    'overflow': '',
                    'padding': '',
                    'margin-top': '',
                    'margin-bottom': '',
                    'opacity': '',
                    'width': '',
                    'height': ''
                });
            }
        }, 200);

    }

    function StyleQuestionSmall($question, animate, small_q_width, small_q_height, small_q_padding_top) {
        // make it small
        if (animate) {
            // add reduced style and animate the rest
            $question.addClass('side_question_animate');
            $question.animate({
                width: small_q_width,
                height: small_q_height
            }, {duration: 500, queue: false});
            $('div#questions_holder').animate({paddingTop: small_q_padding_top}, {
                duration: 500,
                queue: false
            });
        } else {
            $question.addClass('side_question');
        }
        // small buttons
        $question.children('div.answers').addClass('side_answers');

        // if question was answered - show only answer and disable button click
        var hided_siblings = false;
        $($question.children('div.answers')).children('button').each(function () {
            if ($(this).attr('value') == '1') {
                // hide brothers
                $(this).siblings('button').css('display', 'none');
                hided_siblings = true;
            }
        });
        // disable buttons click
        $($question.children('div.answers')).children('button.answer').off('click', AnswerClick);
        // question wasn't answered - hide all answers
        if (!hided_siblings) {
            $question.children('div.answers').css('display', 'none');
        }

        var wait4 = setInterval(function () {
            if (!$('div.question').is(':animated')) {
                clearInterval(wait4);
                // executed after element is complete:
                $question.addClass('side_question');
                $question.removeClass('side_question_animate');
            }
        }, 200);
    }

    function StyleQuestionNormal($question, animate, small_q_width, small_q_height, normal_q_width, normal_q_height) {
        $question.removeClass('side_question');
        $question.removeClass('side_question_animate');
        if (animate) {
            // temporary height just for animation
            $question.css({'width': small_q_width, 'height': small_q_height});
            // animate bigger and un padding simultaneously
            $question.animate({width: normal_q_width, height: normal_q_height}, {duration: 500, queue: false});
            $('div#questions_holder').animate({paddingTop: '15px'}, {duration: 500, queue: false});

        }
        var wait5 = setInterval(function () {
            if (!$('div.question').is(':animated')) {
                clearInterval(wait5);
                // executed after element is complete:
                // bigger the buttons
                $($question.children('div.answers')).removeClass('side_answers');
                // bind answer button functionality
                $($question.children('div.answers')).children('button.answer').on('click', AnswerClick);
                // show all answers
                $question.children('div.answers').css('display', '');
                $($question.children('div.answers')).children('button.answer').css('display', '');
                // remove inline css
                $question.css({'width': '', 'height': ''});
            }
        }, 200);

    }

    function UpdateDisplaySubject($current) {
        var subject_text = $('div#questions_desktop_container_' + $current.parent('div.questions').prop('id').substring('questions_'.length)).children('span').text();
        $('span#questions_subject_display').text(subject_text);
        var subject_answered = $('button#questions_circle_' + $current.parent('div.questions').prop('id').substring('questions_'.length)).text();
        $('div#questions_circle_display').text(subject_answered);
    }

    function PD(event) {
        event.preventDefault();
    }

    function AnswerClick() {
        var $button = $(this);
        // if not selected before - increase select box number of questions answered
        var increase_answered = true;
        $($button.parent('div.answers')).children('button.answer').each(function () {
            // if already selected
            if ($(this).attr('value') == '1') {
                increase_answered = false;
            }
        });
        // update button pressed indicator
        // color 'on & off' state
        if ($button.attr('value') == '0') {
            // cancel selected brothers and color them 'off'
            $button.siblings('button').attr('value', '0');
            $button.siblings('button').css({
                'background-color': 'rgb(240, 240, 240)',
                'font-weight': 'normal'
            });
            // check and color 'on'
            $button.attr('value', '1');
            $button.css({
                'background-color': 'rgb(220, 220, 220)',
                'font-weight': 'bold'
            });
        }
        else if ($button.attr('value') == '1') {
            // un check and color 'off'
            $button.attr('value', '0');
            $button.css({
                'background-color': 'rgb(240, 240, 240)',
                'font-weight': 'normal'
            });
        }

        // if no selection at the end - reduce at select box the number of questions answered
        var decrease_answered = true;
        $($button.parent('div.answers')).children('button.answer').each(function () {
            if ($(this).attr('value') == '1') {
                decrease_answered = false;
            }
        });

        // update questions number on select box
        if (increase_answered || decrease_answered) {
            var $current_subject = $('select#questions_list option[value=' + $current_question.parent('div').prop('id').substring('questions_'.length) + ']');
            UpdateAnsweredNumber($current_subject, increase_answered, true);
            if (window.matchMedia("(min-width: 992px)").matches) {
                $current_subject = $('button#questions_circle_' + $current_question.parent('div').prop('id').substring('questions_'.length));
                UpdateAnsweredNumber($current_subject, increase_answered, false);
                UpdateDisplaySubject($current_question);
            }
            OptionsSpacesFix();
        }
    }

    function UpdateAnsweredNumber($subject, increase, mobile) {
        var inner_text = $subject.text();
        if (mobile) {
            if (increase) {
                // get text of current questions subject (select option)
                switch (inner_text[1]) {
                    case '0':
                        inner_text = String(inner_text).replace('(0', '(1');
                        break;
                    case '1':
                        inner_text = String(inner_text).replace('(1', '(2');
                        break;
                    case '2':
                        inner_text = String(inner_text).replace('(2', '(3');
                        break;
                    case '3':
                        inner_text = String(inner_text).replace('(3', '(4');
                        break;
                }
            } else {
                switch (inner_text[1]) {
                    case '1':
                        inner_text = String(inner_text).replace('(1', '(0');
                        break;
                    case '2':
                        inner_text = String(inner_text).replace('(2', '(1');
                        break;
                    case '3':
                        inner_text = String(inner_text).replace('(3', '(2');
                        break;
                    case '4':
                        inner_text = String(inner_text).replace('(4', '(3');
                        break;
                }
            }
        } else {
            // desktop
            if (increase) {
                // get text of current questions subject (select option)
                switch (inner_text[0]) {
                    case '0':
                        inner_text = String(inner_text).replace('0/', '1/');
                        break;
                    case '1':
                        inner_text = String(inner_text).replace('1/', '2/');
                        break;
                    case '2':
                        inner_text = String(inner_text).replace('2/', '3/');
                        break;
                    case '3':
                        inner_text = String(inner_text).replace('3/', '4/');
                        break;
                }
            } else {
                switch (inner_text[0]) {
                    case '1':
                        inner_text = String(inner_text).replace('1/', '0/');
                        break;
                    case '2':
                        inner_text = String(inner_text).replace('2/', '1/');
                        break;
                    case '3':
                        inner_text = String(inner_text).replace('3/', '2/');
                        break;
                    case '4':
                        inner_text = String(inner_text).replace('4/', '3/');
                        break;
                }
            }
        }
        $subject.text(inner_text);
        $('ul#questions_listSelectBoxItOptions').children('li.selectboxit-option').each(function () {
            if ($(this).data('val') == $subject.val()) {
                // update select text
                $('#questions_listSelectBoxItText').text(inner_text);
                // update option text
                var $child = $(this).children('a.selectboxit-option-anchor').children('span');
                console.log($(this).children('a.selectboxit-option-anchor').text(inner_text).prepend($child));
            }
        });
    }

    // add space (or 2) when (1/X) (or X=1)
    function OptionsSpacesFix() {
        // $('select#questions_list').children('option').each(function () {
        //     var options = $(this).text();
        //     var answers_part = options.substring(0, 5);
        //     var count_1s = (answers_part.match(/1/g) || []).length;
        //     // add 1 space (default)
        //     if (count_1s == 0) {
        //         $(this).text(answers_part + String.fromCharCode(160) + $(this).attr('data-brand'));
        //         // add 2 spaces
        //     } else if (count_1s == 1) {
        //         $(this).text(answers_part + String.fromCharCode(160) + String.fromCharCode(160) + $(this).attr('data-brand'));
        //         // add 3 spaces
        //     } else if (count_1s == 2) {
        //         $(this).text(answers_part + String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(160) + $(this).attr('data-brand'));
        //     }
        // });
    }
});