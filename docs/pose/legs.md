# Legs

This section covers leg placement and knee behavior in two working modes: direct anatomical angles in FK, and target-based solving in IK. Foot articulation is handled separately in [Feet](feet.md).

<!-- TODO: screenshot - the Legs section expanded in the Pose panel -->
<!-- ![Legs section](../assets/images/pose-legs-overview.avif) -->

## At a glance

**Leg** - two working modes with shared knee controls available in both:

- `FK Mode` poses the leg by hip and knee angles.
- `IK Mode` poses the leg by foot target (`Foot X/Y/Z`) and knee pole.
- `Hyperextension` and `Knee Valgus` are available in both modes.

## Leg modes

Each side can use `FK` or `IK` independently.

`FK` is the anatomical approach - you shape the leg from the body outward by setting hip swing and knee bend directly.

`IK` is the placement approach - you set where the foot goes and the leg solves to get there. It also gives you explicit knee direction control through the pole target.

### FK mode

With `FK Mode` enabled, the section exposes direct leg-angle controls:

- `Flexion` moves the thigh forward or backward.
- `Rotation` twists the thigh around its length.
- `Abduction` moves the thigh away from or toward the midline.
- `Knee Flexion` bends or straightens the knee.
- `Hyperextension` pushes the knee slightly past straight near full extension.
- `Knee Valgus` adjusts the bicondylar angle offset at the knee.

### IK mode

With `FK Mode` disabled, the section switches to a planted-leg IK solve:

- `Foot X`, `Foot Y`, and `Foot Z` move the planted ankle target in figure space.
- `Pole X`, `Pole Y`, and `Pole Z` move the knee pole target.
- `Pole Influence` controls how strongly the leg follows that pole target.
- `Hyperextension` and `Knee Valgus` remain available in IK as well.

The leg IK solver keeps a small hidden bend reserve near full extension. This avoids brittle straight-leg solves and gives more stable planted-leg behavior.

#### Pole control

The knee pole controls tell IK which way the knee should prefer to point.

- `Pole X`, `Pole Y`, and `Pole Z` move the pole target.
- `Pole Influence` blends between the default knee direction and the explicit pole target.
- The eye icon next to the pole controls shows or hides the knee empty marker in the viewport.

At low `Pole Influence`, the leg stays closer to FBG's default planted bend direction. At high `Pole Influence`, the explicit pole target takes over more strongly.

<!-- TODO: screenshot - the IK leg controls with foot target, knee pole, and marker toggle visible -->
<!-- ![Leg IK controls](../assets/images/pose-legs-ik-controls.avif) -->

## Knee Valgus

`Knee Valgus` adjusts the leg's bicondylar angle - the natural inward knee alignment. Positive values increase the inward angle (knock-knee direction), negative values reduce it or push toward varus (bow-legged direction).

The figure already carries a base bicondylar angle from its proportions:

- female realistic - `10 deg`
- female ideal - `9 deg`
- male realistic - `7 deg`
- male ideal - `6 deg`

The `Knee Valgus` slider is an offset on top of that base, so the leg already has structural knee alignment even when the slider is at zero.

Unlike a simple cosmetic offset, `Knee Valgus` is integrated into the leg's geometry in both FK and IK modes.

**FK behavior:** `Knee Valgus` changes the structural femur-to-knee alignment and the visible frontal knee profile.

**IK behavior:** `Knee Valgus` shapes the planted leg reference, so changing it can move the foot even when `Foot X/Y/Z` are unchanged. Internally, FBG keeps the raw 2-bone solve stable, then applies a post-solve valgus correction so the visible leg preserves the intended anatomical alignment without letting valgus destabilize the pole solve.

<!-- TODO: image - side-by-side comparison showing base leg alignment and the effect of Knee Valgus -->
<!-- ![Knee Valgus comparison](../assets/images/pose-legs-knee-valgus.avif) -->

## Knee Hyperextension

`Hyperextension` pushes the knee past straight, giving the leg backward bow near full extension. It changes the leg geometry itself in both FK and IK, not just a rotation layered on top of the shin. It is a controlled extension refinement, not a general bend control.

**FK behavior:** near extension, `Hyperextension` rotates the femur past neutral and rebuilds the tibia toward the resulting ankle position. The effect fades out linearly as knee flexion increases and is fully suppressed at `20 deg` of knee flexion.

**IK behavior:** near extension, `Hyperextension` adjusts the solved leg while the ankle target stays planted. The knee shifts, the tibia redirects to the same ankle target, and the effective shin length can vary slightly as a result.

<!-- TODO: image - comparison showing neutral leg extension and visible Knee Hyperextension -->
<!-- ![Knee Hyperextension comparison](../assets/images/pose-legs-knee-hyperextension.avif) -->

## Shin length

Both `Knee Valgus` and `Hyperextension` can change the effective knee-to-ankle distance, which means the shin segment may be slightly longer or shorter than its nominal rest length depending on the pose. The leg carries its base valgus angle even when the `Knee Valgus` slider is at zero, so shin length variation can appear in ordinary poses. The difference is small, but it is real, and it is worth being aware that it happens.

**Bake To Rig:** FBG compensates by keying shin Y-scale on every baked frame, keeping the baked rig aligned with the source figure.

!!! warning "Export consideration"
    If you plan to export or retarget a baked Action, check whether your destination workflow supports animated bone scale. If it does not, baked leg playback may not reproduce exactly outside Blender.
