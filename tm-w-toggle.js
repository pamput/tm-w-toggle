// ==UserScript==
// @name         GitHub white space toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  go to a PR code comparison and try to press 'w'!
// @author       LK
// @match        https://github.com/*/*/pull/*/files*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function () {

    var lsKey = 'github-w-default';

    var wOn = function (url) {

        var questionMarkIndex = url.indexOf('?');

        if (questionMarkIndex > -1) {
            if (questionMarkIndex != url.length - 1) {
                url += '&';
            }

            url += 'w=1';
        } else {
            url += '?w=1';
        }

        return url;
    };

    var wOff = function (url) {

        url = url.replace(/&?w=1&?/, '');
        url = url[url.length - 1] == '?' ? url.slice(0, -1) : url;

        return url;
    };

    var isWOn = function (url) {
        return url.match(/.*((\?w=1&?)|(\&w=1&?)).*/g);
    };

    var toggle = function () {
        var url = window.location.href;

        if (isWOn(url)) {
            // If there is already a 'w=1' param, then delete it
            url = wOff(url);

        } else {
            // If the param is not there, add it
            url = wOn(url);
        }

        window.location.href = url;
    };

    var toggleDefault = function () {
        var isDefault = localStorage.getItem(lsKey) == "true";

        var url = window.location.href;

        if (isDefault) {
            localStorage.setItem(lsKey, false);
            url = wOff(url);
        } else {
            localStorage.setItem(lsKey, true);
            url = wOn(url);
        }

        window.location.href = url;
    };

    $(document).on('ready', function () {

        var flag = 'defaultw';

        var url = window.location.href;
        var isDefault = localStorage.getItem(lsKey) == "true";

        if (isDefault && url.indexOf(flag) == -1 && !isWOn(url)) {
            url = wOn(url);
            url += "&" + flag;

            window.location.href = url;
        }
    });

    $(document).on('keypress', function (e) {
        var tag = e.target.tagName.toLowerCase();

        console.log('pressed ' + e.which);

        if (tag != 'input' && tag != 'textarea') {
            // If 'w' is pressed...
            if (e.which === 119) {
                toggle();
            }

            // If 'W' is pressed...
            if (e.which === 87) {
                toggleDefault();
            }
        }

    });

})();