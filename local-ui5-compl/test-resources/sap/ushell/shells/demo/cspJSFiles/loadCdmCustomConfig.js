// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
function getUrlParams () {
    "use strict";
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

var sConfigFileUrl = decodeURIComponent(getUrlParams().configFileUrl);

var oXHR = new XMLHttpRequest();
if (sConfigFileUrl !== "undefined") {
    oXHR.open("GET", sConfigFileUrl, false);
    oXHR.onreadystatechange = function () {
        "use strict";
        if (this.status === 200 && this.readyState === 4) {
            var oConfig = JSON.parse(oXHR.responseText);

            var oNewMetaElement = document.createElement("meta");
            oNewMetaElement.setAttribute("name", oConfig.name);
            oNewMetaElement.content = JSON.stringify(oConfig.content);
            document.head.appendChild(oNewMetaElement);
        }
    };
    oXHR.send();
}
