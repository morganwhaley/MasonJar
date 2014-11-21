/*
 * Mason Jar - The non-lamesauce social media feed
 * v 1.0.0
 */


var MasonJar = function() { };

var Cannery = function() { };


MasonJar.prototype.init = function() {

    this.callCount = 0;

    // Can we have the user specify how many posts from each social media provider.

    this.feeds = {
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
            id: '1421700507',
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
};


MasonJar.prototype.get = function(request) {

    if(!this.setRequestByRule(request)) {
        return false;
        // Possibly send back an error or graceful failure
    }

    if (this.request.method) {
        var methodToCall = window['setup' + this.request.method]();
        console.log(methodToCall);
    }

    this.setupInstagram(request, '1421700507.1fb234f.ed3aedfc81514fdd9d0a385a7ab80ddf');
    this.setupTwitter();

};


MasonJar.prototype.setRequestByRule = function(request) {
    if (this.feeds) {
        this.request = $.extend(true, request, this.feeds);
        //console.log(this.request.id);
        return true;
    }
    else {
        return false;
    }
};


//MasonJar.prototype.setupFacebook = function() {
//    /* make the API call */
//    FB.api(
//            '/' +  + '/posts',
//        function (response) {
//            if (response && !response.error) {
//                console.log(response);
//            }
//        }
//    );
//};


MasonJar.prototype.setupInstagram = function(obj, accessToken) {
    var feedObj = obj.instagram;
    var redirect = 'http://www.instagram.com';
    //url = 'https://api.instagram.com/v1/users/' + feedObj.id + '/media/recent';
    if(!accessToken) {
        if (location.hash) {
            accessToken = location.hash.split('=')[1];
        }
        else {
            location.href='https://instagram.com/oauth/authorize/?client_id='+ feedObj.id +'&redirect_uri='+ redirect +'&response_type=token';
        }
    }
    //url += '?access_token=' + accessToken;
    url = 'https://api.instagram.com/v1/users/1421700507/media/recent?access_token=' + accessToken + '&count=40';
    this.getFeed('Instagram', url);
    return this;
};


MasonJar.prototype.setupTwitter = function() {
    var url = '../MasonJar/twitter.php';
    this.getFeed('Twitter', url);
    return this;
};


MasonJar.prototype.getFeed = function(call, url) {
    var context = this;
    var data = call == 'Instagram' ? 'jsonp' : 'json';
    $.ajax({
        type: 'GET',
        url: url,
        dataType: data
    }).done(function(result) {
    }).fail(function( jqxhr, textStatus, error ) {
    }).always(function(a, textStatus, b) {
        context.handleAjaxReturn(a, textStatus, b);
    });
    return this;
};


MasonJar.prototype.handleAjaxReturn = function(a, textStatus, b) {
    if (textStatus == 'success') {
        console.log("yay!");
    }
    else {
        var err = textStatus + ", " + b;
        console.log( "Request Failed: " + err );
    }
};


MasonJar.prototype.handleAjaxSuccess = function(result) {
    context.normalizeInstagramResult(result);
    context.normalizeTwitterResult(result);
    presentation.callGridBuilder();
};


MasonJar.prototype.normalizeInstagramResult = function(result) {
    var context = this;
    var count = 11;
    for (var prop in result.data) {
        var index = result.data[prop];
        var time = context.normalizeTime(index.caption.created_time);
        var sortTime = index.caption.created_time;
        this.resultItem = {
            visual: index.images.standard_resolution.url,
            caption: index.caption.text,
            icon: 'fa-instagram',
            userOrHashtag: index.user.username,
            provider: 'instagram',
            link: index.link,
            time: time,
            sortTime: sortTime
        };
        presentation.createGridItem(this.resultItem, count);
        count = count + 2;
    }
    return this;
};


MasonJar.prototype.normalizeTwitterResult = function(result) {
    var context = this;
    var count = 10;
    for (var prop in result) {
        var index = result[prop];
        var unixTimestamp = Date.parse(index.created_at);
        var sortDate = unixTimestamp.toString().slice(0, -3);
        var time = context.normalizeTime(sortDate);
        this.resultItem = {
            visual: '',
            caption: index.text,
            icon: 'fa-twitter',
            userOrHashtag: '@' + index.user.screen_name,
            provider: 'twitter',
            link: 'https://twitter.com/izze/status/' + index.id_str,
            time: time,
            sortTime: sortDate
        };
        presentation.createGridItem(this.resultItem, count);
        count = count + 2;
    }
    return this;
};


MasonJar.prototype.normalizeTime = function(datetime) {
    console.log(datetime);
    var today = new Date();
    var date = new Date(datetime * 1000);
    var hours = Math.round(Math.abs(today - date) / 36e5);
    var daysAgo = Math.round(hours / 24) > 2 ? Math.round(hours / 24) + ' days ago' : 'yesterday';
    return daysAgo;
};




/*
 * ===========================================================================
 * BEGIN CANNERY CLASS
 * Renders normalized social media objects
 * ===========================================================================
 */


Cannery.prototype.init = function(options) {
    if (options.feeds && MasonJar) {
        this.requester = new MasonJar();
        this.requester.init();
        this.requester.get(options);
    }
    this.bindEvents();
};


Cannery.prototype.bindEvents = function() {
    var context = this;
    $(window).resize(function() { context.setupGridSizing(); });
    $('.jar').hover(function(e) { context.setVisibility(e); }, function() {context.removeOverlayVisibility();});
    $('#masonJar').on('click', '.jar', function(e) { context.getLink(e); });
};


Cannery.prototype.buildTheGrid = function() {
    this.setupGridSizing();
    this.buildIsotopeGrid();
    this.bindEvents();
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
        layoutMode: 'masonry',
        getSortData: {
            sorter: '[data-count]'
        },
        sortBy: 'sorter'
    });
};


Cannery.prototype.createGridItem = function(item, count) {
    var image = '';
    var holder = '';
    var caption = this.limitCaptionLength(item.caption);
    if (item.visual) {
        image = '<img src="' + item.visual + '" />';
        holder = '<div class="has-image holder">';
    }
    else {
        holder = '<div class="no-image holder">';
    }
    var listItem = '<div class="jar" data-sort-date="' + item.sortTime + '" data-count="' + count + '" data-provider="' + item.provider + '">' +
        holder +
        '<h6>' + item.provider + '</h6>' +
        '<h2 class="jar-caption">' + caption + '</h2>' +
        '<div class="author"><span>' + item.userOrHashtag + '</span></div>' +
        '<span class="posted-date">' + item.time + '</data>' +
        '</div>' +
        '<div class="overlay"></div>' +
        image +
        '<div class="social-icon"><i class="fa '+ item.icon + '"></i></div>' +
        '<a class="jar-link" href="' + item.link +  '" target="_blank"></a>' +
        '</div>';
    $('#masonJar').append(listItem);
    return this;
};

// Call this only once. Loop through jars and execute when the last one is reached.
Cannery.prototype.callGridBuilder = function() {
    var jar = $('.jar');
    var numberOfJars = jar.length;
    for (var i = 0; i <= numberOfJars; i++) {
        if (i == numberOfJars) {
            this.buildTheGrid();
        }
    }
    return this;
};


Cannery.prototype.limitCaptionLength = function(caption) {
    var strLen = caption.length;
    var newString = caption;
    if (strLen > 90) {
        newString = caption.substring(0, 90) + '...';
    }
    return newString;
};


Cannery.prototype.setVisibility = function(event) {
    var $target = $(event.target);
    // Clear any visibilities before assigning to the target
    this.removeOverlayVisibility();

    if ($target.hasClass('.holder') == false) {
        $target = $target.siblings('.holder');
    }
    $target.toggleClass('show').next('.overlay').toggleClass('show');
};


Cannery.prototype.removeOverlayVisibility = function() {
    $('.holder').removeClass('show');
    $('.overlay').removeClass('show');
};


Cannery.prototype.getLink = function(e) {
    var link = $(e.target).closest('.jar').children('a').attr('href');
    window.open(link,'_blank');
};


$(document).ready(function() {
    if (typeof(redLabelGoods) !== 'undefined' && redLabelGoods.options) {
        presentation = new Cannery();
        presentation.init(redLabelGoods.options);
    }
});