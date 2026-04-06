# How FBG Works

## Generated from scratch

FBG does not import a pre-made model. It generates the figure in-place from code -- proportions are converted into dimensions, those dimensions are fed through a skeleton solver, and the solver output drives the mesh generation. Each generated mesh starts from a simple primitive based on the selected geometry mode, then FBG reshapes it to match the body part. Every time you change a proportion, the figure is regenerated from that pipeline.


## The anchor system

FBG does not use a Blender armature. Instead, it computes its own internal skeleton -- a chain of anchors -- from the current proportions and pose values.

The same chain is used for building, posing, and animation playback. Proportions provide the dimensions, pose values provide the pose inputs, and the solver produces the positions and orientations that all downstream operations use.

Because the chain uses actual proportional dimensions, changing proportions also changes the figure's kinematics -- the same pose values produce different joint positions on a differently proportioned figure.

The entire evaluation runs in Python rather than Blender's native C/C++ armature path. This means it is slower than a native armature-based rig. Read more about performance on the [Animation](animation.md#performance) page.

[Bake to Rig](baking.md#bake-to-rig) converts the result into a native armature for full-speed playback.

## Active and finalized blockouts

Only one blockout can be active at a time. The active blockout is the current editing target -- the one that responds when you change proportions, pose, or display settings in the panel.

When you click **Finalize**, the blockout is no longer the active editing target, but it stays in the scene. FBG stores the blockout's state into the collection metadata, which is what allows it to be reactivated later and resume where it left off.

Each finalized blockout is self-contained. Multiple finalized blockouts can coexist in the same scene, each with its own settings, animation state.

## Controller object

Each blockout gets a controller object -- a hidden Empty named with a `_CTRL` suffix, placed inside the blockout's main collection.

The controller holds the blockout's own copy of all FBG settings and all animation data (keyframes and F-curves). This is what enables each blockout to carry independent settings and animation.

!!! tip "Selecting the controller"
    All FBG property keyframes land on the controller. It is the object to have selected when working with the blockout's animation data in the Timeline, Graph Editor, or Dope Sheet. 
     
    Use the **Controller Visibility** toggle (eye icon) in the panel header to quickly reveal and select it.

### What happens if the controller is deleted

If the controller is deleted while the blockout is **active**, the settings, combos, and animation data stored on that controller are lost. Regenerating the blockout creates a new controller and the blockout falls back to the current scene-level state rather than the deleted controller data.

If the controller is deleted on a **finalized** blockout, reactivation can still restore settings and combos from the collection metadata. Animation keyframes and F-curves are only stored on the controller and cannot be recovered.

!!! warning "Keep the controller intact"
    While FBG can recover from a missing controller in some cases, unexpected behavior can occur -- such as the blockout reverting to default settings. If you animated the figure then upon removing the controller object, all of your animation data for this blockout will be lost.

## Update types

When you change a property, the blockout responds in one of three ways:

- **Rebuild** -- the affected objects are removed and regenerated from scratch. Triggered by most proportion or display changes.
- **Transform update** -- the existing objects are repositioned and rotated without touching the mesh data. Triggered by most pose changes.
- **Mesh deformation** -- the vertices of specific objects are recalculated to follow a bend or twist. Triggered by some pose changes.

### What rebuilds the blockout

Definition-level changes rebuild the blockout. These are changes that redefine what the generated figure looks like:

- **Proportions** -- preset, gender, proportion type, height, Structure, and Volume
- **Display geometry** -- geometry mode and geometry resolution
- **Visibility toggles** -- showing or hiding Arms, Legs, Shoulder Girdle, or Spine

During a rebuild, FBG regenerates the affected objects from the current definition. Visibility toggles only rebuild the relevant section -- hiding arms does not regenerate the legs.

The collection hierarchy and the controller object are always preserved across rebuilds.

### What updates in place

Most pose changes do not rebuild anything. Instead, FBG recalculates each object's position and rotation based on the current pose and applies the new transforms to the existing objects. The mesh data stays untouched.

This is why posing feels much faster than changing proportions -- the addon is only updating object transforms, not regenerating geometry.

### Mesh deformation

Some pose properties go beyond simple transforms -- they deform the mesh vertices of specific objects to produce more convincing results. Rigid rotation alone would look wrong for these parts, so FBG recalculates their vertex positions instead. This affects:

- **Ribcage**, **Waist** and **Spine** -- deform when the torso bends to visualize spine curvature
- **Forearm** -- deforms to visualize pronation/supination, twisting the mesh along its length
- **Deltoid** -- deforms with arm rotation, twisting to follow shoulder movement

These are not full rebuilds. They are local vertex passes applied to just these objects. But like a rebuild, they do overwrite vertex positions -- any manual edits to these objects will be lost when deformation runs.

<!-- the deferred/immediate/off selector -->
<!-- ![Mesh deformation](assets/images/how-fbg-works-mesh-deformation.avif) -->

## Update modes

Because mesh deformation and full rebuilds are more expensive than simple transforms, FBG gives you control over when they run.

Update mode selectors appear in three places:

- **Twist Updates** -- in the Pose section, controls deltoid and forearm twist deformation
- **Torso Bend Updates** -- in the Pose section, controls ribcage, waist and spine bend deformation
- **Structure/Volume/Height Updates** -- in the Proportions section (Structure sub-foldout header), controls how quickly the full regeneration responds while you drag sliders

Each offers up to three modes:

- **Deferred** -- waits until you stop adjusting, then updates after a short delay. This keeps slider dragging smooth because the expensive update only runs once at the end. Delay selector allows you to adjust how long FBG waits before triggering the update.
- **Immediate** -- updates on every change as you drag. More responsive visually, but can slow down with high-resolution geometry.
- **Off** -- disables the deformation entirely. The objects transform as rigid shapes. Available for Twist and Torso Bend but not for Structure, Volume and Height, which always needs to regenerate.

At lower geometry resolutions, Immediate is usually fine. At higher resolutions, Deferred or Off can keep the viewport more responsive.

<!-- the deferred/immediate/off selector -->
![Update mode selector](assets/images/how-fbg-works-update-mode-selector.avif)

### Deformation during animation playback

When a finalized blockout has `Animation Playback` enabled, the `Deform Updates` toggle in the Previous Blockouts list controls whether mesh deformations run during playback.

With it enabled, objects like the ribcage, waist, and forearm will deform as the animation plays. With it disabled, they transform as rigid shapes -- faster, but less visually accurate.

## Data management

FBG manages its blockout data throughout the lifecycle, not just at creation.

### During rebuilds

When a property change triggers a rebuild, FBG handles the cleanup internally -- old mesh data is replaced or removed, and new geometry is built to match the updated definition. The collection hierarchy and controller object survive every rebuild. Objects that you have added to the collection yourself are also preserved -- FBG only manages objects it created.

### During deletion

When you delete a blockout through the FBG panel, the addon removes the objects, their underlying mesh data, the collection hierarchy, and any associated animation data. The same applies to bake operations -- re-baking replaces the previous bake result with the new one.

### Manual deletion

This cleanup only works through FBG's own controls. If you manually delete blockout objects through Blender's Outliner, the addon cannot track that, and orphaned data may be left behind.
