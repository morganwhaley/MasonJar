/*
 * Mason Jar - The non-lamesauce social media feed
 * v 1.0.0
 */


var MasonJar = function() { };

var Cannery = function() { };


MasonJar.prototype.init = function() {

    this.rules = {
        facebook: {
            id: '',
            icon: 'fa-facebook',
            method: 'getFacebookFeed'
        },
        flickr: {
            id: '',
            icon: 'fa-flickr',
            method: 'getFlickrFeed'
        },
        google: {
            id: '',
            icon: 'fa-google-plus',
            method: 'getGPlusFeed'
        },
        instagram: {
            id: '',
            icon: 'fa-instagram',
            redirectUrl: '',
            method: 'getInstagramFeed'
        },
        pinterest: {
            id: '',
            icon: 'fa-pinterest',
            method: 'getPinterestFeed'
        },
        rss: {
            id: '',
            icon: 'fa-rss',
            method: 'getRSSFeed'
        },
        twitter: {
            id: '',
            icon: 'fa-twitter',
            method: 'getTwitterFeed'
        },
        vimeo: {
            id: '',
            icon: 'fa-vimeo',
            method: 'getVimeoFeed'
        },
        youtube: {
            id: '',
            icon: 'fa-youtube',
            method: 'getYouTubeFeed'
        }
    };

    this.defaultSettings = {
        maxColumns: 6,
        rows: 3
    };

};


MasonJar.prototype.get = function(request) {

    if(!this.setRequestByRule(request)) {
        return false;
        // Possibly send back an error or graceful failure
    }

    if (request.settings) {
        this.extendDefaults(request.settings);
    }

    if (this.request.method) {
        // call that method
    }

};


MasonJar.prototype.setRequestByRule = function(request) {
    if (this.rules[request.name]) {
        this.request = $.extend(true, request, this.rules);
        //console.log(this.request.id);
        return true;
    }
    else {
        return false;
    }
};



MasonJar.prototype.extendDefaults = function(userSettings) {
    if (this.defaultSettings[userSettings]) {
        this.request = $.extend(true, userSettings, this.defaultSettings);
    }
};



MasonJar.prototype.setupFacebookFeed = function() {
    /* make the API call */
    FB.api(
            '/' +  + '/posts',
        function (response) {
            if (response && !response.error) {
                console.log(response);
            }
        }
    );
};


MasonJar.prototype.setupInstagramFeed = function(obj, data, accessToken) {
    var feedObj = obj.instagram;
    var redirect = obj.instagram.redirectUrl;
    url = 'https://api.instagram.com/v1/' + feedObj.id + '/media/recent';
    if(accessToken == '') {
        if (location.hash) {
            accessToken = location.hash.split('=')[1] ;
        }
        else {
            location.href='https://instagram.com/oauth/authorize/?client_id='+ feedObj.id +'&redirect_uri='+ feedObj.redirectUrl +'&response_type=token';
        }
    }
    url += '?access_token=' + accessToken + '&client_id=' + this.options.feeds.instagram.id;
};



MasonJar.prototype.processInstagramResult = function() {};


MasonJar.prototype.normalizeInstagramResult = function() {};






/*
 * ===========================================================================
 * BEGIN CANNERY CLASS
 * Renders normalized social media objects
 * ===========================================================================
 */


Cannery.prototype.init = function(options) {
    var context = this;
    if (options.feeds && MasonJar) {
        this.requester = new MasonJar();
        this.requester.init();
        this.socialItems = [];
        this.optionsSettings = [];
        options.feeds.forEach(function(request) {
            context.socialItems.push(context.requester.get(request));
        });
        options.settings.forEach(function(request) {
            context.optionsSettings.push(context.requester.get(request));
        });
    }
    this.createFakeImageResult();
    //this.createFakeTextResult();
    this.bindEvents();
    this.setupGridSizing();
    this.buildIsotopeGrid();
};


Cannery.prototype.bindEvents = function() {
    var context = this;
    $(window).resize(function() { context.setupGridSizing(); });
    $('.jar').hover(function(e) { context.setVisibility(e); });
};


Cannery.prototype.setupGridSizing = function() {
    var maxCols = 5;
    var windowWidth = $(window).width();
    var columnCount = this.checkColumnLayout(maxCols, windowWidth);
    var jarSize = windowWidth / columnCount;
    var elements = ['.jar', '.holder', '.jar > img'];
    this.setHeightsAndWidths(jarSize, elements);
};


Cannery.prototype.checkColumnLayout = function(columns, windowWidth) {
    for (var i = columns; i > 0; i--) {
        if (windowWidth / i > 280) {
            columns = i;
            break;
        }
    }
    return columns;
};


Cannery.prototype.setHeightsAndWidths = function(size, elements) {
    var newsize;
    for (var i = 0; i < elements.length; i++ ) {
        if (elements[i] == '.holder') {
            newsize = size - 60;
        }
        else {
            newsize = size;
        }
        $(elements[i]).height(newsize).width(newsize);
    }
};


Cannery.prototype.buildIsotopeGrid = function() {
    $('#masonJar').isotope({
        itemSelector: '.jar',
        layoutMode: 'masonry'
    });
};


Cannery.prototype.createFakeTextResult = function() {
    this.resultItem = {
        visual: '',
        caption: 'This is a test caption',
        icon: 'fa-twitter',
        userOrHashtag: '@supwhaley',
        time: '2 hours ago',
        provider: 'twitter',
        link: 'http://twitter.com/supwhaley',
        datedatapoint: 'datetime'
    };
    for (var i = 0; i < 15; i++) {
        this.buildContainer(this.resultItem);
    }
};


Cannery.prototype.createFakeImageResult = function() {
    this.resultItem = {
        visual: 'http://photos-d.ak.instagram.com/hphotos-ak-xaf1/10666027_349786218525699_1318116695_n.jpg',
        caption: 'This is a test caption',
        icon: 'fa-instagram',
        userOrHashtag: 'seahorse5280',
        time: '2 hours ago',
        provider: 'instagram',
        link: 'http://instagram.com/seahorse5280',
        datedatapoint: 'datetime'
    };
    for (var i = 0; i < 15; i++) {
        this.buildContainer(this.resultItem);
    }
};


Cannery.prototype.buildContainer = function(item) {
    var image = '';
    var holder = '';
    if (item.visual) {
        image = '<img src="' + item.visual + '" />';
        holder = '<div class="has-image holder">';
    }
    else {
        holder = '<div class="no-image holder">';
    }
    var listItem = '<div class="jar">' +
        '<a class="jar-link" href="' + item.link +  '" target="_blank"></a>' +
        holder +
        '<h6>' + item.provider + '</h6>' +
        '<h2 class="jar-caption">' + item.caption + '</h2>' +
        '<div class="author"><span>' + item.userOrHashtag + '</span></div>' +
        '<data class="' + item.datedatapoint + ' posted-date" title="1409232647" value="">' + item.time + '</data>' +
        '<div class="social-icon"><i class="fa '+ item.icon + '"></i></div>' +
        '</div>' +
        '<div class="overlay"></div>' +
        image +
        '</div>';
    $('#masonJar').append(listItem);
};


Cannery.prototype.setVisibility = function(event) {
    var $target = $(event.target);
    if ($target.hasClass('.holder') == false) {
        $target = $target.closest('.holder');
    }
    $target.toggleClass('show');
    $target.next('.overlay').toggleClass('show');
};


$(document).ready(function() {
    if (typeof(redLabelGoods) !== 'undefined' && redLabelGoods.options) {
        presentation = new Cannery();
        presentation.init(redLabelGoods.options);
    }
});