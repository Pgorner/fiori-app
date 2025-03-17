sap.ui.define([
    "sap/ui/base/Object",
    "./PayloadGenerator"
], function (BaseObject, PayloadGenerator) {
    'use strict';

    /**
         * Constructor for a new LassoSelection.
         *
         * @class
         * Provides a class for doing Lasso Selection on map.
         *
         * @private
         * @alias sap.ui.vbm.vector.LassoSelection
         */
    const LassoSelection = BaseObject.extend("sap.ui.vbm.vector.LassoSelection", {
        constructor: function (map) {
            BaseObject.call(this);
            this._map = map;
            this._coordinates = [];
        },

        mouseDown(e, aPressed) {
            const map = this._map;
            const canvas = map.getCanvasContainer();
            const lassoPolygon = createLassoSVG();

            if (!(aPressed && e.button === 0)) return;

            map.dragPan.disable();
            var that = this;
            this._coordinates = [mousePos(e)];

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyDown);

            function mousePos(e) {
                const rect = canvas.getBoundingClientRect();
                return new maplibregl.Point(
                    e.clientX - rect.left - canvas.clientLeft,
                    e.clientY - rect.top - canvas.clientTop
                );
            }

            function onMouseMove(e) {
                const point = mousePos(e);

                that._coordinates.push(point);

                updateLassoPath(lassoPolygon, that._coordinates);
            }

            function onMouseUp(e) {
                const selectedFeatures = finishLasso();
                // Only trigger payload if something is selected
                if (selectedFeatures && selectedFeatures.length > 0) {
                    PayloadGenerator.selectObjects(selectedFeatures);
                }
            }

            function onKeyDown(e) {
                if (e.keyCode === 27) finishLasso();
            }

            function updateLassoPath(polygon, coordinates) {
                let points = '';
                for (let i = 0; i < coordinates.length; i++) {
                    points += `${coordinates[i].x},${coordinates[i].y} `;
                }
                polygon.setAttribute("points", points.trim());
            }

            function finishLasso() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('mouseup', onMouseUp);

                // Remove the lasso
                lassoPolygon?.parentNode?.remove();

                // Convert lasso points to geographic coordinates
                const lassoGeoCoords = that._coordinates.map(point =>
                    that._map.unproject([point.x, point.y])
                );

                // Find the pixel bounding box for the lasso coordinates
                const bounds = that._coordinates.reduce((bbox, point) => {
                    bbox.minX = Math.min(bbox.minX, point.x);
                    bbox.minY = Math.min(bbox.minY, point.y);
                    bbox.maxX = Math.max(bbox.maxX, point.x);
                    bbox.maxY = Math.max(bbox.maxY, point.y);
                    return bbox;
                }, { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });

                // Create a pixel-based bounding box for queryRenderedFeatures
                const bbox = [
                    new maplibregl.Point(bounds.minX, bounds.minY),
                    new maplibregl.Point(bounds.maxX, bounds.maxY)
                ];

                // Query features within the pixel bounding box
                const candidates = that._map.queryRenderedFeatures(bbox, {
                    layers: ['geojson-source-route', 'geojson-source-point']
                });

                // Filter candidates by checking if they fall within the geographic lasso polygon
                const selectedFeatures = candidates.filter(feature => {
                    const coordinates = feature.geometry.coordinates;

                    if (feature.geometry.type === 'Point') {
                        // Handle points
                        return pointInPolygon(coordinates, lassoGeoCoords);
                    } else if (feature.geometry.type === 'LineString') {
                        // Handle lines by checking if any segment intersects the lasso polygon
                        return lineInPolygonOrIntersects(coordinates, lassoGeoCoords);
                    }
                    return false;
                });
                that._map.dragPan.enable();
                return selectedFeatures;
            }

            // Helper function to check if a point is inside the lasso polygon
            function pointInPolygon(point, polygon) {
                let inside = false;
                for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                    const xi = polygon[i].lng, yi = polygon[i].lat;
                    const xj = polygon[j].lng, yj = polygon[j].lat;

                    const intersect = ((yi > point[1]) !== (yj > point[1])) &&
                        (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }
                return inside;
            }

            function lineInPolygonOrIntersects(line, polygon) {
                // First, check if any point in the line is inside the polygon
                if (line.some(point => pointInPolygon(point, polygon))) {
                    return true;
                }

                // If no points are inside, check if any line segment intersects the polygon
                for (let i = 0; i < line.length - 1; i++) {
                    const lineStart = line[i];
                    const lineEnd = line[i + 1];

                    for (let j = 0; j < polygon.length - 1; j++) {
                        const polyStart = [polygon[j].lng, polygon[j].lat];
                        const polyEnd = [polygon[j + 1].lng, polygon[j + 1].lat];

                        if (segmentsIntersect(lineStart, lineEnd, polyStart, polyEnd)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            function segmentsIntersect(p1, p2, q1, q2) {
                const orientation = (p, q, r) => {
                    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
                    return val === 0 ? 0 : (val > 0 ? 1 : 2);
                };

                const o1 = orientation(p1, p2, q1);
                const o2 = orientation(p1, p2, q2);
                const o3 = orientation(q1, q2, p1);
                const o4 = orientation(q1, q2, p2);

                if (o1 !== o2 && o3 !== o4) return true;

                return false;
            }

            function createLassoSVG() {
                // Create the SVG namespace
                const svgNS = "http://www.w3.org/2000/svg";

                // Create the SVG element
                const svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute("class", "lasso-svg");
                svg.setAttribute("style", "position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;");

                // Create the polygon element for the lasso
                const polygon = document.createElementNS(svgNS, "polygon");
                polygon.setAttribute("style", "fill: rgba(205, 245, 255, 0.5); stroke: #000000; stroke-width: 2; stroke-dasharray: 1, 1;");

                // Append the polygon to the SVG
                svg.appendChild(polygon);

                // Append the SVG to the document, e.g., within the map container
                canvas.appendChild(svg);

                return polygon; // Return the polygon so we can update its points dynamically
            }
        }
    });

    return LassoSelection;
});
