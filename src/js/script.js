$(document).ready(function() {

    HOMEPAGE_LIST_PARAM = 'cs294-112homepagelists';

    /**
     * Manages state of all lists
     */
    function State() {

        data = {};

        /**
         * Save in local browser cache.
         */
        this.save = function() {
            localStorage.setItem(HOMEPAGE_LIST_PARAM, JSON.stringify(data));
            return this;
        }

        /**
         * Load from local browser cache
         */
        this.load = function() {
            raw = localStorage.getItem(HOMEPAGE_LIST_PARAM);
            if (raw) {
                data = JSON.parse(raw);
                console.log('Loaded state: ' + raw);
            }
            return this;
        }

        /**
         * Get status for a list.
         *
         * :param str resource: ID of the resource in question
         * :return: boolean value, true if resource expanded
         */
        this.get = function(resource) {
            if (resource in data) {
                return data[resource];
            }
            return false;
        }

        /**
         * Set status for a list.
         *
         * :param str resource: ID of the resource in question
         * :param bool value: whether or not the resource has been expanded
         */
        this.set = function(resource, value) {
            data[resource] = value;
            this.save();
            return this;
        }
    }

    var current = 0;
    var heights = {};

    $('.menu').on('click', function() {
        $('.drawer').addClass('active');
        lockScroll();
    });

    $('.x').on('click', function() {
        $('.drawer').removeClass('active');
        releaseScroll();
    });

    $('.drawer a').on('click', function() {
        $('.drawer').removeClass('active');
        releaseScroll();
    });

    function lockScroll() {
        $('html, body').css({
            'overflow': 'hidden',
            'height': '100%'
        });
    }

    function releaseScroll() {
        $('html, body').css({
            'overflow': 'auto',
            'height': 'auto'
        });
    }

    function collapse(resource) {
        if (!(resource in heights)) {
            heights[resource] = $('ul.lists[resource="' + resource + '"]').height();
        }
        console.log('ul.lists[resource="' + resource + '"]');
        $('ul.lists[resource="' + resource + '"]').animate({
            height: 0
        });
        $('.trigger[resource="' + resource + '"]').html("Expand");
        state.set(resource, false);
    }

    function expand(resource) {
        $('ul.lists[resource="' + resource + '"]').height(heights[resource]);
        $('.trigger[resource="' + resource + '"]').html("Collapse");
        state.set(resource, true);
    }

    function restoreCollapseStates() {
        $('.trigger').each(function() {
            var resource = $(this).attr('resource');
            if (state.get(resource)) {
                expand(resource);
            } else {
                collapse(resource);
            }
        });
    }

    function isExpanded(resource) {
        return $('ul.lists[resource="' + resource + '"]').height() != 0;
    }

    $('.trigger').on('click', function() {
        var resource = $(this).attr('resource');
        if (isExpanded(resource)) {
            collapse(resource);
        } else {
            expand(resource);
        }
    });

    $('.next-week-overview').on('click', function() {
        toSlide(parseInt($(this).parent().parent().data('number')) + 1);
    });

    $('.prev-week-overview').on('click', function() {
        toSlide(parseInt($(this).parent().parent().data('number')) - 1);
    });

    function toSlide(number) {
        $('.week-overview').addClass('inactive');
        $('.week-overview[data-number="' + number + '"]').removeClass('inactive');
    }

    state = new State().load();
    restoreCollapseStates();

    // var api_key = 'AIzaSyBqJVOZunTJy7veXWbxHBv7akExIFRcozg';
    // var calendarID = 'berkeley.edu_q2lae20h8ncme3pb5a00p7is98@group.calendar.google.com';
    // // Load calendar events
    // formatGoogleCalendar.init({
    //     calendarUrl: 'https://www.googleapis.com/calendar/v3/calendars/' + calendarID +
    //                     '/events?key=' + api_key,
    //     past: false,
    //     upcoming: true,
    //     sameDayTimes: true,
    //     dayNames: true,
    //     pastTopN: -1,
    //     upcomingTopN: 5,
    //     recurringEvents: true,
    //     itemsTagName: 'li',
    //     upcomingSelector: '#events-upcoming',
    //     pastSelector: '',
    //     upcomingHeading: '',
    //     pastHeading: '',
    //     format: ['*date*', ': ', '*summary*', ' ??? ', '*description*', ' in ', '*location*'],
    //     after: function() {
    //       $('.live-bar').marquee({
    //         direction: 'left',
    //         pauseOnHover: true,
    //         duration: 15000
    //       });
    //     }
    // });
});