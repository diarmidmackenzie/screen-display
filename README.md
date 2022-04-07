This README covers two A-Frame components:

- screen-display - used to position an object in a fixed position on screen
- blend-transforms - used to position an object with a weighted blend of two different objects' position, scale & rotation.

# screen-display

This component can be used to position elements directly on screen in A-Frame.

Given that every object in an A-Frame scene must exist in 3D space, this is in fact achieved by positioning the objects extremely close to the camera, and adjusting the scale and position appropriately.

This component does the hard work of figuring out what "appropriately" means, allowing you to specify a screen position in terms of a percentage of the total screen, or a number of CSS pixels.

It also allows flexibility in whether or not aspect ratios are preserved.  See "Component Interface" for more details.

## Status

This component is still under development.  Particular areas that still need work include:

- More examples to illustrate the full range of capabilities of the component interface.
- The component makes assumptions about some configurable attributes of the camera.   In particular the fov and zoom attributes are assumed to be set at their default values.  If these are changed, things won't adapt as we'd like.  Would be nice to fix that.
- And probably some more...

## Installation

You will need the screen-display javascript module from this repository.

You can download it and include it like this:

```
<script src="screen-display.js"></script>
```

Or via JSDelivr CDN

```
<script src="https://cdn.jsdelivr.net/gh/diarmidmackenzie/screen-display@latest/src/screen-display.min.js"></script>
```

## Usage Guidelines

This component should only be set on objects that are children of the scene's camera.

If you set it on other objects, it will move & scale the objects in unexpected ways, most likely rendering them invisible!

If you set the screen-display component on an object, *do not* set the position or scale attributes 

See the examples  for some examples of how to use the component, or read the detailed interface documentation below.

- [3D objects](https://diarmidmackenzie.github.io/screen-display/examples/example-3D-objects.html)
- [Position by percentage](https://diarmidmackenzie.github.io/screen-display/examples/example-percent.html)
- [Position by pixels](https://diarmidmackenzie.github.io/screen-display/examples/example-pixels.html)
- [Animation](https://diarmidmackenzie.github.io/screen-display/examples/example-animation.html)

## Component Interface

The following attributes are supported on the screen-display component:

- position: The type of position information supplied.  Set to either "percent" to set a percentage of the screen, or "pixels" for a number of pixels.  Default is "percent"

- xpos: The x screen position of the center of the object.  In "percent" mode, 0 is the far left of the screen, 100 is the far right.  In "pixels" mode, 0 is the far left of the screen, and the far right of the screen will be the width of the screen in CSS pixels.  Typically 360 on a Mobile device.

- ypos: The y screen position of the center of the object.  In "percent" mode, 0 is the top of the screen, 100 is the bottom.  In "pixels" mode, 0 is the top of the screen, and the bottom of the screen will be the height of the screen in CSS pixels.  Typically 640 on a Mobile device.

- scale: The type of scale information supplied.  Set to either "percent" to set a percentage of the screen, or "pixels" for a number of pixels.  Default is "percent".

- keepaspect: Whether to preserve the x/y aspect ratio of the object.  If this is set, then "height" is ignored, and determined by a combination of "width" and the aspect ratio.  Default is: true.

- width: The screen width taken up by 1m of object width.  In "percent" mode, this is the proportion of the screen width that should be taken up by 1m of object width.  In "pixels" mode, this is the width of 1m of object width, in CSS pixels.  Default value: 10 (percent)

- height: The screen height taken up by 1m of object height.  In "percent" mode, this is the proportion of the screen height that should be taken up by 1m of object height.  In "pixels" mode, this is the height of 1m of object height in CSS pixels.  This attribute is ignored if "keepaspect" is set to true.  No default value (by default, "keepaspect" is true), but if "keepaspect" is false a value must be supplied, or the object will have no height.

- zscale: The percentage of the distance from the camera to the object taken up by 1m of the object.  If "keepaspect" is set, this is ignored, and the object depth is just scaled in line with x and y.  If this is set to 100, then a 1m x 1m x 1m object will fill 50% of the distance from the camera to the object position.  With the default values for zdist and camera "near" attribute, this will lead to parts of the shape disappearing as they pass the near clipping plane of the camera frustrum.  To avoid this, increase zdist, reduce the "near" attribute on the camera, or simply reduce the depth of the object (i.e. reduce zscale).  No default value (by default, "keepaspect" is true), but if "keepaspect" is false a value must be supplied, or the object will have no depth.

- zdist: The distance from the camera at which the object should be rendered.  The default value of 0.01 (i.e. 1cm) should be fine for most purposes.  Do not set this below 0.005 (5mm) without also adjusting the "near" attribute on the camera, which sets the near clipping plane of the camera frustrum, or objects will mysteriously disappear due to frustrum culling.  See: https://aframe.io/docs/1.2.0/components/camera.html#properties_near


## Other Notes

By default, the A-Frame text component positions text 1mm (0.001m in front of the parent object), which in most cases gives the appearance of text directly positioned on the object.

See: https://aframe.io/docs/1.2.0/primitives/a-text.html#attributes_z_offset

For objects that are very close to the camera, this 1mm becomes visible, and can make the text look incorrectly positioned.

To workaround this, set the zOffset attribute on the text component to a much smaller value (e.g. 0.000001).

See the examples folder for some examples of this.



# blend-transforms

This is a companion component to screen-display, which supports giving an object a transform (i.e. position, rotation & scale) that is a weighted blend of two different object transforms (we call these "anchors")

The can be used in combination with the animation component to smoothly move objects from a position on screen to a position in the 3D world, and vice-versa.

See examples:

- [From screen to 3D world](https://diarmidmackenzie.github.io/screen-display/examples/example-transform.html)
- [From 3D world to screen](https://diarmidmackenzie.github.io/screen-display/examples/example-transform-reverse.html)

## Status

This component is pretty new.  It has been used in one application and performed well, but may hit problems in novel situations.

It explicitly can handle:

- Working in combination with screen-display for AR applications.
- Movement of the anchor objects whose transform is blended - the object that blends their transforms will dynamically update its own transform in response to these movements.

Currently, scale, position & rotation are all controlled by a single parameter - more flexibility may be desirable in future - see "Other Notes" below for an explanation why.

## Installation

You will need the screen-display javascript module from this repository.

You can download it and include it like this:

```
<script src="blend-transforms.js"></script>
```

Or via JSDelivr CDN

```
<script src="https://cdn.jsdelivr.net/gh/diarmidmackenzie/screen-display@latest/src/blend-transforms.min.js"></script>
```

## Usage Guidelines

See the examples folder for some examples of how to use the component, including examples of how to combine it with the animation component.

Typically, you will set up two invisible anchor objects, and then refer to them from the component that you wish to position with a blend of their transforms.

## Component Interface

The following attributes are supported on the blend-transforms component:

- objectA: A selector for the first object whose transform is to be blended.
- objectB: A selector for the second object whose transform is to be blended.
- percentage: The percentage of the transform to be taken from object B.  The remaining percentage will be taken from Object A.  The default value is 0, which will lead to the object being positioned at the position of object A.  When this is set to 100, the object will be positioned at the position of object B.

## Other Notes

Position, scale and rotation are all weighted linearly, using the configured percentage.

This may lead to unexpected behaviour when using this component in combination with screen-display.  Although the object may be moving linearly in space, if it starts far from the camera, and ends up close to it, then it may appear to be moving slowly at the start, and very fast at the end.

This effect can be compensates for by using a non-linear easing function in the animation (e.g. quadratic or cubic).  However, while that might "correct"the apparent rate of positional change, it will also make the rotation speed non-linear, which may look odd.

In future, I hope to to enhance this component to allow options for independent control of each of rotation, position and scale.

