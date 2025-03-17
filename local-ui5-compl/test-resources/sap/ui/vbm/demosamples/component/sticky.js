sap.ui.define([], function() {
    'use strict';

    function sticky_relocate() {
        var window_top = jQuery(window).scrollTop();
        var div_top = jQuery('#sticky-anchor').offset().top;
        if (window_top > (div_top ) ) {
            jQuery('.sticky').addClass('stick');
            jQuery('.sticky').removeClass('stay');
        } else {
            jQuery('.sticky').removeClass('stick');
            jQuery('.sticky').addClass('stay');
        }
    }
    
       
    jQuery(window).scroll(sticky_relocate);
    sticky_relocate();
    
});
