// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sap.ushell.demo.CameraAndLocationSample.App", {
        onInit: function () { },

        onCameraOn: function () {
            var that = this;

            that.getView().byId("videoStatus").setText("Status: OFF");
            var video = document.querySelector(".videoElement");
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function (stream) {
                        video.srcObject = stream;
                        that.getView().byId("videoStatus").setText("Status: ON");
                    })
                    .catch(function (error) {
                        that.getView().byId("videoStatus").setText("Status: ERROR");
                    });
            } else {
                that.getView().byId("videoStatus").setText("Status: ERROR");
            }
        },

        onCameraOff: function () {
            var video = document.querySelector(".videoElement");
            video.srcObject = undefined;
            this.getView().byId("videoStatus").setText("Status: OFF");
        },

        onGetLocation: function () {
            var that = this;

            that.getView().byId("idLatitude").setValue("");
            that.getView().byId("idLongitude").setValue("");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    that.getView().byId("idLatitude").setValue(position.coords.latitude);
                    that.getView().byId("idLongitude").setValue(position.coords.longitude);
                    that.getView().byId("locationStatus").setText("Status: OK");
                }, function () {
                    that.getView().byId("locationStatus").setText("Status: ERROR");
                });
            } else {
                that.getView().byId("locationStatus").setText("Status: ERROR");
            }
        }
    });
});
