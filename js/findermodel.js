'use strict';

/**
 * Finder Model - Main model that uses FinderJS
 *
 * @constructor
 */
var FinderModel = function (arg) {

    // Assign `this` through `riot.observable()`
    var self = riot.observable(this);

    // Store args
    self.args = arg;

    // Store current view id. Default "home".
    self.view = "home";

    // Create an instance of `Applait.Finder`
    self.finder = new Applait.Finder({
        type: "sdcard",
        minSearchLength: 2,
        debugMode: arg.debug
    });

    // Current search results
    self.searchResults = [];

    /**
     * Reset all internals
     */
    self.reset = function () {
        self.searchResults = [];
        self.finder.reset();
    };

    /**
     * Initiate search
     *
     * @param {string} key - The search string
     */
    self.search = function (key) {
        self.reset();
        self.finder.search(key);
    };

    /**
     * Subscribe to Finder's fileFound event
     */
    self.finder.on("fileFound", function (file, fileinfo) {
        self.searchResults.push({ file: file, fileinfo: fileinfo });
    });

    /**
     * Subscribe to Finder's searchComplete event
     *
     * The `resultsFound` is triggered if any file is matched.
     * Else, `noResults` is triggered
     */
    self.finder.on("searchComplete", function () {
        if (self.searchResults.length && self.finder.filematchcount) {
            self.trigger("resultsFound");
        } else {
            self.trigger("noResults");
        }
    });

    /**
     * Provide a generic "load" method for routing
     */
    self.load = function (path) {
        self.trigger("before:load", path);
        self.trigger("load:" + path);
        self.view = path;
    };


};
