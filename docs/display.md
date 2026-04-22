# Display

The Display section controls the blockout's geometry, visible body regions, landmarks, and info overlay.

## Geometry

Three geometry modes control the base shape of the generated objects:

- **UV Sphere** -- smooth, rounded geometry. Resolution is controlled by `Segments` and `Rings`.
- **Quad Sphere** -- evenly distributed quads projected onto a sphere. Resolution is controlled by `Subdivisions`.
- **Cube** -- angular, box-based geometry with flat faces. No resolution controls.

The optional `Spine` object is separate from these base modes. It is built as its own custom mesh rather than from the same body-part primitives.

Changing the geometry mode or resolution triggers a [rebuild](how-fbg-works.md#what-rebuilds-the-blockout). Higher resolution produces smoother forms but makes rebuilds, [mesh deformation](how-fbg-works.md#mesh-deformation), and animation playback heavier.

`Wireframe` switches all generated objects between wireframe and solid display. This toggles Blender's `Display As` property between `Wire` and `Textured` on every generated mesh.

![Geometry modes comparison](assets/images/getting-started-geometry-modes.avif){ .zoom }

## Visibility

Four toggles control which body regions are included in the blockout:

- `Arms`
- `Legs`
- `Shoulder Girdle`
- `Spine`

Toggling a region on or off triggers a targeted [rebuild](how-fbg-works.md#what-rebuilds-the-blockout) of that section.

`Spine` enables a dedicated spine visualization object. It is built as a single mesh sampled through vertebral levels from the coccyx to C1, and [updates](how-fbg-works.md#update-modes) with the solved spinal curve as the figure is posed.

![Visibility toggles](assets/images/display-visibility.avif){ .zoom }

## Landmarks

FBG provides two independent landmark systems that can be enabled separately or together. They are guide markers for reading the figure -- not a strict anatomy lesson or a guarantee of exact surface anatomy.

![Landmarks](assets/images/display-landmarks.avif){ .zoom }

### Controls

The Landmarks UI includes:

- `Static` enables CU-based proportion landmarks.
- `Pose` enables landmarks that follow the posed figure.
- `Placement` controls how central body landmarks in Pose mode are positioned.
- `Show Pose Names` toggles Blender name overlays for Pose landmarks.
- `Square` and `Cross` control how landmark guides are drawn.
- The **?** button opens a glossary popup with a short description of each landmark name.

![Controls](assets/images/display-landmark-controls.avif){ .zoom .img-center width=50% }

### What they represent

#### Static landmarks

Static landmarks are fixed proportion guides tied to the blockout's proportional setup. They behave like a vertical ruler built from FBG's Cranial Unit system -- placed at specific CU heights, staying fixed relative to the figure's proportional scaffold, and not following the live pose.

They cover key proportion levels from `Top of Head` down to `Heel`.

#### Pose landmarks

Pose landmarks are generated from the current posed figure rather than fixed proportion levels. They are driven by FBG's solved [anchor chain](how-fbg-works.md#the-anchor-system), so they update as the figure moves.

Pose landmarks do not match the Static set one-to-one. The torso and head reuse many of the same landmark names, but the limb set is different: Pose landmarks add the arms, use per-side joints, and use ankle markers instead of the Static heel level.

Which Pose landmarks appear depends on which body parts are visible.

### Placement

Pose landmarks offer two placement modes for the central body landmarks:

- **Center** -- landmarks are placed as centered height markers.
- **Approx** -- landmarks are placed at approximate surface positions in X and Y.

!!! tip "Practical Note"

    The landmark system is meant to help you read the figure, not to replace judgment.
    Real bodies vary, and a blockout is always a simplification.

    For smoother playback, it is also recommended to disable landmarks when animating.

![Static vs Pose landmarks](assets/images/display-landmarks-static-pose.avif){ .zoom }

## Info Overlay

`Info Overlay` shows a text summary of the current blockout definition in the viewport. It displays the gender, total height, proportion type, and cranial unit count -- for example:  
`FEMALE | 1.65m | Realistic (11.5 CU)`.
