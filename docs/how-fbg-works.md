# How FBG Works

This page covers the core concepts behind FBG's workflow - the blockout lifecycle, what triggers regeneration, and how multiple blockouts coexist in a scene. Understanding these will help you work with the tool more confidently.

## Active and finalized blockouts

A blockout in FBG has two stages: **active** and **finalized**.

When you generate a blockout, it starts in the **active** stage. This is where you do all your work - adjusting proportions, posing, setting up combos, tweaking display options. The full panel with all four sections is available.

At the top of the active panel, next to the blockout name and the Finalize button, you will find a set of header controls:

<!-- TODO: screenshot - the active header bar with the 4 icon buttons -->
<!-- ![Active header controls](assets/images/how-fbg-works-active-header.avif) -->

- **Animation Playback** - enables animation evaluation for the active blockout, so pose properties update with frame changes during scrubbing and playback. Covered in more detail on the [Animation](animation/index.md) page.
- **Controller Visibility** - makes the controller object visible and selects it. This is mainly useful when animating, because Blender's Timeline or Graph Editor show keyframes for the selected object - and the controller is where FBG stores the animation Action per blockout.
- **Regenerate** - forces a full regeneration of the active blockout from the current settings. Useful as a recovery option if something gets into an unexpected state.
- **Delete** - removes the active blockout and cleans up its associated data blocks.

Once you are satisfied with the blockout, you click **Finalize**. This locks the blockout in its current state and returns the panel to the initial view. From here you can generate another blockout, or work with your finalized ones through the **Previous Blockouts** list that appears below the Generate button.

<!-- TODO: screenshot - the finalized state UI showing Previous Blockouts list -->
<!-- ![Finalized state](assets/images/how-fbg-works-finalized.avif) -->

Each finalized blockout in the list has a set of controls:

- **Animation toggle** - enables playback of animated properties on the finalized blockout
- **Deform updates** - toggles mesh deformation updates during animation (appears when animation is enabled)
- **Visibility** - shows or hides the blockout collection in the viewport
- **Reactivate** - returns the blockout to the active stage so you can continue editing it
- **Delete** - removes the blockout and cleans up its associated data blocks (the recommended way to delete, since it prevents unused data from accumulating in the scene)

The bake operations - **Bake to Rig** and **Bake for Render** - are also located in this finalized view, since they operate on finalized blockouts.

You can have multiple finalized blockouts in the same scene, each with its own independent settings and animation. Only one blockout can be active at a time.

## Regeneration

Certain changes cause FBG to regenerate the blockout meshes from scratch. This happens when you change:

- **Proportions** - gender, proportion type, height, structure, or volume controls
- **Display settings** - geometry type, resolution, or body part visibility

During regeneration, the existing mesh objects are replaced with newly built ones. **Pose changes do not trigger regeneration** - they transform the existing objects in place, which is why posing is fast and responsive.

!!! warning "Regeneration replaces mesh data"

    Because regeneration rebuilds the mesh objects, any manual edits you have made to the blockout geometry (sculpting, vertex edits, modifiers, etc.) will be lost when a regeneration occurs. This is expected during the active stage, where the figure is still being shaped.

    If you finalize a blockout, make manual edits to its meshes, and then reactivate it, be aware that changing any regeneration-triggering property will replace those edits. FBG shows a confirmation prompt when reactivating to remind you of this.

## Mesh deformation

Some pose properties go beyond simple object transforms - they deform the mesh vertices of specific blockout objects to produce more convincing results. This affects five objects: the spine, waist, ribcage, deltoid, and forearm.

For example, when the torso bends, the waist and ribcage meshes deform to follow that bend rather than rotating as rigid shapes. Similarly, forearm pronation/supination twists the forearm mesh, and arm rotation can twist the deltoid. These are visual deformations only - they do not affect animation data or the baked rig - but they make the blockout much more readable as a figure reference.

!!! warning "Deformation updates vertex positions"

    Like regeneration, mesh deformation overwrites vertex positions on the affected objects. If you have manually edited the geometry of the spine, waist, ribcage, deltoid, or forearm objects, those edits will be lost when deformation updates run.

### Update modes

Because mesh deformation is more expensive than simple transforms, FBG gives you control over when it happens. Two update mode selectors appear in the Pose section - one for **Twist Updates** (deltoid and forearm) and one for **Torso Bend Updates** (ribcage and waist). A similar selector appears in the Proportions section for **Structure/Volume/Height Updates**, which controls how quickly the full regeneration responds while you drag sliders.

<!-- TODO: screenshot - the deffered/immediate/off selector options -->
<!-- ![Deformation Updates Selector](assets/images/how-fbg-works-def-update-selector.avif) -->

Each offers up to three modes:

- **Deferred** - waits until you stop adjusting, then updates after a short delay. This keeps slider dragging smooth and responsive.
- **Immediate** - updates on every change as you drag. More responsive visually, but can be slower with high-resolution geometry.
- **Off** - disables the deformation entirely. The objects will transform as rigid shapes. Available for Twist and Torso Bend updates but not for Structure/Volume (which always needs to regenerate).

The right choice depends on your geometry resolution. At lower resolutions, Immediate is usually fine. At higher resolutions (e.g., high Quad Sphere subdivision levels), Deferred or Off will keep the UI responsive and performance better.

### Deformation during animation playback

When a finalized blockout has animation enabled, the **Deform updates** toggle in the Previous Blockouts list controls whether mesh deformations run during playback. With it enabled, objects like the spine, waist or forearm will deform as the animation plays. With it disabled, they transform as rigid objects - faster, but less visually accurate.

This is the same deformation system described above, just applied per-frame during playback instead of interactively during posing.

## The controller object

Each blockout has a controller object - a small empty that lives inside the blockout's collection. The controller stores all of the blockout's settings, pose values, combo definitions, and animation data (the Action with keyframed F-curves).

You generally do not need to interact with the controller directly. It is managed by FBG and exists so that each blockout's state is self-contained and independent from other blockouts in the scene.

## Multiple blockouts

You can have as many finalized blockouts in a scene as you need. Each one has its own collection, controller, settings, and animation. The Previous Blockouts list lets you manage them all.

Only one blockout can be active at a time.

## Scene cleanup

FBG is designed for iteration - you can generate blockouts, remove them, bake rigs, rebake, and repeat without worrying about leftover data accumulating in your scene. When you delete a blockout through the FBG panel, the add-on removes not just the visible objects but also the associated data blocks: meshes, actions, and any other managed data.

The same applies to bake operations. Re-baking a rig cleans up the previous bake's data before creating the new one.

This cleanup only works when you use FBG's own controls to remove things. If you manually delete blockout objects through Blender's outliner or viewport, the associated data blocks may be left behind. For the cleanest results, always use the FBG panel's delete controls.

---

With these concepts in mind, head to [Proportions](proportions/index.md) to start shaping your figure's build.
