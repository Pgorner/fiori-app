// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * This script adds the current URLs parameters to the URL defined in a meta tag (http-equiv="Refresh") in the HTML page.
 * It does not expect URL parameters in the redirect URL and requires a redirect delay > 0 seconds.
 */
(function () {
    "use strict";

    var oMetaElement = document.querySelectorAll("meta[http-equiv='Refresh']");

    var sContentAttribute = oMetaElement.getAttribute("content");
    var regexResult = /; url=(.*)$/.exec(sContentAttribute);

    var sTargetUrl = regexResult[1];

    // It is not expected, that the redirected URL contains parameters.
    var sTargetUrlWithParams = sTargetUrl + window.location.search + window.location.hash;

    var sUpdatedContentAttribute = sContentAttribute.replace(sTargetUrl, sTargetUrlWithParams);

    // update the URL in the content attribute while keeping the delay and potential other parts untouched
    oMetaElement.setAttribute("content", sUpdatedContentAttribute);
})();
