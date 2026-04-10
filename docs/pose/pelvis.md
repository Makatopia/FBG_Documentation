# Pelvis

The pelvis controls shift body mass, set the hip line, and determine how much pelvic orientation carries into the spine through `Spine Coupling`.


## At a glance

- `X`, `Y`, and `Z` shift the pelvis position.
- `Tilt`, `Rotation`, and `Lateral` set the pelvic orientation and hip line.
- `Spine Coupling` controls how much pelvic orientation stays local versus how much it carries into the trunk.

![Pelvis section overview](../assets/images/pose-pelvis-overview.avif){ .zoom .img-center width=60% }

## Position

The pelvis position controls shift the body's center of mass. The leg mode determines what happens downstream.

In leg IK, the leg chains solve to follow -- feet stay planted while the body moves over them. This is what makes squats, lunges, and weight shifts practical to pose from the pelvis.

In leg FK, the whole figure translates.

![Position controls](../assets/images/pose-pelvis-position.avif){ .zoom }

## Rotation

`Tilt` tips the pelvis forward (anterior tilt) or backward (posterior tilt), changing the lumbar curve.

`Rotation` turns the pelvis axially, changing the hip line direction relative to the trunk or legs.

`Lateral` hikes or drops one side of the pelvis. This is the main weight-shift control for contrapposto and asymmetric stances.

![Rotation controls](../assets/images/pose-pelvis-rotation.avif){ .zoom }

## Spine Coupling

`Spine Coupling` controls how pelvic orientation carries into the spine above.

There are three independent coupling sliders -- one for `Tilt`, one for `Rotation`, and one for `Lateral`. Each runs from `-1` to `1`.

- `-1` -- rigid follow. The upper body inherits that pelvis axis as one unit, with no spinal articulation.
- `0` -- isolate. The pelvis rotates on that axis without automatically driving the spine.
- `1` -- counter-motion. The pelvis drives distributed spine motion in the opposite direction on that axis, using the same anatomical segment weights described on the [Torso & Head](torso-head.md#segment-distribution) page.

Partial values blend between these behaviors. The three axes are independent.

![Spine Coupling](../assets/images/pose-pelvis-spine-coupling.avif){ .zoom }
