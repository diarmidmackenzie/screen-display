AFRAME.registerComponent('blend-transforms', {

  schema: {
    objectA: {type: 'selector'},
    objectB: {type: 'selector'},
    percentage: {type: 'number', default: 0},
  },

  init() {
    this.worldMatrixA = new THREE.Matrix4()
    this.worldMatrixB = new THREE.Matrix4()
    this.localMatrixA = new THREE.Matrix4()
    this.localMatrixB = new THREE.Matrix4()
    if (!this.data.objectA) {
      console.log('Inherit Transform: ObjectA is null')
    }
    if (!this.data.objectB) {
      console.log('Inherit Transform: ObjectB is null')
    }
    console.log(`Inherit Transform... A: ${this.data.objectA.id}, B: ${this.data.objectB.id}`)
  },

  update() {
    this.alpha = this.data.percentage / 100
    this.worldMatrixA.copy(this.data.objectA.object3D.matrixWorld)
    this.worldMatrixB.copy(this.data.objectB.object3D.matrixWorld)

    this.localMatrixA.copy(this.data.objectA.object3D.matrix)
    this.localMatrixB.copy(this.data.objectB.object3D.matrix)

    this.updateTransform()
  },

  updateTransform: (function () {
    const vecA = new THREE.Vector3()
    const vecB = new THREE.Vector3()
    const quatA = new THREE.Quaternion()
    const quatB = new THREE.Quaternion()
    const parentMatrix = new THREE.Matrix4()

    return function () {

      // ensure the object is parented with the most suitable THREE.js object
      // not this parent may not be the same as the DOM parent.
      this.setMostSuitableParent()

      // To apply world position, rotation etc.to an object, we need to have the inverse
      // transform matrix of its parent
      parentMatrix.copy(this.el.object3D.parent.matrixWorld)
      parentMatrix.invert()

      const object3DA = this.data.objectA.object3D
      const object3DB = this.data.objectB.object3D

      // Update Position, Scale and Quaternion as LERP / SLERP of world position,
      // scale & quaternions.
      object3DA.getWorldPosition(vecA)
      object3DB.getWorldPosition(vecB)
      this.el.object3D.position.lerpVectors(vecA,
        vecB,
        this.alpha)

      object3DA.getWorldScale(vecA)
      object3DB.getWorldScale(vecB)
      this.el.object3D.scale.lerpVectors(vecA,
        vecB,
        this.alpha)

      // This is the old version of the function - which matches current version
      // of THREE.js in A-Frame.
      object3DA.getWorldQuaternion(quatA)
      object3DB.getWorldQuaternion(quatB)
      THREE.Quaternion.slerp(quatA,
        quatB,
        this.el.object3D.quaternion,
        this.alpha)

      // now apply the inverse of the parent matrix to the object 3D.  This should ensure that the
      // position, scale and quaternion applied above (which are all in world space) will
      // manifest correctly when the object is generated beneath a parent.
      this.el.object3D.applyMatrix4(parentMatrix)
    }
  }()),

  // This function does not update positional data for the child to reflect the new parent.
  // The calling function must take care of that - see e.g. updateTransform()
  setMostSuitableParent() {

    if (this.alpha <= 0.4) {
      // parent should be A.

      if (this.el.object3D.parent !== this.data.objectA.object3D.parent) {
       // move object to have object A as parent
       // note that removal from previous parent is automatic.
       this.data.objectA.object3D.parent.add(this.el.object3D)
      }
    }


    else if (this.alpha >= 0.6) {
      // parent should be B.

      if (this.el.object3D.parent !== this.data.objectB.object3D.parent) {
       // move object to have object A as parent
       // note that removal from previous parent is automatic.
       this.data.objectB.object3D.parent.add(this.el.object3D)
      }
    }

    // If we changed parent, the object position data will now be incorrect.
    // The calling function must now sort this out.
  },

  tick(time, timeDelta) {
    let update

    // we update position is:
    // alpha = 1 and object B has moved relative to parent
    // alpha = 0 and object A has moved relative to parent
    // 0 < alpha < 1 and either object has moved in world space.


    if (this.alpha === 0) {
      if (!this.localMatrixA.equals(this.data.objectA.object3D.matrix))
        update = true;
    }
    else if (this.alpha === 1) {
      if (!this.localMatrixB.equals(this.data.objectB.object3D.matrix)) {
        update = true;
      }
    }
    else {
      // 0 < alpha < 1
      this.data.objectA.object3D.updateMatrixWorld()
      if (!this.worldMatrixA.equals(this.data.objectA.object3D.matrixWorld)) {
        this.worldMatrixA.copy(this.data.objectA.object3D.matrixWorld)
        update = true
      }

      this.data.objectB.object3D.updateMatrixWorld()
      if (!this.worldMatrixB.equals(this.data.objectB.object3D.matrixWorld)) {
        this.worldMatrixB.copy(this.data.objectB.object3D.matrixWorld)
        update = true
      }
    }

    if (update) {
      this.updateTransform()
    }
  },
});
