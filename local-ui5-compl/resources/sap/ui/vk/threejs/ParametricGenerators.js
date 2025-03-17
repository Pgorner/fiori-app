/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["../thirdparty/three"],function(e){"use strict";var n={generateSphere:function(n,t){var r=new e.SphereGeometry(n.radius,32,32);var a=new e.Mesh(r,t||undefined);a.name="sphere";return a},generateBox:function(n,t){const r=new e.Mesh(new e.BoxGeometry(n.width,n.length,n.height),t||undefined);r.name="box";return r},generatePlane:function(n,t){var r=new e.PlaneGeometry(n.length,n.width);var a=new e.Mesh(r,t||undefined);a.name="plane";a.rotation.x=Math.PI/2;a.position.set(-n.length/2,-n.width/2,0);return a}};return n});
//# sourceMappingURL=ParametricGenerators.js.map