/* xpos & ypos approximately like CSS px
 * zdist is units in m.  Dfeault is 1cm.  Don't set below 0.5cm,
 * or you will hit the default near clipping plane on the camera.
 * (of course you can change that if you want...)
 * near	Camera frustum near clipping plane.	0.005
 * xscale - when default is 1,
 * object is scaled so that 1m takes up about 1cm on screen, 1:100 scale */
AFRAME.registerComponent('screen-display', {

  schema: {
    position: {type: 'string', default: "percent"},
    xpos: {type: 'number', default: 50},
    ypos: {type: 'number', default: 50},
    scale: {type: 'string', default: "percent"},
    keepaspect: {type: 'boolean', default: true},
    width: {type: 'number', default: 10},
    height: {type: 'number'},
    zscale: {type: 'number', default: 1},
    zdist: {type: 'number', default: 0.01},
  },

  init: function () {

  },

  update: function() {
    // Get screen size
    // See: https://www.w3schools.com/jsref/prop_win_innerheight.asp
    this.screenwidth = window.innerWidth ||
                       document.documentElement.clientWidth ||
                       document.body.clientWidth;

    this.screenheight = window.innerHeight ||
                        document.documentElement.clientHeight ||
                        document.body.clientHeight;

    // Set up position, based on configuration.
    switch (this.data.position) {
      case "percent":
        this.xpospercent = this.data.xpos;
        this.ypospercent = this.data.ypos;
        break;

      case "pixels":
        this.xpospercent = 100 * this.data.xpos / this.screenwidth;
        this.ypospercent = 100 * this.data.ypos / this.screenheight;
        break;

      default:
        console.log(`Unexpected Config: ${this.data.position}`);

    }

    // Set up scale, based on configuration.
    // Swt up height & width first.
    // Then rewrite height if we need to preserve aspect ratio.
    switch (this.data.scale) {
      case "percent":
        this.xscalepercent = this.data.width;
        this.yscalepercent = this.data.height;
        break;

      case "pixels":
        this.xscalepercent = 100 * this.data.width / this.screenwidth;
        this.yscalepercent = 100 * this.data.height / this.screenheight;
        break;

      default:
        console.warn(`Unexpected Config: ${this.data.position}`);
    }

    if (this.data.keepaspect) {
      // keep aspect ratio.
      // Set height based on width.
      this.yscalepercent = this.xscalepercent * this.screenwidth / this.screenheight;


      if (this.data.height) {
        console.warn(`Height being ignored, since "keepaspect" is set.`)
      }
    }

    // height of FOV at zdist in meters.
    // FOV is based on height, not width:
    // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera.fov
    // No idea why, but true FOV seems to be 59 degrees +/- from
    // Default FOV is supposed to be 80... ???
    var fovHeight = Math.tan(59  * Math.PI / 180) * this.data.zdist;
    var fovWidth = fovHeight * this.screenwidth / this.screenheight;

    // Now x position is (relPx from Center) / (width in Px) * fovWidth.
    // Similarly for y...
    //var x3DPos = xRelPx / this.width * fovWidth;
    //var y3DPos = yRelPx / this.height * fovHeight;
    var x3DPos = ((this.xpospercent / 100) - 0.5) * fovWidth;
    var y3DPos = (0.5 - (this.ypospercent / 100)) * fovHeight;

    this.el.object3D.position.set(x3DPos, y3DPos, -this.data.zdist)

    x3DScale = fovWidth * this.xscalepercent / 100
    y3DScale = fovHeight * this.yscalepercent / 100

    this.el.object3D.scale.set(x3DScale, y3DScale, this.data.zscale)
  },

  tick: function() {

    const screenwidth = window.innerWidth ||
                        document.documentElement.clientWidth ||
                        document.body.clientWidth;

    const screenheight = window.innerHeight ||
                         document.documentElement.clientHeight ||
                         document.body.clientHeight;

    if ((this.screenwidth !== screenwidth) ||
        (this.screenheight !== screenheight)) {
      this.update()
    }
  }

});
