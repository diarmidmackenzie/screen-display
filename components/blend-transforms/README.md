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

Via CDN 

```
<script src="https://cdn.jsdelivr.net/npm/aframe-screen-display@0.1.1/index.min.js"></script>
```

Or via [npm](https://www.npmjs.com/package/aframe-screen-display)

```
npm install aframe-screen-display
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
