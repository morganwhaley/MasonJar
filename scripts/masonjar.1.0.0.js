/*
 * Mason Jar - The non-lamesauce social media feed
 * v 1.0.0
 */


var MasonJar = function() { };

var Cannery = function() { };


MasonJar.prototype.init = function() {

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


MasonJar.prototype.setupFacebook = function() {
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


MasonJar.prototype.setupInstagram = function(obj, accessToken) {
    var feedObj = obj.instagram;
    var redirect = 'http://www.instagram.com';
    //url = 'https://api.instagram.com/v1/users/' + feedObj.id + '/media/recent';
    if(!accessToken) {
        if (location.hash) {
            accessToken = location.hash.split('=')[1] ;
        }
        else {
            location.href='https://instagram.com/oauth/authorize/?client_id='+ feedObj.id +'&redirect_uri='+ redirect +'&response_type=token';
        }
    }
    //url += '?access_token=' + accessToken;
    url = 'https://api.instagram.com/v1/users/1421700507/media/recent?access_token=' + accessToken;
    this.processInstagramResult(url);
};



MasonJar.prototype.processInstagramResult = function(url) {
    var context = this;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp'
    }).done(function(result) {
        context.normalizeInstagramResult(result);
    });
};


MasonJar.prototype.normalizeInstagramResult = function(result) {
    for (var prop in result.data) {
        var index = result.data[prop];
        this.resultItem = {
            visual: index.images.standard_resolution.url,
            caption: index.caption.text,
            icon: 'fa-instagram',
            userOrHashtag: index.user.username,
            provider: 'instagram',
            link: index.link,
            datedatapoint: index.caption.created_time
        };
        presentation.createGridItem(this.resultItem);
    }
    presentation.setupGridSizing();
    presentation.buildIsotopeGrid();
    presentation.bindEvents();
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
    $('.jar').hover(function(e) { context.setVisibility(e); });
    $('#masonJar').on('click', '.jar', function(e) { context.getLink(e); });
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


Cannery.prototype.createGridItem = function(resultItem) {
    this.buildContainer(resultItem);
};


Cannery.prototype.buildContainer = function(item) {
    var image = '';
    var holder = '';
    var caption = this.limitCaptionLength(item.caption);
    var time = this.convertTime(item.datedatapoint);
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
        '<h2 class="jar-caption">' + caption + '</h2>' +
        '<div class="author"><span>' + item.userOrHashtag + '</span></div>' +
        '<span class="posted-date">' + time + '</data>' +
        '</div>' +
        '<div class="overlay"></div>' +
        image +
        '<div class="social-icon"><i class="fa '+ item.icon + '"></i></div>' +
        '</div>';
    $('#masonJar').append(listItem);
};


Cannery.prototype.limitCaptionLength = function(caption) {
    var strLen = caption.length;
    var newString = caption;
    if (strLen > 90) {
        newString = caption.substring(0, 90) + '...';
    }
    return newString;
};


Cannery.prototype.convertTime = function(datetime) {
    var today = new Date();
    var date = new Date(datetime * 1000);
    var hours = Math.round(Math.abs(today - date) / 36e5);
    var daysAgo = Math.round(hours / 24) > 2 ? Math.round(hours / 24) + ' days ago' : 'yesterday';
    return daysAgo;
};


Cannery.prototype.setVisibility = function(event) {
    var $target = $(event.target);
    if ($target.hasClass('.holder') == false) {
        $target = $target.closest('.holder');
    }
    $target.toggleClass('show');
    $target.next('.overlay').toggleClass('show');
};


Cannery.prototype.getLink = function(e) {
    var $target = $(e.target);
    console.log($target);
};


$(document).ready(function() {
    if (typeof(redLabelGoods) !== 'undefined' && redLabelGoods.options) {
        presentation = new Cannery();
        presentation.init(redLabelGoods.options);
    }
});