# Pose Combos

Pose Combos let you bundle multiple pose properties into one controllable unit. Instead of keyframing ten sliders independently, you define a combo that drives all of them together through a single `Blend` slider. Combos can be layered, crossfaded, and animated using Blender's standard keyframe workflow.

<!-- TODO: screenshot - Pose Combos section with one or two combos expanded, showing property rows and Blend/Influence sliders -->
<!-- ![Pose Combos overview](assets/images/pose-combos-overview.avif) -->

## At a glance

- A combo holds a list of properties, each with a `Start` and `End` value (and an optional `Mid`).
- `Blend` interpolates all properties simultaneously from their Start to End values.
- `Influence` controls how strongly the combo contributes to the final result.
- Enabled combos claim their properties -- those properties are driven by the combo system, not by direct slider input.
- Combos are evaluated top to bottom. Order matters when two combos drive the same property.
- Capture tools populate Start/End/Mid values directly from the current figure pose.
- Each combo stores a snapshot of pose mode flags (Mirror, FK/IK, etc.) that are restored when the combo is enabled.
- Combo setups can be saved as presets and reused across files or shared with other artists.

## Creating a combo

Click the `+` button in the Pose Combos section header to add a new combo. The combo starts empty with no properties.

To add properties, use the dropdown selector at the bottom of the expanded combo, or click the search button to find properties by name. Adding a bilateral property (for example, `Arm Abduction R`) also auto-adds its counterpart (`Arm Abduction L`).

Once properties are added, set their `Start` and `End` values directly, or use the capture tools to populate them from the current pose.

## Core controls

### Enabled

Toggles whether the combo participates in evaluation.

When **enabled**, the combo claims its properties. Those properties are controlled by the combo system every time the stack evaluates. Adjusting a claimed property directly in the Pose section will still work visually, but the next evaluation will overwrite it.

When **disabled**, the combo is fully muted and its properties are released. Other combos or direct input can control them again.

!!! note "Influence = 0 is not the same as disabled"
    A combo at Influence = 0 still claims its properties -- it just contributes nothing to their values. Those properties will sit at their rest-pose defaults (or at whatever earlier combos resolved). To fully release properties back to direct control, disable the combo.

### Blend

Controls what pose the combo produces internally.

- `Blend = 0` -- all properties are at their `Start` values
- `Blend = 1` -- all properties are at their `End` values
- `Blend = 0.5` -- halfway between Start and End (or at `Mid` values, if Midpoint is enabled)

Blend answers: *what pose does this combo want?*

Start and End values are set per property. Blend drives the interpolation across all of them at once.

### Influence

Controls how much of this combo's result reaches the final pose.

- `Influence = 1` -- the combo fully applies, overriding whatever the stack resolved before it
- `Influence = 0.5` -- the result is blended halfway between the previous stack value and this combo's output
- `Influence = 0` -- the combo contributes nothing (but still claims its properties)

Influence answers: *how much does this combo contribute?*

The math is one linear interpolation per property:

```
result = previous_value * (1 - influence) + combo_value * influence
```

`previous_value` is the accumulated result of all earlier combos in the stack, so Influence effectively weights this combo against everything above it.

**Example:** Two combos both drive `Arm Abduction`. Combo A is above Combo B in the stack, both at Blend = 1.

- Combo A: End = 90, Influence = 1 -- resolves to 90
- Combo B: End = 45, Influence = 1 -- fully overrides A. Final result: 45
- Combo B: End = 45, Influence = 0.5 -- blends halfway between A's result (90) and B's value (45). Final result: 67.5

### Easing

Changes the response curve of the `Blend` slider. Four modes are available:

- **Linear** -- constant speed from Start to End
- **Ease In** -- starts slow, accelerates toward End
- **Ease Out** -- starts fast, decelerates toward End
- **Ease In-Out** -- slow at both ends, faster in the middle

Easing only affects `Blend`. It does not affect `Influence`.

## Midpoint

When Midpoint is enabled (the curve icon toggle), each property gets a third value -- `Mid` -- in addition to `Start` and `End`.

- `Blend = 0` -- Start
- `Blend = 0.5` -- Mid
- `Blend = 1` -- End

The interpolation passes smoothly through Mid without a hard velocity break, using a cubic curve that maintains continuity. This lets you define a three-stage motion through a single slider -- for example, an arm that rises and then returns, or a weight shift that overshoots before settling.

When Midpoint is first enabled, all Mid values initialize to the average of each property's Start and End. `Capture Mid` is available when Midpoint is on.

<!-- TODO: clip - Blend slider going 0 to 1, figure arm rising to mid then returning, showing three-stage motion through one slider -->
<!-- ![Midpoint motion](assets/images/pose-combos-midpoint.avif) -->

## Per-property refinement

Each property row has a graph icon toggle that reveals two additional controls: `Offset` and `Adjust`. These allow independent per-property timing and value corrections without leaving the combo system.

### Offset

Shifts *when* a property's motion happens within the `Blend` range. The full Start-to-End value range is always preserved -- it is compressed into a shifted window of the Blend range.

- `Offset = 0` -- normal behavior, property follows Blend directly
- `Offset < 0` (lag) -- the property starts moving later. At `Offset = -0.2`, the property holds at Start while Blend goes from 0 to 0.2, then completes its full motion between Blend 0.2 and 1.0.
- `Offset > 0` (lead) -- the property finishes early. At `Offset = 0.2`, the property completes its full motion by Blend 0.8, then holds at End.

Use Offset to stagger body parts within a single combo -- for example, the arm leads while the pelvis lags, all driven by one Blend slider.

<!-- TODO: clip - same Blend sweep on two properties side by side, one with Offset = 0 and one with Offset = -0.3, showing the timing difference -->
<!-- ![Offset timing](assets/images/pose-combos-offset.avif) -->

### Adjust

A normalized additive correction applied on top of the interpolated value. The correction is expressed as a fraction of the property's motion range -- the full peak-to-peak span from Start to End (including Mid when Midpoint is enabled).

- `Adjust = 0` -- no effect, the property uses its normal interpolated value
- `Adjust = 0.1` -- adds 10% of the motion range at every Blend position
- `Adjust = -0.05` -- subtracts 5% of the motion range at every Blend position

The correction is constant regardless of where Blend is. **Example:** a property with Start = 0 and End = 90 has a motion range of 90. With Adjust = 0.1:

- Blend = 0.0: interpolated = 0, correction = +9, result = 9
- Blend = 0.5: interpolated = 45, correction = +9, result = 54
- Blend = 1.0: interpolated = 90, correction = +9, result = 99

When Midpoint is enabled, the range covers the full excursion of the curve. For example, Start = 0, Mid = -45, End = 90 has a range of 135 (from -45 to 90). Positive Adjust always pushes values higher in value space; negative always pushes lower.

Because Adjust is normalized to the motion range, its f-curve stays at a similar scale to Blend and Influence. Keyframe it for per-property animation control within the combo system -- overshoot, settle, or custom timing on individual properties without adding separate pose keyframes.

## Capture tools

The capture tools populate a combo's property values from the current figure pose. Each capture also snapshots the current mode flags into Stored Options automatically.

### Capture Start, End, and Mid

Saves the current pose into `Start`, `Mid` (if midpoint is enabled) or `End` values. Sets `Blend` to 0 (Capture Start), 0.5 (Capture Mid) or 1 (Capture End) to match, since the figure is already at that pose.

Capture auto-adds properties to the combo based on two conditions:

- The property differs from its rest-pose default, **or**
- The property is already claimed by another enabled combo (even if the current value equals the default -- this allows capturing an explicit return-to-default override on top of another combo)

`Capture Mid` is only available when Midpoint is enabled.

### Capture Exclusive

A filter toggle on the capture row. When enabled, capture skips any property that is already present in another enabled combo.

This is useful when layering a new combo on top of an existing setup. With Exclusive on, only the properties not already owned elsewhere are captured -- the existing combo's properties are left untouched.

### Capture Options

Snapshots only the mode flags (Mirror, Arm Inherit Torso, Arm FK/IK, Leg FK/IK, Limits Bypass) into the combo's Stored Options, without touching property values. This runs automatically as part of every Capture Start/End/Mid operation and is also available separately to refresh the mode snapshot without re-capturing values.

#### Stored Options

Each combo stores a snapshot of certain pose mode toggles. When the combo is enabled -- either manually or via a keyframed `Enabled` channel -- those stored options are restored to match the context the combo was authored in.

What gets stored:

- Pose Mirror
- Arm Inherit Torso (R and L)
- Arm FK/IK mode (R and L)
- Leg FK/IK mode (R and L)
- Pose Limits Bypass

The Stored Options row in the expanded combo shows a compact summary of which flags are active in the snapshot. The recapture button (refresh icon) updates the snapshot from current settings without touching any property values.


## Combo stack evaluation

When any combo changes (Blend, Influence, Enabled, or a per-property value), the full stack evaluates to produce the final pose:

1. **Collect** all properties from all enabled combos. These are "driven" -- the combo system controls them for this evaluation.
2. **Reset** every driven property to its rest-pose default. This ensures results are deterministic regardless of previous state.
3. **Walk** through enabled combos in list order (top to bottom). For each combo:
    - Apply easing to the Blend value.
    - For each property: apply Offset remapping to the Blend position, interpolate between Start/End (or Start/Mid/End), add the Adjust correction.
    - Blend the combo's result into the accumulated values so far using Influence.
4. **Write** the final values to the figure.

Order matters. A later combo applied with Influence = 1 fully overrides shared properties from earlier combos. With Influence between 0 and 1, it blends with them. With Influence = 0, it contributes nothing but still holds its properties claimed.

## Layering combos

Multiple combos can drive the same properties at the same time, producing blended or layered results.

**Crossfading:** animate one combo's Influence from 0 to 1 while the other's goes from 1 to 0. The figure blends from one pose to the other over those frames.

**Stacking partial contributions:** multiple combos at Influence < 1 each contribute a portion of their result. Earlier combos set a baseline; later ones blend on top.

**Hard cuts:** keyframe `Enabled` on/off, or keyframe `Influence` with a constant/stepped interpolation curve (0, then immediately 1, no in-between frames).

For more on animating combos -- including the playback architecture and the ownership rule during animation -- see [Animation](animation.md).

## Combo management

The combo list header provides **Export**, **Import**, and **Presets** buttons for saving and loading combo setups. Each combo row has buttons to move it **up or down** in the stack, **duplicate** it, or **delete** it.

- **Move up / down** -- reorders the stack. Affects evaluation order when combos share properties.
- **Duplicate** -- creates a full clone of the combo including all property values, Start/End/Mid, Offset, Adjust, and Stored Options. Useful as a starting point for variations.
- **Swap Start/End** -- reverses the combo's motion direction. Swaps all Start and End values, negates all Offset values, and inverts the current Blend position. The result is the same motion played in reverse.

## Presets

Combo setups can be saved and reused in two ways.

**Presets popup** (inside Blender): saves to the Blender user config folder (`fbg_presets`). Presets saved here are available from the popup across different `.blend` files without needing to manage external files. Load replaces the current combo list; Append adds to it.

**Export / Import JSON**: saves to any file path you choose. Useful for backups, version control, or sharing setups between artists.

Both methods use the same data format.

**What gets stored:**

- All combo slots with their full state: property list, Start/End/Mid values, Blend, Influence, Easing, Midpoint, Offset, Adjust, Stored Options
- Preset context: global mode toggles and body proportions at the time of save

**Replace vs Append on load:**

- **Replace** -- clears the current combo list, applies preset context (mode toggles and proportions), and rebuilds the figure if the proportions differ from the current state.
- **Append** -- adds the preset's combos to the existing list, leaving the current body and mode context unchanged.

!!! tip "Replace restores the saved figure proportions"
    When loading with Replace, the body proportions from the time of save are applied along with the combos. This ensures the pose looks exactly as it did when saved -- a combo authored on one figure will not look different on a differently proportioned body. Use Append when you want the combos without changing the figure's current proportions.


