# Arms & Shoulders

This section combines two closely related systems: the shoulder girdle and the arm itself. The shoulder girdle drives broad shoulder motion with automatic scapula coupling, while the arm offers FK and IK modes with shared controls available in both.

<!-- TODO: screenshot - the Arms & Shoulders section expanded in the Pose panel -->
<!-- ![Arms & Shoulders section](assets/images/pose-arms-overview.avif) -->

## At a glance

**Shoulder Girdle** - two main properties drive the broad shoulder motion and automatically couple into the scapulae. Three additional properties under `Scapula Control` give direct scapula refinement:

- `Elevation` and `Protraction` set the shoulder-girdle motion.
- `Scapula Control` exposes manual scapula channels:
    - `Upward Rot` - scapula upward rotation
    - `A/P Tilt` - scapula anterior/posterior tilt
    - `Ext/Int` - scapula external/internal rotation

**Arm** - two working modes with shared controls available in both:

- `FK Mode` poses the arm by angles.
- `IK Mode` poses the arm by hand target, elbow pole, and optional hand pinning.
- `Pronation` and `Elbow Valgus` are available in both modes.

## Shoulder girdle

The shoulder girdle controls shape the shoulder line and the base scapula behavior. This is where you define shrugging, rounding forward, and similar upper-torso changes.

`Elevation` raises or lowers the shoulder - positive values lift, negative values depress.

`Protraction` moves the shoulder girdle forward or back - positive values protract (round forward), negative values retract (pull back).

These two controls do most of the work in typical poses.

### Automatic scapula response

Even with the manual scapula control sliders at `0`, the scapulae are not static. `Elevation` and `Protraction` already drive an automatic scapula response behind the scenes.

`Elevation` tends to produce:

- upward rotation
- a little posterior tilt
- a little external rotation

`Protraction` tends to produce:

- small upward-rotation
- anterior tilt
- internal rotation

Depression and retraction drive the opposite responses in each case.

This is intentional. The main sliders are designed to do most of the work, so you can get believable shoulder motion quickly without needing to manually dial every scapula channel on every pose. The manual scapula controls exist for the cases where you need to push or correct that automatic result.

### Scapula Control

`Scapula Control` exposes the manual scapula channels. These controls are additive refinements layered on top of the automatic response described above. They do not replace it - they adjust it.

- `Upward Rot` - positive adds upward scapula rotation, negative adds downward.
- `A/P Tilt` - positive tilts anterior, negative tilts posterior.
- `Ext/Int` - positive rotates external, negative rotates internal.

The easiest way to use these:

1. Set the broad pose with `Elevation` and `Protraction`.
2. Open `Scapula Control` only if the shoulder blade behavior needs help.


<!-- TODO: screenshot - the Scapula Control foldout expanded -->
<!-- ![Scapula Control](assets/images/pose-arms-scapula-control.avif) -->

## Arm modes

Each side can use `FK` or `IK` independently.

`FK` is the anatomical approach - you shape the arm from the shoulder outward by setting swing angles and elbow bend directly.

`IK` is the placement approach - you set where the hand goes and the arm solves to get there. It also gives you explicit elbow direction through the pole target, and [Hand Pin](#hand-pin) for keeping the hand stable while the body moves.

### FK mode

With `FK Mode` enabled, the section exposes direct arm-angle controls:

- `Inherit Torso` makes the FK arm follow the live shoulder socket orientation. See [Inherit Torso](#inherit-torso) below.
- `Flexion` moves the arm forward or backward.
- `Rotation` twists the upper arm around its length.
- `Abduction` raises the arm out to the side.
- `Elbow Flexion` bends or straightens the elbow.
- `Pronation` rotates the forearm between pronation (palm-down) and supination (palm-up).
- `Elbow Valgus` adjusts the carrying angle at the elbow.


#### Inherit Torso

`Inherit Torso` is the main bridge between the shoulder girdle and the FK arm. When enabled, the FK arm follows the full live shoulder socket orientation - this includes the torso, clavicle motion from `Elevation` and `Protraction`, the automatic scapula coupling, and any manual `Scapula Control` adjustments. The arm feels carried by the entire shoulder system.

When disabled, the FK arm uses only its own local rotation and stays isolated from ongoing torso, shoulder, and scapula changes.

!!! note "Scapula controls move the arm when inheriting"
    With `Inherit Torso` enabled, adjusting `Upward Rot`, `A/P Tilt`, or `Ext/Int` under `Scapula Control` will also move the FK arm, because those channels feed into the shoulder socket orientation that the arm inherits. With `Inherit Torso` disabled, the same scapula adjustments only affect the shoulder blade - the arm stays in place.

Note that IK mode always solves relative to the live shoulder socket - the equivalent of Inherit Torso being permanently on.

### IK mode

With `FK Mode` disabled, the section switches to a hand-target IK solve:

- `Hand X`, `Hand Y`, and `Hand Z` move the hand target in figure space.
- `Pole X`, `Pole Y`, and `Pole Z` move the elbow pole target.
- `Pole Influence` controls how strongly the arm follows that pole target.
- `Pin Hand`, `Capture`, and `Clear` manage the stored hand-pin target.
- `Pronation` and `Elbow Valgus` remain available in IK as well.


### Pole control

The elbow pole controls tell IK which way the elbow should prefer to point.

- `Pole X`, `Pole Y`, and `Pole Z` move the pole target.
- `Pole Influence` blends between natural elbow behavior and explicit pole control.
- The eye icon next to the pole controls shows or hides the elbow empty marker in the viewport.


### Elbow Valgus

`Elbow Valgus` is not a typical pose slider. It adjusts the natural outward angle of the forearm at the elbow - the carrying angle - and it has geometric side effects that are worth understanding.

The figure already carries a base carrying angle from its proportions:

- female - `11 deg`
- male - `7 deg`

The `Elbow Valgus` slider is an offset on top of that base, so the arm has a carrying angle even when the slider is at zero.

Unlike a simple cosmetic offset, `Elbow Valgus` is integrated into the arm's geometry in both FK and IK modes.

**FK behavior:** the carrying angle naturally diminishes as the elbow bends. To see this clearly, set a high `Elbow Valgus` value and then increase `Elbow Flexion` - the forearm always converges to the same place at full flexion regardless of the valgus amount. This matches real anatomy where the carrying angle is most visible with the arm extended and nearly disappears when the elbow is fully bent.

**IK behavior:** the carrying angle shapes the arm's default wrist target, so changing `Elbow Valgus` can move the hand even when `Hand X/Y/Z` are unchanged. Internally, FBG keeps the carrying angle out of the raw 2-bone solve for stability, then reapplies it afterward, which can also cause small forearm-length variation depending on the arm's configuration.

**Bake To Rig:** FBG compensates for the IK forearm length variation by keying forearm Y-scale on every baked frame, keeping the baked rig aligned with the source figure.

!!! warning "Export consideration"
    If you plan to export or retarget a baked Action, check whether your destination workflow supports animated bone scale. If it does not, baked arm playback may not reproduce exactly outside Blender.

## Hand Pin

`Pin Hand` is the key support-pose workflow in this section. It is built for situations where you want the hand to stay in place while the rest of the arm and body solve around it - bracing on a wall, leaning on a table, floor support poses, or keeping a hand planted while adjusting torso or pelvis motion.

### Basic workflow

1. Pose the hand where you want it to stay.
2. Press `Capture` to store the current hand position and orientation as the pin target. This also activates `Pin Hand` automatically.
3. Move the body, shoulder girdle, or torso as needed.
4. Use `Pin Hand` to temporarily suspend and resume pinning against the same stored target.
5. Press `Capture` again if you want to redefine the stored target from the current pose.
6. Press `Clear` to remove the stored target and return to normal IK.

If `Pin Hand` is enabled without a stored target, the UI shows `Capture required`. While a pin is active, the normal `Hand X/Y/Z` controls are hidden because the stored target takes over.

### What Hand Pin stores

Hand Pin is not a world-constraint system. It stores a target in figure-local space.

!!! info "Figure-local, not world-constrained"
    The pinned target lives in the figure's own coordinate space. It's job is to keep the hand stable while you change internal body motion - torso bends, pelvis shifts, shoulder girdle adjustments. But if you move the entire figure root, the pinned target moves with it.


### Pinning and wrist controls

Hand Pin stores the hand target, not the finger pose.

- Finger and thumb controls remain free while pinning is active.
- `Forearm Pronation`, `Wrist Flexion`, and `Wrist Deviation` remain available while Hand Pin is active, but the pinned solve compensates for them to keep the captured hand orientation as stable as possible. In normal use this means they often appear non-reactive after capture. For predictable results, it is best to set those controls before capturing the pin target.

If the requested wrist setup becomes too extreme relative to the forearm, FBG clamps the wrist swing for stability. In those cases the pinned hand can deviate from the captured orientation.

### Mirror and symmetry with pinning

When Mirror is on, capturing on the driving side automatically creates a mirrored pin target on the opposite side.

For asymmetrical support poses, turn Mirror off and capture each side separately.

<!-- TODO: screenshot - the IK arm controls with hand pin and pole controls visible -->
<!-- ![Arm IK controls](assets/images/pose-arms-ik-controls.avif) -->

## Practical workflow


1. Set the shoulder line with `Elevation` and `Protraction`.
2. Pose the arm in FK if you are blocking gesture and do not need the hand fixed.
3. Switch to IK when hand placement becomes more important.
4. Use `Scapula Control` for refinement after the broad pose is working.
5. Use `Capture` after the hand is in the position and orientation you actually want to preserve.

### Choosing between FK, IK, and Hand Pin

Use FK when:

- you want fast anatomical posing
- you are shaping broad arm gesture
- the hand does not need to stay fixed
- you want direct control over shoulder swing and elbow bend

Use IK when:

- the hand needs to reach or stay planted
- you care more about hand placement than shoulder angles
- you want to reposition the body around a stable hand
- you need elbow direction control through the pole target

Use Hand Pin when:

- the hand should keep its place during torso or support motion
- the pose depends on contact or support

## Twist updates

The section header includes the arm twist update controls. These control when the deltoid and forearm twist deformations update while you pose. They affect the visual deformation behavior, not the underlying pose data itself.

For more detail, see [How FBG Works](../how-fbg-works.md#update-modes).
