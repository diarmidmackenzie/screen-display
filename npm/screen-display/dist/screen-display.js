/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("__webpack_require__(/*! ../../src/screen-display */ \"../../src/screen-display.js\")\r\n\n\n//# sourceURL=webpack://aframe-screen-display/./index.js?");

/***/ }),

/***/ "../../src/screen-display.js":
/*!***********************************!*\
  !*** ../../src/screen-display.js ***!
  \***********************************/
/***/ (() => {

eval("/* xpos & ypos approximately like CSS px\r\n * zdist is units in m.  Dfeault is 1cm.  Don't set below 0.5cm,\r\n * or you will hit the default near clipping plane on the camera.\r\n * (of course you can change that if you want...)\r\n * near\tCamera frustum near clipping plane.\t0.005\r\n * xscale - when default is 1,\r\n * object is scaled so that 1m takes up about 1cm on screen, 1:100 scale */\r\nAFRAME.registerComponent('screen-display', {\r\n\r\n  schema: {\r\n    position: {type: 'string', default: \"percent\"},\r\n    xpos: {type: 'number', default: 50},\r\n    ypos: {type: 'number', default: 50},\r\n    scale: {type: 'string', default: \"percent\"},\r\n    keepaspect: {type: 'boolean', default: true},\r\n    width: {type: 'number', default: 10},\r\n    height: {type: 'number'},\r\n    zscale: {type: 'number'},\r\n    zdist: {type: 'number', default: 0.01},\r\n  },\r\n\r\n  update: function() {\r\n    // Get screen size\r\n    // See: https://www.w3schools.com/jsref/prop_win_innerheight.asp\r\n    this.screenwidth = window.innerWidth ||\r\n                       document.documentElement.clientWidth ||\r\n                       document.body.clientWidth;\r\n\r\n    this.screenheight = window.innerHeight ||\r\n                        document.documentElement.clientHeight ||\r\n                        document.body.clientHeight;\r\n\r\n    // Set up position, based on configuration.\r\n    switch (this.data.position) {\r\n      case \"percent\":\r\n        this.xpospercent = this.data.xpos;\r\n        this.ypospercent = this.data.ypos;\r\n        break;\r\n\r\n      case \"pixels\":\r\n        this.xpospercent = 100 * this.data.xpos / this.screenwidth;\r\n        this.ypospercent = 100 * this.data.ypos / this.screenheight;\r\n        break;\r\n\r\n      default:\r\n        console.log(`Unexpected Config: ${this.data.position}`);\r\n\r\n    }\r\n\r\n    // Set up scale, based on configuration.\r\n    // Swt up height & width first.\r\n    // Then rewrite height if we need to preserve aspect ratio.\r\n    switch (this.data.scale) {\r\n      case \"percent\":\r\n        this.xscalepercent = this.data.width;\r\n        this.yscalepercent = this.data.height;\r\n        break;\r\n\r\n      case \"pixels\":\r\n        this.xscalepercent = 100 * this.data.width / this.screenwidth;\r\n        this.yscalepercent = 100 * this.data.height / this.screenheight;\r\n        break;\r\n\r\n      default:\r\n        console.warn(`Unexpected Config: ${this.data.position}`);\r\n    }\r\n\r\n    if (this.data.keepaspect) {\r\n      // keep aspect ratio.\r\n      // Set height based on width.\r\n      this.yscalepercent = this.xscalepercent * this.screenwidth / this.screenheight;\r\n\r\n      if (this.data.height) {\r\n        console.warn(`Height being ignored, since \"keepaspect\" is set.`)\r\n      }\r\n    }\r\n    else\r\n    {\r\n      if (!this.data.height) {\r\n        console.warn(`\"keepaspect\" is not set, so height is required, but none provided.`)\r\n      }\r\n    }\r\n\r\n    // height of FOV at zdist in meters.\r\n    // FOV is based on height, not width:\r\n    // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov\r\n    // No idea why, but true FOV seems to be 59 degrees +/- from\r\n    // Default FOV is supposed to be 80... ???\r\n    var fovHeight = Math.tan(59  * Math.PI / 180) * this.data.zdist;\r\n    var fovWidth = fovHeight * this.screenwidth / this.screenheight;\r\n\r\n    // Now x position is (relPx from Center) / (width in Px) * fovWidth.\r\n    // Similarly for y...\r\n    //var x3DPos = xRelPx / this.width * fovWidth;\r\n    //var y3DPos = yRelPx / this.height * fovHeight;\r\n    var x3DPos = ((this.xpospercent / 100) - 0.5) * fovWidth;\r\n    var y3DPos = (0.5 - (this.ypospercent / 100)) * fovHeight;\r\n\r\n    this.el.object3D.position.set(x3DPos, y3DPos, -this.data.zdist)\r\n\r\n    const x3DScale = fovWidth * this.xscalepercent / 100\r\n    const y3DScale = fovHeight * this.yscalepercent / 100\r\n\r\n    // zscale value depends whether keepaspect is set.\r\n    // if it is not set, zscale parameter provides the percentage of the z-distance\r\n    // to be used as the depth of the object.\r\n    var z3DScale = this.data.zscale * this.data.zdist / 100;\r\n    if (this.data.keepaspect) {\r\n      z3DScale = x3DScale;\r\n    }\r\n    else if (!this.data.zscale) {\r\n      console.warn(`\"keepaspect\" is not set, so zscale is required, but none provided.`)\r\n    }\r\n\r\n    this.el.object3D.scale.set(x3DScale, y3DScale, z3DScale)\r\n  },\r\n\r\n  tick: function() {\r\n\r\n    const screenwidth = window.innerWidth ||\r\n                        document.documentElement.clientWidth ||\r\n                        document.body.clientWidth;\r\n\r\n    const screenheight = window.innerHeight ||\r\n                         document.documentElement.clientHeight ||\r\n                         document.body.clientHeight;\r\n\r\n    if ((this.screenwidth !== screenwidth) ||\r\n        (this.screenheight !== screenheight)) {\r\n      this.update()\r\n    }\r\n  }\r\n\r\n});\r\n\r\n/* Workarounds for the fact that the \"event-set\" components\r\n * cannot set properties on components that include dashes\r\n * in their names.  See: https://github.com/supermedium/superframe/issues/296\r\n * This component wraps up the screeen-display component\r\n * in a new component with no dashes in its name.  */\r\nAFRAME.registerComponent('screendisplay', {\r\n\r\n  schema : {\r\n    position: {type: 'string', default: \"percent\"},\r\n    xpos: {type: 'number', default: 50},\r\n    ypos: {type: 'number', default: 50},\r\n    scale: {type: 'string', default: \"percent\"},\r\n    keepaspect: {type: 'boolean', default: true},\r\n    width: {type: 'number', default: 10},\r\n    height: {type: 'number'},\r\n    zscale: {type: 'number'},\r\n    zdist: {type: 'number', default: 0.01},\r\n  },\r\n\r\n  update: function () {\r\n    this.el.setAttribute(\"screen-display\",\r\n                          {position: this.data.position,\r\n                           xpos: this.data.xpos,\r\n                           ypos: this.data.ypos,\r\n                           scale: this.data.scale,\r\n                           keepaspect: this.data.keepaspect,\r\n                           width: this.data.width,\r\n                           height: this.data.height,\r\n                           zscale: this.data.zscale,\r\n                           zdist: this.data.zdist});\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://aframe-screen-display/../../src/screen-display.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;