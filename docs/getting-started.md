# Getting Started

## Your first blockout

To generate a blockout, open the FBG panel in the sidebar, select a preset, and click **Generate Blockout**. FBG builds the entire figure from scratch - a full human figure appears in your scene, ready to adjust.

<!-- TODO: screenshot - the Generate Blockout button / initial panel state -->
<!-- ![Generate button](assets/images/getting-started-generate.avif) -->

Once generated, the FBG panel expands to show the full set of controls. Everything you need to shape, pose, and animate the figure is here.

<!-- TODO: screenshot - the full FBG panel after generation, collapsed sections -->
<!-- ![FBG panel overview](assets/images/getting-started-panel.avif) -->

## The FBG panel

The panel is organized into four main sections, from top to bottom:

**Proportions** - controls the figure's build. This is where you set the gender, proportion type (realistic or idealized), height, and adjust the body structure and volume. Changes here regenerate the figure.

**Pose** - controls how the figure is posed. Each body region has its own sub-section with properties that drive specific anatomical motions. Posing is fully UI-driven - you work with sliders and values rather than grabbing controllers in the viewport.

**Pose Combos** - bundles multiple pose properties into controllable units. This section appears once you start creating combos, and is covered in detail in its own [documentation](pose-combos/index.md) page.

**Display** - controls how the blockout looks in the viewport. This includes the geometry type and resolution, body part visibility toggles, landmark overlays, and the info overlay.

## What gets created in your scene

When you generate a blockout, FBG creates a collection in your scene that contains all the mesh objects that make up the figure. Each body part is a separate Blender object - this is what allows individual parts to be posed and transformed independently.

FBG also creates a controller object that holds all the properties and animation data for that blockout. You will see it in the collection alongside the mesh objects.

<!-- TODO: screenshot - outliner showing the FBG collection structure -->
<!-- ![Collection structure](assets/images/getting-started-collection.avif) -->

## Next steps

Now that you have a blockout in your scene, read [How FBG Works](how-fbg-works.md) to understand the active/finalized workflow and how changes affect the figure - or jump straight into [Proportions](proportions/index.md) to start shaping the figure.
