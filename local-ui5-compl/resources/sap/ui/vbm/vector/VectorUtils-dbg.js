
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Lib"
], function (BaseObject, Lib) {
    'use strict';

    const VectorUtils = BaseObject.extend("sap.ui.vbm.vector.VectorUtils", /** @lends sap.ui.vbm.vector.VectorUtils.prototype */ {
    });
    VectorUtils.createMap = (geoJSON, map_container) => {

        return new maplibregl.Map({
            container: map_container,
            renderWorldCopies: false,
            attributionControl: false,
            dragRotate: false,
            touchZoomRotate: false,
            style: geoJSON[0].provider,
            center: geoJSON[0].center,
            zoom: geoJSON[0].zoom,
            // Use transformRequest to modify requests for specific maps
            transformRequest: (url, resourceType) => {
                // Add the headers only for the specific types of requests
                if (Object.keys(geoJSON[0].header).length != 0) {
                    return {
                        url: url,
                        headers: geoJSON[0].header // Add the header
                    };
                } else {

                    return { url: url }; // For other maps, use the default request
                }
            }
        });
    };

    VectorUtils.createSpotElement = (marker) => {
        // create a DOM element for the marker (parent div)
        const el = document.createElement('div');

        // Set background image for the marker
        var base64decoded = "data:image/png;base64," + marker.properties.base64;
        el.style.backgroundImage = `url(${base64decoded})`;
        el.style.width = marker.properties.width;
        el.style.height = marker.properties.height;
        el.style.backgroundSize = 'cover'; // Ensure image fits
        return el;
    };

    VectorUtils.createIconElement = (Icon) => {
        const child_el = document.createElement('div');
        child_el.className = 'marker';
        child_el.style.position = 'absolute';  // Position it absolutely inside the parent
        child_el.style.top = '30%';  // Adjust positioning
        child_el.style.left = '50%';
        child_el.style.transform = 'translate(-50%, -50%)'; // Center the icon
        child_el.style.fontFamily = 'SAP-icons';
        child_el.style.fontSize = '20px';  // Adjust size as needed
        var iconInfo = sap.ui.core.IconPool.getIconInfo(Icon);
        child_el.innerHTML = iconInfo.content;
        return child_el;
    }

    VectorUtils.createDropdownMenu = (menuData) => {
        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');

        const menuContainer = document.createElement('div');
        menuContainer.classList.add('dropdown-content');


        function createMenu(items) {
            const ul = document.createElement('ul');
            if (Array.isArray(items)) {
                items.forEach(items => {
                    const li = document.createElement('li');
                    li.textContent = items.text;



                    if (items.MenuItem) {
                        const submenu = createMenu(items.MenuItem);
                        submenu.style.display = 'none'; // Hide submenu initially
                        submenu.style.position = 'absolute'; // Position it absolutely
                        submenu.style.left = '100%'; // Position submenu to the right of the parent
                        submenu.style.top = '0'; // Align to the top of the parent
                        submenu.style.backgroundColor = 'white';
                        submenu.style.display = 'none'; // Hide submenu initially
                        li.appendChild(submenu);
                        // Keep submenu open on hover
                        li.addEventListener('mouseenter', () => {
                            submenu.style.display = 'block'; // Show submenu on hover
                        });
                        // Toggle submenu visibility on click
                        li.addEventListener('click', (event) => {
                            event.stopPropagation(); // Prevent click event from propagating
                            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';

                            // Close other submenus
                            document.querySelectorAll('.dropdown-content ul').forEach(sub => {
                                if (sub !== submenu) {
                                    sub.style.display = 'none';
                                }
                            });
                        });
                    }

                    ul.appendChild(li);
                });
            }
            return ul;

        }
        const mainMenu = createMenu(menuData.MenuItem);
        menuContainer.appendChild(mainMenu);
        dropdown.appendChild(menuContainer);

        // Hide menu when clicking outside
        document.addEventListener('click', () => {
            menuContainer.style.display = 'none';
            // Hide all submenus
            menuContainer.querySelectorAll('ul').forEach(sub => {
                sub.style.display = 'none';
            });
        });
        // Toggle main dropdown visibility
        dropdown.addEventListener('mouseenter', () => {
            dropdown.style.display = 'block';
        });
        // Add dropdown to the body
        document.body.appendChild(dropdown);

        return dropdown;
    };

    // Method to format the coordinates
    VectorUtils.formatCoordinates = (coords) => {
        return `${coords.lng};${coords.lat};0.0`;
    };

    // Method to create detail window
    VectorUtils.createDetailWindowContainer = (details) => {

        // create the detail frame................................................//
        const windowContainer = document.createElement('div');
        windowContainer.setAttribute("role", sap.ui.core.AccessibleRole.Secondary);
        windowContainer.style.left = "0px";
        windowContainer.style.top = "0px";

        // ask whether phone or not
        var bPhone = VBI.m_bIsPhone;
        // add the size of the decorators.........................................//
        if (!bPhone) {
            var paddingDesktop = 16;
            var spacingDesktop = 16;
            var headerFontSize = 16;
            paddingDesktop = VBI.Utilities.RemToPixel(1);
            spacingDesktop = VBI.Utilities.RemToPixel(1);
            headerFontSize = VBI.Utilities.RemToPixel(1);
            if (details.width) {
                windowContainer.style.width = parseInt(details.width) + 2 * paddingDesktop + "px";
            }
            if (details.height) {
                windowContainer.style.minHeight = parseInt(details.height) + headerFontSize + 4 + spacingDesktop + 2 * paddingDesktop + "px";
            }
        } else {
            var paddingPhone = 12;
            var spacingPhone = 6;
            var headerFontSizePhone = 14;
            paddingPhone = VBI.Utilities.RemToPixel(0.750);
            spacingPhone = VBI.Utilities.RemToPixel(0.375);
            headerFontSizePhone = VBI.Utilities.RemToPixel(0.875);

            if (details.height) {
                windowContainer.style.minHeight = details.height + headerFontSizePhone + 4 + spacingPhone + 2 * paddingPhone + "px";
            }
        }

        windowContainer.className = "vbi-detail vbi-detail-border";


        // create the header,.....................................................//
        const header = document.createElement('div');
        header.setAttribute("role", sap.ui.core.AccessibleRole.Heading);
        header.className = "vbi-detail-header";
        windowContainer.appendChild(header);

        // create the title......................................................//
        const title = document.createElement('div');
        title.setAttribute("role", sap.ui.core.AccessibleRole.Heading);
        title.className = "vbi-detail-title";
        title.innerText = details.caption;
        header.appendChild(title);
        if (details.caption && details.caption !== '') {
            this._upperElementExists = true;
        }

        // create the close.......................................................//
        var close = document.createElement('div');
        close.setAttribute("role", sap.ui.core.AccessibleRole.Button);
        // ensures the library is loaded
        Lib.load({ name: "sap.ui.vbm.i18n" });
        // ResourceBundle can be retrieved
        var oResourceBundle = Lib.getResourceBundleFor("sap.ui.vbm.i18n")
        close.title = oResourceBundle.getText("WINDOW_CLOSE");
        close.setAttribute("aria-label", oResourceBundle.getText("WINDOW_CLOSE"));
        close.className = "vbi-detail-closebutton vbi-detail-closebutton-" + (VBI.m_bIsMobile ? "tablet" : "desktop");
        close.addEventListener('click', function () { VBI.MapRenderer.closePopup() });
        header.appendChild(close);

        // set arrows.............................................................//
        const newB = document.createElement('b');
        newB.setAttribute("role", sap.ui.core.AccessibleRole.Presentation);
        newB.className = "vbi-detail-arrow vbi-detail-left vbi-detail-border-arrow";
        if (!bPhone) {
            windowContainer.appendChild(newB);
        }

        const newBArrow = document.createElement('b');
        newBArrow.setAttribute("role", sap.ui.core.AccessibleRole.Presentation);
        newBArrow.className = "vbi-detail-arrow vbi-detail-left";
        if (!bPhone) {
            windowContainer.appendChild(newBArrow);
        }

        return windowContainer;
    };
    VectorUtils.createSubCaption = (item) => {
        const obj = document.createElement('div');
        obj.setAttribute("role", sap.ui.core.AccessibleRole.Secondary);
        obj.className = "vbi-2d-caption vbi-2d-common";
        obj.innerText = item.text;
        obj.style.left = item.left + "px";
        if (this._upperElementExists) {
            obj.style.marginTop = item.top + "px";
        } else {
            obj.style.top = item.top + "px";
        }
        obj.style.marginLeft = "15px";
        obj.style.width = (item.right - item.left).toString() + "px";
        obj.style.height = (item.bottom - item.top).toString() + "px";
        obj.style.textAlign = VBI.Utilities.Align[item.align];
        if (item.level === "3") {
            obj.classList.add('sapUiVbmDetailWindowCaption3');
        }
        this._upperElementExists = true;
        return obj;
    };
    VectorUtils.createLabel = (item, data) => {
        const obj = document.createElement('div');
        obj.setAttribute("role", sap.ui.core.AccessibleRole.Description);
        obj.style.left = item.left + "px";
        if (this._upperElementExists) {
            obj.style.marginTop = item.top + "px";
        } else {
            obj.style.top = item.top + "px";
        }
        obj.style.marginLeft = "15px";
        obj.style.width = (item.right - item.left).toString() + "px";
        obj.style.height = (item.bottom - item.top).toString() + "px";
        obj.style.textAlign = VBI.Utilities.Align[item.align];
        obj.style.title = item.tooltip;
        obj.className = "vbi-2d-label vbi-2d-common";
        obj.innerText = getTextFromData(item["text.bind"], data); // Function to bind text from data
        this._upperElementExists = true;
        return obj;
    };

    VectorUtils.createLink = (item) => {
        const obj = document.createElement('a');
        obj.setAttribute("role", sap.ui.core.AccessibleRole.Link);
        obj.style.left = item.left + "px";
        if (this._upperElementExists) {
            obj.style.marginTop = item.top + "px";
        } else {
            obj.style.top = item.top + "px";
        }
        obj.style.marginLeft = "15px";
        obj.style.width = (item.right - item.left).toString() + "px";
        obj.style.height = (item.bottom - item.top).toString() + "px";
        obj.style.textAlign = VBI.Utilities.Align[item.align];
        obj.innerText = item.text;
        obj.className = "vbi-2d-link vbi-2d-common";
        obj.href = item.href ? item.href : "javascrip" + "t:void(0)"; // separated to fool ESLint
        obj.title = item.tooltip;
        this._upperElementExists = true;
        return obj;
    };

    VectorUtils.createImage = (item, defaultbase64, resourceMap) => {
        const obj = document.createElement('img');
        if (item.image && item.image !== "") {
            obj.setAttribute("role", sap.ui.core.AccessibleRole.Img);
            obj.style.left = item.left + "px";
            if (this._upperElementExists) {
                obj.style.marginTop = item.top + "px";
            } else {
                obj.style.top = item.top + "px";
            }
            obj.style.marginLeft = "15px";
            obj.style.width = (item.right - item.left).toString() + "px";
            obj.style.height = (item.bottom - item.top).toString() + "px";
            obj.style.textAlign = VBI.Utilities.Align[item.align];
            obj.className = "vbi-2d-image vbi-2d-common";
            obj.title = item.tooltip;
            if (item.image === "@01@") {    //Default pin
                obj.src = getImageUrl(defaultbase64);
            } else {
                obj.src = getImageUrl(resourceMap.get(item.image)); // Function to handle image URLs
            }

        }
        this._upperElementExists = true;
        return obj;
    };

    VectorUtils.createButton = (item, actions) => {
        const obj = document.createElement('button');
        obj.style.left = item.left + "px";
        if (this._upperElementExists) {
            obj.style.marginTop = item.top + "px";
        } else {
            obj.style.top = item.top + "px";
        }
        obj.style.marginLeft = "15px";
        obj.style.width = (item.right - item.left).toString() + "px";
        obj.style.height = (item.bottom - item.top).toString() + "px";
        obj.style.textAlign = VBI.Utilities.Align[item.align];
        obj.className = "vbi-2d-button vbi-2d-common";
        obj.title = item.tooltip;
        obj.innerText = item.text;
        obj.onclick = () => handleAction(item.id, actions); // Bind click event
        this._upperElementExists = true;
        return obj;
    };

    VectorUtils.argbToRgba = (argbString) => {

        // Remove "ARGB(" and ")" from the string and split the values by commas
        let argbValues = argbString.replace('ARGB(', '').replace(')', '').split(',');

        // Parse the values as integers
        let alpha = parseInt(argbValues[0].trim(), 10);
        let red = parseInt(argbValues[1].trim(), 10);
        let green = parseInt(argbValues[2].trim(), 10);
        let blue = parseInt(argbValues[3].trim(), 10);

        // Convert alpha from 0-255 range to 0-1 range
        let alphaDecimal = alpha / 255;

        // Return the RGBA string
        return `rgba(${red}, ${green}, ${blue}, ${alphaDecimal.toFixed(2)})`;
    };

    VectorUtils.getArrowHead = (callback) => {
        const svgArrow = `
        <svg fill="currentColor" width="60px" height="60px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g data-name="Layer 2">
                <g data-name="arrow-right">
                    <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/>
                    <path d="M10.46 18a2.23 2.23 0 0 1-.91-.2 1.76 1.76 0 0 1-1.05-1.59V7.79A1.76 1.76 0 0 1 9.55 6.2a2.1 2.1 0 0 1 2.21.26l5.1 4.21a1.7 1.7 0 0 1 0 2.66l-5.1 4.21a2.06 2.06 0 0 1-1.3.46z"/>
                </g>
            </g>
        </svg>`;

        const base64 = `data:image/svg+xml;base64,${btoa(svgArrow)}`;
        const img = new Image();
        img.src = base64;
        img.onload = () => callback(img);
    };

    VectorUtils.normalizeAngle = (angle) => {
        return (angle + 360) % 360;
    };

    // Function to calculate the bearing between two points
    VectorUtils.calculateBearing = (start, end) => {
        const lat1 = toRadians(start[1]);
        const lat2 = toRadians(end[1]);
        const dLon = toRadians(end[0] - start[0]);

        const x = Math.cos(lat2) * Math.sin(dLon);
        const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

        const initialBearing = Math.atan2(x, y);
        return VectorUtils.normalizeAngle(toDegrees(initialBearing)); // Normalize to 0-360 degrees
    };


    // Helper functions

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function toDegrees(radians) {
        return radians * 180 / Math.PI;
    }
    function getTextFromData(binding, data) {
        const keys = binding.split('.').slice(1); // Split binding path
        let value = data[keys[2]].T; // Start with the data object
        return value ? value : ''; // Return the text value
    }

    function getImageUrl(imageReference) {
        // Resolve image URLs
        return "data:text/plain;base64," + imageReference
    }

    function handleAction(actionId, actions) {
        const action = actions.find(action => action.id === actionId);
        if (action) {
            console.log("Performing action:", action.Action.name);
            // Implement the action logic here, e.g., triggering an event or action
        }
    }
    function GetEventVPCoords(event, map_container) {
        // returns the relative pixel coordinates to the viewport of the.......//
        // provided event......................................................//
        if (!event) {
            return [
                0, 0
            ];
        }

        var rect = GetInternalDivClientRect(map_container);
        if (VBI.m_bIsRtl) {
            return [
                rect.right - event.clientX, event.clientY - rect.top
            ];

        } else {
            return [
                event.clientX - rect.left, event.clientY - rect.top
            ];
        }
    };



    VectorUtils.GetEventVPCoordsObj = (event, map_container) => {
        // returns the view port coordinates in an object......................//
        var pos = GetEventVPCoords(event, map_container);
        return {
            x: pos[0].toString(),
            y: pos[1].toString()
        };
    };

    VectorUtils.GetEventDropObjWithScene = (event) => {
        return {
            //	strSource: scene.m_DragInfo.strScene + "|" + scene.m_DragInfo.strID + "|" + scene.m_DragInfo.strInstance,
            //		scene: scene.m_ID
        };

    };
    function GetInternalDivClientRect(map_container) {
        // Assuming your map is initialized on an element with the ID 'map'
        const mapContainer = document.getElementById(map_container);

        // Get the bounding rectangle
        const rect = mapContainer.getBoundingClientRect();
        return rect;
    };

    return VectorUtils;

});


