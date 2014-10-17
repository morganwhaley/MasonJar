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
};


MasonJar.prototype.get = function(request) {
    console.log('request' + request.name);

    if(!this.setRequestByRule(request)) {
        return false;
        // Possibly send back an error or graceful failure
    }

    if (this.request.method) {
        // call that method

    }

};


MasonJar.prototype.setRequestByRule = function(request) {
    if (this.rules[request.name]) {
        this.request = $.extend(true, request, this.rules[request.name]);
        console.log(this.request);
        return true;
    }
    else {
        return false;
    }
};


MasonJar.prototype.getFacebookFeed = function(obj) {
    // Set up properties for establishing connection
    var oFeed = this.setupFacebookFeed();

    // Make AJAX Call for the feed object

    // Success is call to function: return this.normalizeFacebook(response);
};


MasonJar.prototype.create = function() {

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


MasonJar.prototype.createFakeResult = function() {
    
};



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
        options.feeds.forEach(function(request) {
            context.socialItems.push(context.requester.get(request));
        });
    }
    console.log('options: ' + options);
};


Cannery.prototype.bindEvents = function() {

};


Cannery.prototype.something = function() {
    // Do Stuff
};


$(document).ready(function() {

    if (typeof(redLabelGoods) !== 'undefined' && redLabelGoods.options) {
        presentation = new Cannery();
        presentation.init(redLabelGoods.options);
    }
});