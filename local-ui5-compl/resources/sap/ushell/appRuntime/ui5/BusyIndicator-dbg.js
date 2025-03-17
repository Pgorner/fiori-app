// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/* eslint-disable */
var apprtBIdiv;
document.addEventListener("DOMContentLoaded", function () {
    try {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "style.css";
        document.head.appendChild(link);

        apprtBIdiv = document.createElement("div");
        apprtBIdiv.classList.add("apprtBIcenter");
        document.body.appendChild(apprtBIdiv);

        var apprtBIdivc;

        for (var i = 0; i < 3; i++) {
            apprtBIdivc = document.createElement("div");
            apprtBIdivc.classList.add('apprtBIcir');
            apprtBIdiv.appendChild(apprtBIdivc);
        }

    } catch (e) { }
});





