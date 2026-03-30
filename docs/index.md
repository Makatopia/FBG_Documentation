# Figure Blockout Generator

Figure Blockout Generator (FBG) is a Blender add-on that procedurally generates poseable human blockout figures from proportion-based rules, directly inside Blender as native mesh objects.

The proportions follow the cranial-unit method associated with Robert Beverly Hale, where the skull measurement serves as the base unit for defining the entire figure. You choose a height, a gender, and a proportion type - and FBG builds a complete blockout that you can then reshape, pose, animate, and bake into a standard Blender rig.

<!-- TODO: hero image - posed figure with landmarks visible, showing what FBG produces -->
<!-- ![FBG overview](assets/images/hero-overview.avif) -->

## Why FBG exists

The initial blocking phase of a figure - whether for sculpting, concept work, or animation prototyping - is deceptively hard to get right. If the proportions are off early, everything built on top inherits those problems, and the further you go the harder they are to fix.

FBG was built to solve that. Instead of eyeballing proportions, you start from a figure whose proportions are defined by a proven method and fully adjustable to your needs. The result is a blockout you can trust as a starting point - not an anatomy reference, but a solid, proportioned foundation to build on.

## What you can do with it

**Generate a figure** with a single button press. You select a preset, and FBG procedurally builds the entire figure as normal Blender mesh objects. From there, you can adjust the height, gender, proportion type, and body build - the figure regenerates to reflect your changes. You can also choose the underlying geometry type (UV Sphere, Quad Sphere, or Cube) and control the resolution to suit your workflow.

<!-- TODO: side-by-side - male/female or realistic/idealized comparison -->
<!-- ![Figure generation](assets/images/generate-comparison.avif) -->

**Shape the proportions** to match your target character. Structure controls adjust limb ratios, shoulder width, hip width, and other body build parameters. Volume controls adjust the visual mass of each body area - how full or lean the neck, arms, torso, and legs appear.

**Visualize with landmarks.** FBG can generate anatomical landmark lines on the blockout, marking key reference points across the body. Static landmarks show fixed reference points; Pose landmarks move with the figure as you pose it, so you can check where those points end up in any given pose.

<!-- TODO: landmarks image - figure in contrapposto with pose landmarks visible -->
<!-- ![Landmarks](assets/images/landmarks-example.avif) -->

**Pose the figure** through focused body-section controls in the UI. Rather than grabbing bones in the viewport, you work with properties that map to specific anatomical motions - arm abduction, shoulder elevation, foot roll, finger curl, and many others. This is an unconventional approach, but it keeps posing predictable and approachable, especially for users who are not experienced riggers.

<!-- TODO: pose UI screenshot or posed figure example -->
<!-- ![Pose](assets/images/pose-example.avif) -->

**Animate with Pose Combos** - an original system that bundles multiple pose properties into a single controllable unit. Define start and end values for any group of motions, then drive them all with one slider. Layer multiple combos, crossfade between them, shape their easing - and keyframe everything through Blender's standard animation workflow.

**Bake to a clean armature** when you need the motion on a real rig. FBG generates a proportion-aware Blender armature that matches your figure's build and bakes the animation into a standard Action - no constraints, no drivers, no Python dependencies. The result is ready for character binding or export.

## How these docs are organized

| Section | What it covers |
|---|---|
| [Installation](installation.md) | How to install the add-on in Blender |
| [Getting Started](getting-started.md) | Generating your first blockout and navigating the UI |
| [How FBG Works](how-fbg-works.md) | Active/finalized workflow, regeneration, and core concepts |
| [Proportions](proportions.md) | Structure and Volume controls for shaping the figure |
| [Pose](pose/index.md) | Per-section pose controls for the entire body |
| [Pose Combos](pose-combos.md) | Bundling, layering, and animating multi-property pose units |
| [Animation](animation.md) | Keyframing, playback, and animation workflow |
| [Baking](baking.md) | Generating armatures and preparing blockouts for rendering |
