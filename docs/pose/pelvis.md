# Pelvis

The Pelvis section controls the body's base transform relative to the legs and trunk. Use it to shift body mass, set the hip line, and decide how much pelvis motion carries into the spine through `Spine Coupling`.

Small pelvis changes can reshape the whole pose above and below.

<!-- TODO: screenshot - the Pelvis section expanded in the Pose panel -->
<!-- ![Pelvis section](../assets/images/pose-pelvis-overview.avif) -->

## At a glance

- `X`, `Y`, and `Z` shift the pelvis, realtive to the legs.
- `Tilt`, `Rotation`, and `Lateral` set the pelvic orientation and hip line.
- `Spine Coupling` controls how much pelvis motion stays local versus how much it carries into the trunk.

## Position

The position controls are most useful when you think of them as body-mass placement rather than simple translation.

In leg IK, pelvis offsets move the body over planted feet while the leg chains solve automatically to follow. This is what makes squats, lunges, body shifts, and support poses feel practical to adjust from the pelvis.

In leg FK, the same controls translate the figure locally instead of solving against planted feet.

## Rotation

The rotation controls set the orientation of the pelvic block itself.

`Tilt` controls anterior/posterior pelvic tilt. It is one of the main controls for changing the relationship between the pelvis and the lumbar spine.

`Rotation` turns the pelvis axially. This is useful for changing the direction of the hip line relative to the trunk, the legs, or both.

`Lateral` hikes or drops one side of the pelvis. In practice, this is one of the main weight-shift controls in the whole pose system.

These three sliders are simple on their own, but together they determine a large part of the figure's gesture, balance, and stance.

## Spine Coupling

`Spine Coupling` is the main non-obvious feature in this section. It controls how pelvis rotation carries into the spine above.

There are three independent coupling sliders - one for `Tilt`, one for `Rotation`, and one for `Lateral`. Each runs from `-1` to `1`.

- `-1` means rigid follow. The upper body inherits that pelvis axis as one unit, with no spinal articulation.
- `0` means isolate. The pelvis rotates on that axis without automatically driving the spine.
- `1` means articulated response. The pelvis drives distributed spine motion using the same anatomical segment weights described on the [Torso & Head](torso-head.md#segment-distribution) page.

Partial values blend between these behaviors. The three axes are independent, so you can combine any mix of values across tilt, rotation, and lateral motion.

<!-- TODO: screenshot - Spine Coupling foldout expanded -->
<!-- ![Spine Coupling](../assets/images/pose-pelvis-spine-coupling.avif) -->
