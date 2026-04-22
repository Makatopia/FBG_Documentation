# Getting Started

## Generating a blockout

Open the FBG panel in the sidebar, pick a preset, and click **Generate Blockout**.

![Generate button](assets/images/getting-started-generate.avif){ .zoom }

FBG generates the figure as a set of separate mesh objects organized into a collection hierarchy in your Outliner. These are normal Blender objects.

While the blockout is active, though, [rebuild-triggering changes](how-fbg-works.md#what-rebuilds-the-blockout) can still replace parts of the generated geometry. For more on what this means and how the generation pipeline works, see [How FBG Works](how-fbg-works.md#generated-from-scratch).

## The FBG panel

Once a blockout is generated, the panel expands into the active blockout interface.

![FBG panel overview](assets/images/getting-started-active-panel.avif){ .zoom }

At the top, a header row shows the blockout name and a set of controls:

- **Animation Playback** -- toggles runtime [animation evaluation](animation.md) for this blockout
- **Controller Visibility** -- reveals and selects the [controller object](how-fbg-works.md#controller-object)
- **Regenerate** -- forces a fresh rebuild from the current settings
- **Delete** -- removes the blockout and its managed data


Below the header, the panel is split into four collapsible sections:

- **[Proportions](proportions.md)** -- the figure's base definition: preset, gender, proportion type, height, and the Structure and Volume controls.
- **[Pose](pose/index.md)** -- property-driven posing through dedicated controls for each body region.
- **[Pose Combos](pose-combos.md)** -- coordinated pose control: drive groups of properties through single sliders, with capture tools, layered evaluation, and presets.
- **[Display](display.md)** -- geometry mode and resolution, visibility toggles, landmark guides, and the info overlay.

A **Finalize** button above these sections closes the blockout for editing. From there you can generate another blockout, or work with finalized ones. See [Active and finalized blockouts](how-fbg-works.md#active-and-finalized-blockouts) for more on the lifecycle.

### Finalized blockouts

![Previous Blockouts](assets/images/getting-started-finalized-panel.avif){ .zoom }

After finalizing, the panel shows a **Previous Blockouts** list. At the top of this section, two bake operations are available -- **[Bake to Rig](baking.md#bake-to-rig)** and **[Bake for Render](baking.md#bake-for-render)** -- which operate on finalized blockouts that have `Animation Playback` enabled.

Each finalized blockout has its own row with controls:

- **Animation Playback** -- toggles runtime [animation evaluation](animation.md) for that blockout
- **Deform Updates** -- toggles mesh deformation during playback (only shown when animation is enabled)
- **Visibility** -- shows or hides the blockout collection
- **Reactivate** -- makes that blockout active again for further editing
- **Delete** -- removes the blockout and its managed data

You can have multiple finalized blockouts in the same scene, each with independent settings and animation. Only one blockout can be active at a time.

## What gets created

Each blockout is generated into its own collection in the Outliner. Inside it, FBG creates the figure objects, optional landmark objects, optional text overlays, and a controller object that stores the blockout's settings and animation data.

These are normal Blender objects. You can inspect them, edit them, or use them like any other scene data. However, while the blockout is active, some changes will [rebuild](how-fbg-works.md#what-rebuilds-the-blockout) generated objects. If you want to start editing the generated meshes manually, finalize the blockout first.

A typical blockout collection looks like this:

```
Blockout_F_1.65m_Real
  Figure              -- objects that make up the figure
    Torso
    Arms
      Hands
    Legs
      Feet
  Lines               -- landmark guide lines
  Text                -- info text and proportion landmark labels
  Blockout_F_1.65m_Real_CTRL   -- controller object
```

The main collection name reflects the current preset -- gender, height, and proportion type. FBG tracks the blockout by an internal ID rather than the collection name, so renaming it does not break the blockout. However, if the blockout is active, a later regenerate or rebuild may rename the main collection to match the current preset again.

**Figure** holds the generated mesh objects in subcollections grouped by region.
**Lines** holds [landmark](display.md#landmarks) objects when those are enabled.
**Text** holds static landmark labels and the info overlay when those are enabled.

The [controller object](how-fbg-works.md#controller-object) and any pose helper empties (Root Pivot, Knee Pole, Elbow Pole) sit directly in the main collection.

## Next steps

- [How FBG Works](how-fbg-works.md) -- blockout lifecycle, rebuild behavior, mesh deformation, and pose updates
- [Proportions](proportions.md) -- the Cranial Unit system, presets, Structure and Volume
- [Display](display.md) -- geometry modes, visibility, and landmarks
