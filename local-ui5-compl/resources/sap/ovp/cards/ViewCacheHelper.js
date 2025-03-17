/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/core/cache/CacheManager","sap/ui/core/Component","sap/ovp/app/OVPLogger"],function(e,r,n){"use strict";var a=new n("ovp.cards.ViewCacheHelper");function t(e){var n;while(e){var a=r.getOwnerComponentFor(e);if(a){e=n=a}else{if(e instanceof r){n=e}e=e.getParent&&e.getParent()}}return n}function o(e){var r=t(e);var n=r&&r.getMetadata().getName();var a=[n||window.location.host+window.location.pathname,e.getId().split("_Tab")[0]];var o=a.join("_");return Promise.resolve(o)}function i(r){return o(r).then(function(r){return e.delWithFilters({prefix:r})}).catch(function(e){a.error(e)})}return{clearViewCacheForTabbedCard:i}});
//# sourceMappingURL=ViewCacheHelper.js.map