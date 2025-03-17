// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

function onLoad () {
    "use strict";
    document.getElementById("idAppUI5").addEventListener("click", function (event) { openCity(event, "tabAppUI5"); });
    document.getElementById("idAppRuntime").addEventListener("click", function (event) { openCity(event, "tabAppRuntime"); });
    document.getElementById("idAppHTML").addEventListener("click", function (event) { openCity(event, "tabAppHTML"); });
    document.getElementById("idPlugin1").addEventListener("click", function (event) { openCity(event, "tabPlugin1"); });
    document.getElementById("idPlugin2").addEventListener("click", function (event) { openCity(event, "tabPlugin2"); });
    //openCity(event, 'tabApplication');
}

function openCity (evt, cityName) {
    "use strict";
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

onLoad();
