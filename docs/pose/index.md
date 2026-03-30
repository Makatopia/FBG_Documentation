# Pose

FBG's posing workflow is primarily **property-driven** rather than based on a traditional viewport controller rig. Instead of grabbing bones and rotating controllers in the 3D View, you pose the figure through sliders and values in the FBG panel.

That can feel unusual at first if you are used to conventional rigging workflows. The tradeoff is that FBG can build higher-level behavior into its pose properties, so a single control can coordinate several related adjustments under the hood.

A good example is torso flexion. When you bend the torso forward, the motion is not applied evenly across the spine. It is distributed across four vertebral regions using anatomically researched weights - the lumbar spine carries most of the flexion, the thoracic spine contributes less. One slider, but the spine bends the way a real spine bends. The same principle applies throughout FBG's pose system: properties are designed to produce anatomically informed results, not mechanical ones.

This page is an overview of the Pose section. Each body region has its own page with the detailed controls.

<!-- TODO: screenshot - the Pose section overview with the main foldouts visible -->
<!-- ![Pose section overview](assets/images/pose-panel-overview.avif) -->

## Pose layout

The Pose section is organized into body regions that mirror the UI layout:

- [Root](root.md)
- [Arms & Shoulders](shoulders-arms.md)
- [Hands](hands.md)
- [Torso & Head](torso-head.md)
- [Pelvis](pelvis.md)
- [Legs](legs.md)
- [Feet](feet.md)

The **Arms**, **Hands**, **Legs**, and **Feet** sections are bilateral and work with FBG's mirror and side-filter tools. **Root**, **Torso & Head**, and **Pelvis** are central sections.

## Shared controls

Several controls affect the whole Pose workflow rather than a single body section.

### Pose header

At the top of the Pose section, FBG provides:

- a **limit bypass** toggle
- a **global reset** button for all pose properties

The limit bypass toggle removes FBG's default pose-property limits. Enable it when you need to push a pose beyond the usual working range, whether for stylization, exaggeration, or offset and target adjustments. When disabled again, any out-of-range values are clamped back into the standard limits.

### Mirror and side filters

Mirror is on by default. In mirrored mode, the right-side controls drive both sides together. This is especially important for Pose Combos, because combos also respect the current Mirror state. If a combo includes bilateral pose properties while Mirror is enabled, the right side acts as the driving side for both halves of the pose.

When you turn Mirror off, the left and right values become independent, and **L** / **R** visibility toggles appear so you can focus on one side at a time. If the left side is still untouched, FBG copies the current right-side pose over on that first mirror-off switch so the visible pose stays intact. After that, if the left side already has its own values, toggling Mirror on and off preserves them.

<!-- TODO: screenshot - Mirror disabled, showing L/R filters, Flip Pose, and global copy-symmetry buttons -->
<!-- ![Mirror and symmetry controls](assets/images/pose-mirror-controls.avif) -->

### Flip and copy symmetry

When Mirror is off, FBG exposes extra symmetry tools:

- **Flip Pose** swaps left and right pose values, including the necessary sign changes for centerline motions such as pelvis rotation or torso lateral bend. It is similar in spirit to Blender's Paste Pose Flipped feature.
- **Directional copy symmetry**, shown as left and right arrow buttons, copies the current pose from one side to the other as a one-time action across the whole Pose section. If you only want to copy one body region, use the section-level arrow buttons in the bilateral foldouts.

### Section resets and update modes

Each pose section has its own reset button, so you can clear one region without affecting the rest of the figure. Bilateral sections also display section-level copy-symmetry buttons, which affect only the properties from that section.

Some sections also expose performance-related update controls in their headers:

- **Arms & Shoulders** includes controls for twist update behavior
- **Torso & Head** includes controls for torso-bend update behavior

These settings are covered in more detail on [How FBG Works](../how-fbg-works.md#update-modes).

<!-- TODO: screenshot - section headers showing per-section reset, symmetry buttons, and update-mode controls -->
<!-- ![Pose section header controls](assets/images/pose-section-header-controls.avif) -->

## Working approach

The Pose section can look dense at first, because FBG exposes many dedicated anatomical motions instead of hiding everything behind a few generic controllers. In practice, the workflow becomes much easier once you learn where each body region lives and which controls are meant for broad gesture versus local refinement.
