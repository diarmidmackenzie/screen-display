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

eval("__webpack_require__(/*! ../../src/blend-transforms */ \"../../src/blend-transforms.js\")\n\n//# sourceURL=webpack://aframe-blend-transforms/./index.js?");

/***/ }),

/***/ "../../src/blend-transforms.js":
/*!*************************************!*\
  !*** ../../src/blend-transforms.js ***!
  \*************************************/
/***/ (() => {

eval("AFRAME.registerComponent('blend-transforms', {\r\n\r\n  schema: {\r\n    objectA: {type: 'selector'},\r\n    objectB: {type: 'selector'},\r\n    percentage: {type: 'number', default: 0},\r\n  },\r\n\r\n  init() {\r\n    this.worldMatrixA = new THREE.Matrix4()\r\n    this.worldMatrixB = new THREE.Matrix4()\r\n    this.localMatrixA = new THREE.Matrix4()\r\n    this.localMatrixB = new THREE.Matrix4()\r\n    if (!this.data.objectA) {\r\n      console.log('Inherit Transform: ObjectA is null')\r\n    }\r\n    if (!this.data.objectB) {\r\n      console.log('Inherit Transform: ObjectB is null')\r\n    }\r\n    console.log(`Inherit Transform... A: ${this.data.objectA.id}, B: ${this.data.objectB.id}`)\r\n  },\r\n\r\n  update() {\r\n    this.alpha = this.data.percentage / 100\r\n    this.worldMatrixA.copy(this.data.objectA.object3D.matrixWorld)\r\n    this.worldMatrixB.copy(this.data.objectB.object3D.matrixWorld)\r\n\r\n    this.localMatrixA.copy(this.data.objectA.object3D.matrix)\r\n    this.localMatrixB.copy(this.data.objectB.object3D.matrix)\r\n\r\n    this.updateTransform()\r\n  },\r\n\r\n  updateTransform: (function () {\r\n    const vecA = new THREE.Vector3()\r\n    const vecB = new THREE.Vector3()\r\n    const quatA = new THREE.Quaternion()\r\n    const quatB = new THREE.Quaternion()\r\n    const parentMatrix = new THREE.Matrix4()\r\n\r\n    return function () {\r\n\r\n      // ensure the object is parented with the most suitable THREE.js object\r\n      // not this parent may not be the same as the DOM parent.\r\n      this.setMostSuitableParent()\r\n\r\n      // To apply world position, rotation etc.to an object, we need to have the inverse\r\n      // transform matrix of its parent\r\n      parentMatrix.copy(this.el.object3D.parent.matrixWorld)\r\n      parentMatrix.invert()\r\n\r\n      const object3DA = this.data.objectA.object3D\r\n      const object3DB = this.data.objectB.object3D\r\n\r\n      // Update Position, Scale and Quaternion as LERP / SLERP of world position,\r\n      // scale & quaternions.\r\n      object3DA.getWorldPosition(vecA)\r\n      object3DB.getWorldPosition(vecB)\r\n      this.el.object3D.position.lerpVectors(vecA,\r\n        vecB,\r\n        this.alpha)\r\n\r\n      object3DA.getWorldScale(vecA)\r\n      object3DB.getWorldScale(vecB)\r\n      this.el.object3D.scale.lerpVectors(vecA,\r\n        vecB,\r\n        this.alpha)\r\n\r\n      // This is the old version of the function - which matches current version\r\n      // of THREE.js in A-Frame.\r\n      object3DA.getWorldQuaternion(quatA)\r\n      object3DB.getWorldQuaternion(quatB)\r\n      THREE.Quaternion.slerp(quatA,\r\n        quatB,\r\n        this.el.object3D.quaternion,\r\n        this.alpha)\r\n\r\n      // now apply the inverse of the parent matrix to the object 3D.  This should ensure that the\r\n      // position, scale and quaternion applied above (which are all in world space) will\r\n      // manifest correctly when the object is generated beneath a parent.\r\n      this.el.object3D.applyMatrix4(parentMatrix)\r\n    }\r\n  }()),\r\n\r\n  // This function does not update positional data for the child to reflect the new parent.\r\n  // The calling function must take care of that - see e.g. updateTransform()\r\n  setMostSuitableParent() {\r\n\r\n    if (this.alpha <= 0.4) {\r\n      // parent should be A.\r\n\r\n      if (this.el.object3D.parent !== this.data.objectA.object3D.parent) {\r\n       // move object to have object A as parent\r\n       // note that removal from previous parent is automatic.\r\n       this.data.objectA.object3D.parent.add(this.el.object3D)\r\n      }\r\n    }\r\n\r\n\r\n    else if (this.alpha >= 0.6) {\r\n      // parent should be B.\r\n\r\n      if (this.el.object3D.parent !== this.data.objectB.object3D.parent) {\r\n       // move object to have object A as parent\r\n       // note that removal from previous parent is automatic.\r\n       this.data.objectB.object3D.parent.add(this.el.object3D)\r\n      }\r\n    }\r\n\r\n    // If we changed parent, the object position data will now be incorrect.\r\n    // The calling function must now sort this out.\r\n  },\r\n\r\n  tick(time, timeDelta) {\r\n    let update\r\n\r\n    // we update position is:\r\n    // alpha = 1 and object B has moved relative to parent\r\n    // alpha = 0 and object A has moved relative to parent\r\n    // 0 < alpha < 1 and either object has moved in world space.\r\n\r\n\r\n    if (this.alpha === 0) {\r\n      if (!this.localMatrixA.equals(this.data.objectA.object3D.matrix))\r\n        update = true;\r\n    }\r\n    else if (this.alpha === 1) {\r\n      if (!this.localMatrixB.equals(this.data.objectB.object3D.matrix)) {\r\n        update = true;\r\n      }\r\n    }\r\n    else {\r\n      // 0 < alpha < 1\r\n      this.data.objectA.object3D.updateMatrixWorld()\r\n      if (!this.worldMatrixA.equals(this.data.objectA.object3D.matrixWorld)) {\r\n        this.worldMatrixA.copy(this.data.objectA.object3D.matrixWorld)\r\n        update = true\r\n      }\r\n\r\n      this.data.objectB.object3D.updateMatrixWorld()\r\n      if (!this.worldMatrixB.equals(this.data.objectB.object3D.matrixWorld)) {\r\n        this.worldMatrixB.copy(this.data.objectB.object3D.matrixWorld)\r\n        update = true\r\n      }\r\n    }\r\n\r\n    if (update) {\r\n      this.updateTransform()\r\n    }\r\n  },\r\n});\r\n\n\n//# sourceURL=webpack://aframe-blend-transforms/../../src/blend-transforms.js?");

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