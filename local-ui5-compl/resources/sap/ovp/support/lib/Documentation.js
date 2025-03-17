/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/m/library","sap/ui/VersionInfo"],function(e,n){"use strict";var t="https://ui5.sap.com/";var r="03265b0408e2432c9571d6b3feb6b1fd";function i(){return n.load().then(function(e){var n=e.version;if(n.indexOf("-SNAPSHOT")!==-1){return t+"#/topic/"+r}else{return t+n+"/#/topic/"+r}})}function o(){i().then(function(n){e.URLHelper.redirect(n,true)})}return{getDocuURL:i,openDocumentation:o}});
//# sourceMappingURL=Documentation.js.map