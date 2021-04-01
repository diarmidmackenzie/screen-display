# screen-display
This component can be used to position elements directly on screen in A-Frame.

Given that every object in an A-Frame scene must exist in 3D space, this is in fact achieved by positioning the objects extremely close to the camera, and adjusting the scale and position appropriately.

This component does the hard work of figuring out what "appropriately" means, allowing you to specify a screen position in terms of a percentage of the total screen, or a number of CSS pixels.

It also allows flexibility in whether or not aspect ratios are preserved.  See "Component Interface" for more details.



## Status

This component is still under development.  Particular areas that still need work include:

- More examples to illustrate the full range of capabilities of the component interface.
- More testing (and probably bug fixing!)  especially on mobile devices (only tested on desktop so far)
- The component makes assumptions about some configurable attributes of the camera.   In particular the fov and zoom attributes are assumed to be set at their default values.  If these are changed, things won't adapt as we'd like.  Would be nice to fix that.
- A better story on z-axis scaling.  Probably we should extend "keepaspect" function to the z-axis, but exactly how we do this needs some thought
- Testing in real-world applications that want to use this component, to see whether the provided interface is useful, and meets requirements.
- Positions of elements are not adjusted when screen dimensions change.  That is something that could be added.
- And probably some more...



## Installation

You will need the screen-display javascript module from this repository.

You can download it and include it like this:

```
<script src="screen-display.js"></script>
```

Or via JSDelivr CDN

```
<script src="https://cdn.jsdelivr.net/gh/diarmidmackenzie/instanced-mesh@latest/src/screen-display.min.js"></script>
```

## Usage Guidelines

This component should only be set on objects that are children of the scene's camera.

If you set it on other objects, it will move & scale the objects in unexpected ways, most likely rendering them invisible!

If you set the screen-display component on an object, *do not* set the position or scale attributes 

See the examples folder for some examples of how to use the component, or read the detailed interface documentation below.



## Component Interface

The following attributes are supported on the screen-display component:

- position: The type of position information supplied.  Set to either "percent" to set a percentage of the screen, or "pixels" for a number of pixels.  Default is "percent"

- xpos: The x screen position of the center of the object.  In "percent" mode, 0 is the far left of the screen, 100 is the far right.  In "pixels" mode, 0 is the far left of the screen, and the far right of the screen will be the width of the screen in CSS pixels.  Typically 360 on a Mobile device.

- ypos: The y screen position of the center of the object.  In "percent" mode, 0 is the top of the screen, 100 is the bottom.  In "pixels" mode, 0 is the top of the screen, and the bottom of the screen will be the height of the screen in CSS pixels.  Typically 640 on a Mobile device.

- scale: The type of scale information supplied.  Set to either "percent" to set a percentage of the screen, or "pixels" for a number of pixels.  Default is "percent".

- keepaspect: Whether to preserve the x/y aspect ratio of the object.  If this is set, then "height" is ignored, and determined by a combination of "width" and the aspect ratio.  Default is: true.

- width: The screen width taken up by 1m of object width.  In "percent" mode, this is the proportion of the screen width that should be taken up by 1m of object width.  In "pixels" mode, this is the width of 1m of object width, in CSS pixels.  Default value: 10 (percent)

- height: The screen height taken up by 1m of object height.  In "percent" mode, this is the proportion of the screen height that should be taken up by 1m of object height.  In "pixels" mode, this is the height of 1m of object height in CSS pixels.  This attribute is ignored if "keepaspect" is set to true.  No default value (by default, "keepaspect" is true).

- zscale: A z scale factor applied to the object.  This value is applied directly to the object, regardless of what X & Y scaling are happening.  Note that "keepaspect" does not apply to the z-axis scaling of the object, which is controlled entirely by this attribute.  Default value is 1 (no scaling).

- zdist: The distance from the camera at which the object should be rendered.  The default value of 0.01 (i.e. 1cm) should be fine for most purposes.  Do not set this below 0.005 (5mm) without also adjusting the "near" attribute on the camera, which sets the near clipping plane of the camera frustrum, or objects will mysteriously disappear due to frustrum culling.  See: https://aframe.io/docs/1.2.0/components/camera.html#properties_near

  

## Other Notes

By default, the A-Frame text component positions text 1mm (0.001m in front of the parent object), which in most cases gives the appearance of text directly positioned on the object.

See: https://aframe.io/docs/1.2.0/primitives/a-text.html#attributes_z_offset

For objects that are very close to the camera, this 1mm becomes visible, and can make the text look incorrectly positioned.

To workaround this, set the zOffset attribute on the text component to a much smaller value (e.g. 0.000001).

See the examples folder for some examples of this.



