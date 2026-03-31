# Baking

FBG animation lives inside the FBG pose system -- pose properties, combos, and the frame-change handler that evaluates them. Baking transfers that animation out of FBG into standard Blender data that can be used independently.

<!-- TODO: screenshot - Bake To Rig popup showing Rest Pose Source and Advanced Tuning -->
<!-- ![Bake popup](assets/images/baking-popup.avif) -->

## At a glance

- `Bake To Rig` is the primary bake path. It generates a standard Blender armature with a baked Action from the current FBG animation.
- The armature is built from the figure's current proportions. If the figure is shaped to match a character model, the rig will match that model's proportions.
- An optional [Pose Combo preset](pose-combos.md#presets) can define the rig rest pose, useful for matching a specific bind pose like T-pose or A-pose.
- The baked rig includes deformation helpers (twist bones, pelvis fan bones, shoulder helpers) for better mesh deformation out of the box.
- The rig is meant for binding and playback -- not as an animation-control rig. It has baked keyframes, no controllers.
- Rebaking replaces the previous rig. Actions can be preserved and reused across characters that share the same rig recipe.
- `Bake for Render` is a separate utility that bakes object transforms onto blockout meshes so the figure does not freeze during `Render Animation`.

## Bake To Rig

### Purpose

Bake To Rig takes FBG animation and produces a clean, standard armature with a baked Action. The result has no constraints, no scripted drivers, and no custom mechanisms -- just bones and keyframes.

The intended workflow is: shape the FBG figure to match a target character, animate with the FBG pose system, bake the rig, and bind the character mesh to it (for example with `Parent with Automatic Weights`). The character inherits the baked animation through the armature.

The baked rig is not an animation-control rig. There are no custom controllers, IK setups, or constraint mechanisms. It plays back motion -- it does not provide tools to create new motion.

### Prerequisites

- The blockout must be finalized.
- `Animation Playback` must be enabled on that finalized blockout.
- The scene frame range must cover the animation to capture.

### How the rig is shaped

The armature skeleton is generated from the figure's current proportions -- height, gender, proportion type, structure. Bone placement comes from the figure's anatomical anchor points, so the rig fits whatever body shape has been configured.

This is why shaping the FBG figure to match the target character first matters. The baked rig will share those proportions, making the bind to the character mesh more accurate.

### Rest pose

The Bake To Rig popup includes a `Rest Pose Source` selector that controls the rig's bind pose:

- `Default` -- FBG's neutral default rest pose.
- `Combo Preset` -- a saved [Pose Combo preset](pose-combos.md#presets) defines the rest pose.

This changes only the rest pose. Proportions still come from the current figure, and the baked animation still covers the scene frame range.

`Default` gives a consistent base for repeated bakes. `Combo Preset` is useful when the character needs a specific bind pose -- for example, a T-pose or A-pose preset authored to match the target model's bind position.

!!! note "Combo Preset and proportions"
    A Combo Preset saves figure proportions at the time it was created, but Bake To Rig does not use those saved proportions. It always builds the skeleton from the actual blockout being baked. The saved proportions are only applied when loading the preset through `Replace` in [Pose Combos](pose-combos.md#presets) -- useful for restoring the full figure setup before animating.

#### Root transform in Combo Preset mode

When `Combo Preset` is selected, `Use Preset Root Transform` controls how root channels are handled in the rest pose:

- **Off** (default) -- root channels come from the figure at the start frame.
- **On** -- root channels come from the preset, but only when the preset actually drives root transform properties. Otherwise, falls back to the figure at the start frame.

This keeps the root as one coherent group and avoids mixed states such as preset rotation with figure position.

Example: a preset was saved with root location X = 1m. With `Use Preset Root Transform` OFF, the rig origin and rest pose are at the figure's current location. With it ON, the rest pose and origin are at X = 1m even though the generated rig sits at the figure's current location.

### Deformation helpers

Beyond the main animation bones, the baked rig includes helpers that improve how a bound mesh deforms. These are most relevant after binding a character.

#### Twist helpers

Twist helpers distribute axial rotation along a limb segment. Without them, all twist concentrates at the joint and the mesh pinches and collapses ("candy wrapper" deformation). Each twist bone carries a fraction of its parent's axial twist, increasing from joint to extremity:

| Chain | Segments | Distribution (default) |
|-------|----------|----------------------|
| Upper arm | 3 | 25% / 60% / 85% |
| Forearm | 3 | 15% / 55% / 80% |
| Thigh | 2 | 25% / 75% |
| Shin | 2 | 25% / 75% |

Arms use three segments and legs use two because arm twist is typically more visible, especially in forearm pronation/supination.

When using a Combo Preset as rest pose source, twist helpers evaluate as a delta from the selected rest pose. If the preset already contains twist-driving values (for example forearm pronation), the helpers do not stay permanently pre-twisted at rest.

#### Pelvis helpers

A fan-helper system centered on each hip socket maintains skin volume during leg movement. These helpers do not drive the leg chain -- they support the skin around it.

Five helpers per side, all parented to the pelvis and originating at the hip socket:

| Bone | Role | Follows |
|------|------|---------|
| `hip` | Iliac anchor (upper-lateral pelvis) | Static -- does not follow thigh |
| `glute` | Posterior glute support | Partial flexion/extension |
| `glute_lower` | Lower-glute to upper-thigh bridge | Partial flexion/extension |
| `inguinal` | Front hip crease support | Minimal flexion/extension |
| `pectineus` | Inner-thigh and groin support | Abduction/adduction + flexion/extension |

Axial leg twist is intentionally ignored -- only motions that affect skin volume are tracked.

#### Shoulder helper

One helper per side supports the armpit area:

- `armpit` -- parented to the clavicle, keeps the axillary region from pinching in raised-arm poses.

#### Deform vs driver bones

The rig separates driver bones (skeleton hierarchy, baked animation) from deform bones (what the mesh is actually skinned to). By default, these are non-deform:

- `root`, `cog` -- control bones
- `upper_arm`, `forearm` -- replaced by twist helper chains
- `thigh`, `shin` -- replaced by twist helper chains
- `toes` -- single-bone fallback (see below)

Twist helpers, pelvis helpers, shoulder helpers, and per-toe chains are deform-enabled by default. Any bone's deform flag can be changed manually after baking.

#### Toes

Two levels of toe detail, both with baked motion:

- Per-toe chains (`hallux`, `toe2` through `toe5`) -- three phalanges each, deform-enabled. For full toe deformation.
- Single fallback bones (`toes.L` / `toes.R`) -- one bone per side, non-deform by default. Enable deform on these for a simpler setup (shoes, low-poly characters).

### Scale compensation

Bake To Rig keys Y-scale on shin and forearm bones per frame to keep chain alignment stable.

**Shin scale** compensates for effective knee-to-ankle distance changes caused by [Knee Hyperextension](pose/legs.md#knee-hyperextension), [Knee Valgus](pose/legs.md#knee-valgus).

**Forearm scale** compensates for effective elbow-to-wrist distance changes caused by [Elbow Valgus](pose/shoulders-arms.md#elbow-valgus), most visible when Hand Pin is active.

These are normal bake-fidelity mechanisms, not rare corrections.

!!! warning "Animated scale in downstream workflows"
    If a downstream export or retarget workflow does not preserve animated bone scale, baked arm and leg playback may not reproduce exactly outside Blender.

### Advanced Tuning

The Bake To Rig popup includes an `Advanced Tuning` foldout for adjusting deformation helper behavior:

- **Pelvis Helpers** -- follow fractions for glute, lower glute, inguinal, and pectineus bones
- **Shoulder Helpers** -- follow fractions for armpit bones
- **Twist Helpers** -- distribution percentages for all twist chains

Each group has a reset button that restores defaults. These controls are meant for fine-tuning after binding a mesh and checking deformation in real poses -- the defaults are the intended starting point.

<!-- TODO: screenshot - Advanced Tuning expanded in the Bake To Rig popup -->
<!-- ![Advanced Tuning](assets/images/baking-advanced-tuning.avif) -->

### Rebake and Action handling

Bake To Rig is designed for iteration.

- Each rebake rebuilds the rig from scratch -- new bone placement from current proportions, new keyframes from current animation.
- If an older baked rig exists in the same blockout collection, it is replaced automatically.
- Moving the baked rig out of the blockout collection before rebaking preserves it.
- The baked Action is FBG-managed and replaced on each rebake.
- Marking the Action with Fake User or unlinking it from the rig before rebaking preserves it.

### Reusing Actions across characters

Bake To Rig supports a reuse workflow:

1. Bake a rig from the blockout.
2. Move the baked rig out of the blockout collection.
3. Bind a character mesh to that rig (this becomes the target rig).
4. Animate the blockout and rebake -- this produces new Actions.
5. Assign the new Actions to the target rig.

This works when source and target rigs share the same rig recipe -- same `Rest Pose Source` (and same preset when preset-based) and same figure proportions.

**Different rest-pose source** between rigs causes Actions to not line up. **Same preset but different proportions** causes limb arcs, foot placement, and body motion to drift.

The recommended approach: lock proportions first, save one dedicated rest preset if needed, bake the target rig from that setup, and bake all reusable Actions from the same recipe.

### Bone reference

The full skeleton uses Blender-standard `.L` / `.R` naming:

| Region | Bones |
|--------|-------|
| Core | `root`, `cog`, `pelvis` |
| Spine | `spine`, `spine.001`, `spine.002`, `spine.003` |
| Neck and head | `neck`, `neck.001`, `head` |
| Shoulder girdle | `clavicle`, `scapula` |
| Arm | `upper_arm`, `forearm`, `hand` |
| Hand | `thumb` (2), `f_index` / `f_middle` / `f_ring` / `f_pinky` (3 each), `palm` |
| Leg | `thigh`, `shin`, `foot` |
| Toes | `hallux`, `toe2`, `toe3`, `toe4`, `toe5` (3 each), `toes` (fallback) |
| Twist helpers | `upper_arm_twist.01-03`, `forearm_twist.01-03`, `thigh_twist.01-02`, `shin_twist.01-02` |
| Pelvis helpers | `hip`, `glute`, `glute_lower`, `inguinal`, `pectineus` |
| Shoulder helper | `armpit` |

<!-- TODO: screenshot - baked rig in edit mode showing the main hierarchy -->
<!-- ![Baked rig hierarchy](assets/images/baking-rig-hierarchy.avif) -->

## Bake for Render

`Bake for Render` bakes object transforms onto the blockout meshes so the figure can be rendered as an animation. FBG's frame-change handler is disabled during Blender's `Render Animation` to prevent crashes -- without baking, the rendered frames show the figure frozen in a single pose.

The operator samples the scene frame range, evaluates the blockout animation frame by frame, and keys `location` and `rotation_quaternion` onto each mesh object.

Requirements:

- The blockout must be finalized.
- `Animation Playback` must be enabled.
- `Deform Updates` must be off -- only object transforms are baked, not vertex-level deformation.

Rebaking replaces previous render-bake Actions. Regenerating the blockout removes old baked Actions with it.
