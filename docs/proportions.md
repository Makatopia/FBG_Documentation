# Proportions

Proportions is the first thing you work with after generating a blockout. It defines the figure's body build - everything from overall height and proportion type down to the limb lengths and segment ratios - before you start posing or animating.

FBG's proportion system is built on the **cranial-unit method**, an approach to figure proportion associated with Robert Beverly Hale. The idea is simple: take the cranium - the upper, spherical part of the skull - and use it as a measuring unit for the entire body. A full figure can be measured in a specific number of these cranial units (CU), and each body segment occupies a defined share of that total. When you change one proportion, every related segment adjusts in step, because they're all expressed in the same unit. This is what keeps the figure coherent - proportions don't drift independently the way they would with freeform scaling.

<!-- TODO: screenshot - the Proportions section in the UI, expanded -->
<!-- ![Proportions panel](assets/images/proportions-panel.avif) -->

## At a glance

**Preset** - picks a starting point (male/female, realistic/idealized, height) that configures the entire figure at once.

**Gender** - switches between Male and Female. This reshapes the figure across virtually every body region - skeletal widths, joint angles, limb cross-sections, torso shape, and more.

**Proportion type** - switches between Realistic (11.5 CU) and Idealized (12 CU). Realistic follows average human measurements; Idealized shifts extra length into the legs for a more stylized look.

**Height** - sets total figure height.

**Structure** - the figure's skeletal build: limb lengths, segment ratios, widths. Changes how the figure moves when posed.

**Volume** - visual mass only: how thick or lean each area appears. Does not affect the skeleton, posing, or rig generation.

---

## Preset

The preset dropdown dictates a starting point for the blockout. Four presets are available:

- **Female Realistic** (1.65m) - 11.5 CU proportions
- **Female Idealized** (1.80m) - 12 CU proportions
- **Male Realistic** (1.80m) - 11.5 CU proportions
- **Male Idealized** (1.95m) - 12 CU proportions

Each preset configures the full proportion set, so you get a complete, proportionally sound figure immediately. From there you can refine any value - gender, proportion type, height, Structure, and Volume - to shape the figure further. Once you adjust anything manually, the preset switches to **Custom** to reflect that your configuration no longer matches a built-in preset.

## Gender

Switches between **Male** and **Female**. This is not a surface-level change - it reshapes the entire figure. Male and female proportions in FBG differ across virtually every body region: skeletal widths (pelvis, shoulders, ribcage), joint angles (the leg's bicondylar angle or the arm's carrying angle), limb cross-sections, torso shape, waist definition, and more. These differences have been individually tuned so that even at the blockout level, the figure reads clearly as male or female.

## Proportion type

Switches between **Realistic (11.5 CU)** and **Idealized (12 CU)**.

Both modes use the cranial-unit method, but distribute the units differently across the body:

- **Realistic (11.5 CU)** - proportions closer to average human measurements.
- **Idealized (12 CU)** - the extra half unit goes into leg length, which reduces the head and torso relative to the legs. This produces the kind of elongated proportions common in figure drawing and character design.

!!! info "Idealized Proportions"
    The Idealized mode is FBG's own extension of the cranial-unit system - it expands upon the standard method by offering a second set of proportions designed for a stylized or heroic look.

## Height

Sets the figure's total height. The property uses Blender's unit system, so you can type values in any supported unit (e.g., `6ft`) and Blender will convert automatically.

Changing the height scales the cranial unit proportionally - a taller figure has a larger base unit, so the entire body scales up uniformly. Height alone does not change the figure's build. To control how that height is distributed across the body - longer legs relative to the torso, different limb ratios - use the Structure controls.

## Structure

Structure defines the figure's skeletal proportions - the build itself, limb lengths, shoulder and hip widths, and so forth. These are not cosmetic changes. Structure affects how the figure moves when posed and determines the armature that [Bake to Rig](baking.md) generates.

<!-- TODO: screenshot - the Structure sub-foldout expanded -->
<!-- ![Structure controls](assets/images/proportions-structure.avif) -->

The sub-foldout header includes an [update mode selector](how-fbg-works.md#update-modes) and a reset button that returns all values to their defaults.

### Upper body

`Shoulder Width` and `Hip Width` control the breadth of the shoulder girdle and the pelvis. These set the figure's overall frame - narrow or wide - and influence how the arms and legs sit relative to the torso.

### Arms

`Arm Length` adjusts overall arm length. The scaling is not uniform across the limb - the forearm responds more than the upper arm, following how real human proportions naturally vary (distal segments like the forearm and hand show more variation than proximal ones like the humerus). `Arm Segment Ratio` goes a step further and lets you explicitly redistribute length between the upper arm and forearm while keeping total arm length the same. Positive values shift length toward the forearm, negative toward the upper arm.

`Hand Length` and `Hand Width` size the hands. Like arm length, hand scaling is weighted - fingers change more than the palm.

### Legs

`Leg/Torso Ratio` shifts proportion between the torso and legs while keeping total figure height the same. Positive values lengthen the legs and shorten the torso; negative values do the opposite. `Leg Segment Ratio` redistributes length between the thigh and shin in the same way - positive values lengthen the shin, negative values lengthen the thigh.

`Foot Length` and `Foot Width` size the feet. Foot scaling follows the same distal-weighting principle - the toe region changes more than the heel.

!!! info "Allometric scaling"

    Length properties like `Arm Length`, `Hand Length`, and `Foot Length` don't scale every segment equally. They use allometric weighting - distal segments (forearm, fingers, toes) naturally vary more than proximal ones (upper arm, palm, heel), and FBG's scaling reflects that. The result is that adjustments feel proportionally natural rather than mechanical.

    The ratio sliders (`Arm Segment Ratio`, `Leg Segment Ratio`, `Leg/Torso Ratio`) redistribute length between two segments without changing the total, and are clamped to anatomically plausible bounds.

## Volume

Volume controls the visual mass of each body region - how thick or lean each area appears. Unlike Structure, Volume is purely visual. It does not change the skeleton, does not affect how the figure moves when posed, and does not influence armature generation. Think of Structure as the build and Volume as the mass on top of it.

<!-- TODO: screenshot - the Volume sub-foldout expanded -->
<!-- ![Volume controls](assets/images/proportions-volume.avif) -->

The sub-foldout header includes a reset button that returns all values to their defaults.

### Arms

`Deltoid`, `Upper Arm`, `Forearm`, and `Fingers` - thickness of the shoulder cap and each arm segment down to the fingers.

### Torso

`Neck`, `Ribcage`, and `Waist` - thickness from the neck through the ribcage and waist.

### Legs

`Thigh` and `Calf` - thickness of the upper and lower leg.

---

With the figure's build defined, head to [Pose](pose/index.md) to start shaping the figure's pose.
