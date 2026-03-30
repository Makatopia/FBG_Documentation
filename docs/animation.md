# Animation

Animation in FBG uses Blender's normal keyframe system, but playback runs through an addon-level evaluation path rather than a native rig. Pose properties and Pose Combo channels can all be keyframed. The figure updates during playback and scrubbing once `Animation Playback` is enabled.

<!-- TODO: screenshot - active blockout header with Animation Playback enabled, timeline/Graph Editor context -->
<!-- ![Animation overview](assets/images/animation-overview.avif) -->

## At a glance

- Pose properties and Pose Combo channels can be animated.
- `Animation Playback` must be enabled -- without it, keyed values change in Blender but the figure does not update.
- Each blockout stores its F-curves on a controller object named `{BlockoutCollectionName}_CTRL`.
- Realtime Graph Editor preview works on the active blockout while the timeline is idle.
- `Render Animation` requires a bake step first.

## Playback architecture

Blender evaluates F-curves during playback and updates the relevant property values on each frame. However, Blender does not reliably call FBG's property update callbacks while the timeline is running. Without extra handling, property values would change but the figure would not move.

FBG adds a handler that fires on every frame change. On each frame, it reads the current evaluated property values, resolves any enabled Pose Combos, builds the effective pose, and applies it to the figure.

`Animation Playback` is the gate for this per-frame evaluation. When the toggle is off, Blender still evaluates the F-curves -- slider values will update in the panel -- but FBG does not apply those values to the figure. The toggle is what connects Blender's keyframe evaluation to the actual blockout update.

The active blockout and finalized blockouts both use this approach, but they read from different sources:

- The active blockout reads the current active settings and applies either direct pose transforms or the combo-resolved pose stack.
- Finalized blockouts read from a per-blockout controller object, rebuild the effective pose from stored figure state plus current animated values, and apply it to the finalized blockout collection.

This evaluation runs in Python, not in Blender's native armature or constraint path. That is the main reason FBG animation is slower than a standard rig, especially in heavier scenes or with many enabled combos.

## What can be animated

**Pose properties** -- all properties in the `Pose` section, including root, torso, pelvis, limbs, hands, and feet -- are the primary animation targets. These move and reposition existing mesh objects without regenerating geometry and evaluate correctly during playback, scrubbing, and Graph Editor preview.

**Pose Combo channels** can all be keyframed: `Blend`, `Influence`, `Enabled`, per-property `Offset` and `Adjust`, and per-property `Start`, `Mid`, and `End` values. All of these evaluate correctly during playback.

**Build properties** are not practical animation targets. These include proportions, height, cranial mode, gender, structural ratios, volume values, and display settings. Keyframing them will change values in Blender, but the figure will not update correctly during playback -- the blockout is not rebuilt per frame. Treat these as static setup choices.

## Active and finalized blockouts

### Active blockout

The active blockout uses the `Animation Playback` toggle in the main FBG panel header. When enabled, timeline playback and scrubbing evaluate the active settings and apply either direct pose transforms or the combo-resolved pose stack, depending on whether any combos are active.

### Finalized blockouts

Each finalized blockout has its own `Animation Playback` toggle. Only blockouts with it enabled are updated during playback.

This is useful in larger scenes with multiple finalized figures. You can keep them all in the file and only pay the runtime cost for the ones currently being animated.

## Controller object

Every blockout -- active and finalized -- has a controller object named `{BlockoutCollectionName}_CTRL`. This is a hidden Empty that serves as the per-blockout animation host.

It holds:

- the blockout's `fbg_settings`, including all pose and combo property values
- the `Action` and F-curves for all animated FBG properties
- a root-following transform for animation editing convenience

The controller tracks the effective root transform -- root position, root rotation, and root pivot offset. Selecting it gives you a clean place to animate and inspect F-curves in the Graph Editor, with the object positioned at the blockout's root.

Use the controller visibility button in the FBG panel to reveal and select it.

<!-- TODO: screenshot - controller selected, Graph Editor showing blockout F-curves -->
<!-- ![Controller in Graph Editor](assets/images/animation-controller-graph-editor.avif) -->

## Realtime preview

Timeline playback and scrubbing update both the active blockout and any animation-enabled finalized blockouts.

The active blockout also has an idle-time Graph Editor preview. While the timeline is not playing and `Animation Playback` is enabled, editing F-curve handles in the Graph Editor updates the active blockout immediately on the current frame -- no need to scrub or press Play to see the result.

This idle preview applies only to the active blockout. For finalized blockouts, use timeline scrubbing or playback to preview animated changes.

## Pose Combos in animation

Pose Combos are well-suited for animating coordinated multi-part motion. A single `Blend` channel can drive many properties together, and `Influence` controls how strongly the combo contributes to the final result.

The key rule for animation is: **an enabled combo claims its properties.** During playback, all properties controlled by enabled combos are reset to their defaults first, then the combo stack is evaluated in list order. If you have direct keyframes on a property that an enabled combo also controls, the combo result takes precedence -- the direct keyframes are overwritten.

This is the intended design, not a limitation. The combo system exists specifically to drive groups of properties together. If a property you are trying to animate directly is not responding, check whether an enabled combo owns it. The options are:

- disable the combo that owns the property, releasing it for direct animation
- or drive the motion through the combo -- animate `Blend`, `Influence`, and use per-property refinement channels to shape the result

For per-property timing and value refinement inside the combo stack, `Offset` shifts when a property's motion happens within the `Blend` range, and `Adjust` adds a normalized correction on top of the interpolated value that can be keyframed for per-property f-curve polish. These let you refine individual properties without stepping outside the combo system.

Full combo authoring and per-property setup are covered on the [Pose Combos](pose-combos.md) page.

## Deform Updates

FBG can update mesh deformations during playback -- torso bend and arm twist -- to improve how the blockout reads while moving. These are visual refinements only and do not affect pose evaluation, combo resolution, or baked output.

For the active blockout, the update mode controls in the Pose section (`Torso Bend Update Mode`, `Twist Update Mode`) apply during posing and playback. For finalized blockouts, the per-blockout `Deform Updates` toggle is the runtime switch -- when off, the current deformed shape stays frozen for the duration of playback.

Deform Updates are also the biggest single performance factor during playback. See [How FBG Works](how-fbg-works.md#mesh-deformation) for a full explanation of the deformation system and update modes.

## Performance

FBG animation runs through Python rather than Blender's native evaluation path. Playback is usable and practical for iteration, but it is slower than a native Blender armature.

The biggest cost factors are:

- whether `Deform Updates` is enabled -- modifying vertex positions on multiple objects every frame is by far the largest single factor
- how many blockouts have `Animation Playback` enabled
- how many combos are enabled and how many properties they control

There is also a smaller distinction worth knowing: the active blockout may play back slightly slower than finalized blockouts in the same scene. This is not FBG evaluation overhead -- the pose pipeline runs the same way in both cases. The gap comes from Blender redrawing the FBG sidebar panel every frame during playback. Pressing `N` to hide the sidebar, or `Ctrl+Space` to maximize the 3D viewport, closes the gap. This is standard Blender viewport overhead and outside FBG's control.

To improve playback performance:

1. Disable `Deform Updates` unless you specifically need the visual bend and twist behavior.
2. Disable `Animation Playback` on blockouts you are not actively working with.
3. Keep the number of enabled combos reasonable during blocking and preview.
4. Use [Bake To Rig](baking.md) for native Blender playback speed once the animation is final.

## Rendering and baking

!!! warning "Render Animation needs baking"
    FBG does not evaluate live animation during Blender's `Render Animation` path. The per-frame handlers are intentionally disabled during rendering for stability. Rendering without baking first will produce a figure frozen in a single pose.

### Bake for Render

`Bake for Render` samples every frame in the scene range and bakes the result as object transforms directly onto the generated mesh objects.

Before running it:

- enable `Animation Playback` on the finalized blockouts you want to bake
- disable `Deform Updates` -- only object transforms are baked, not per-frame vertex deformation

Full documentation is on the [Baking](baking.md) page.

### Bake To Rig

Use [Bake To Rig](baking.md) when you need a standard armature result rather than baked transforms on the generated mesh objects -- for native-speed playback, a conventional Blender rig, or animation transfer to a separate character.

## Keeping animation data

FBG automatically cleans up the Actions it creates when you re-bake or regenerate a blockout. To keep an Action:

- enable the shield icon (Fake User) on it in the Action Editor
- or unlink the Action from the object before rebaking
- or move the baked rig out of the blockout collection before regenerating

## Limitations

- Build properties cannot be used as animation channels.
- `Render Animation` requires baking first.
- `Bake for Render` does not capture deform-update vertex motion -- disable `Deform Updates` before baking.
- Enabled Pose Combos override direct animation on the properties they control.
- NLA is not tested. The animation system is designed around direct Actions and keyframes. Complex NLA setups may produce unexpected results.
