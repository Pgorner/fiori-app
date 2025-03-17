sap.ui.define([
    "sap/ui/base/Object",
    "./PayloadGenerator"
], function (BaseObject, PayloadGenerator) {
    'use strict';

    /**
         * Constructor for a new RectangularSelection.
         *
         * @class
         * Provides a class for doing Rectangular Selection on map.
         *
         * @private
         * @author SAP SE
         * @version 1.132.0
         * @alias sap.ui.vbm.vector.RectangularSelection
         */

    // Variable to hold the starting xy coordinates
    // when `mousedown` occured.
    let start;

    // Variable to hold the current xy coordinates
    // when `mousemove` or `mouseup` occurs.
    let current;

    // Variable for the draw box element.
    let box;
    const RectangularSelection = BaseObject.extend("sap.ui.vbm.vector.RectangularSelection", /** @lends sap.ui.vbm.vector.RectangularSelection.prototype */ {
        constructor: function (map) {
            BaseObject.call(this);
            this._map = map;
        },

        mouseDown(e, rPressed) {
            var map = this._map;
            const canvas = map.getCanvasContainer();
            // Continue the rest of the function if the R Key is pressed.
            if (!((rPressed) && (e.button === 0))) return;
            // Disable default drag zooming when the R key is pressed.
            map.dragPan.disable();

            // Call functions for the following events
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyDown);

            // Capture the first xy coordinates
            start = mousePos(e);

            function mousePos(e) {
                const rect = canvas.getBoundingClientRect();
                return new maplibregl.Point(
                    e.clientX - rect.left - canvas.clientLeft,
                    e.clientY - rect.top - canvas.clientTop
                );
            }
            function onMouseMove(e) {
                // Capture the ongoing xy coordinates
                current = mousePos(e);

                // Append the box element if it doesnt exist
                if (!box) {
                    box = document.createElement('div');
                    box.classList.add('boxdraw');
                    canvas.appendChild(box);
                }

                const minX = Math.min(start.x, current.x),
                    maxX = Math.max(start.x, current.x),
                    minY = Math.min(start.y, current.y),
                    maxY = Math.max(start.y, current.y);

                // Adjust width and xy position of the box element ongoing
                const pos = `translate(${minX}px, ${minY}px)`;
                box.style.transform = pos;
                box.style.width = maxX - minX + 'px';
                box.style.height = maxY - minY + 'px';
            }
            function onMouseUp(e) {
                // Capture xy coordinates
                finish([start, mousePos(e)]);
            }

            function onKeyDown(e) {
                // If the ESC key is pressed
                if (e.keyCode === 27) finish();
            }
            function finish(bbox) {
                // Remove these events now that finish has been called.
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('mouseup', onMouseUp);

                if (box) {
                    box.parentNode.removeChild(box);
                    box = null;
                }

                // If bbox exists. use this value as the argument for `queryRenderedFeatures`
                if (bbox) {
                    const features = map.queryRenderedFeatures(bbox, {
                        layers: ['geojson-source-route', 'geojson-source-point']
                    });
                    //Only trigger payload if something is selected
                    if (features && features.length > 0) {
                        // Trigger a payload for the selected features
                        PayloadGenerator.selectObjects(features);
                    }
                }

                map.dragPan.enable();

            }
        }
    });

    return RectangularSelection;
});