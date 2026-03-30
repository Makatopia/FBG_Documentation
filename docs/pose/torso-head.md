# Torso & Head

This section covers spinal posing from the lumbar through the cervical spine, and the head. Global intent controls handle the broad trunk shape; per-segment controls let you refine specific regions where needed.

<!-- TODO: screenshot - the Torso & Head section expanded in the Pose panel -->
<!-- ![Torso & Head section](../assets/images/pose-torso-head-overview.avif) -->

## At a glance

**Torso** - three global controls distributed across the spine:

- `Flexion` bends the trunk forward or backward - lumbar-dominant.
- `Rotation` twists the trunk - thoracic-dominant.
- `Lateral` side-bends the trunk - more evenly shared.

**Spine Segments** - per-segment additive refinement for L5, L3, T12, T6, C7, and C4.

**Neck** - three global controls distributed across the cervical spine.

**Head** - `Pitch`, `Yaw`, and `Roll` applied on top of the full neck result.

## Spine regions

The spine controls reference specific regions and vertebrae by their anatomical labels. The spine runs from bottom to top through four regions:

- **Sacrum and coccyx** - the base of the spine, fused into the pelvis. These segments carry no independent pose controls - they move rigidly with the pelvis, rotating around the L5 pivot.
- **Lumbar** - the lower back. The controls reference two lumbar vertebrae: L5 (lower lumbar) and L3 (mid lumbar).
- **Thoracic** - the mid and upper back, where the ribs attach. The controls reference T12 (lower thoracic) and T6 (mid thoracic).
- **Cervical** - the neck. The controls reference C7 (lower cervical) and C4 (mid cervical). C1 (at the skull base) is the head's rotation pivot.


<div class="grid" markdown>

![Spine regions](../assets/images/pose-torso-spine-regions.avif)

![Spine regions2](../assets/images/pose-torso-spine-regions2.avif)

</div>


## Torso

`Flexion`, `Rotation`, and `Lateral` are global spine intent controls. They are not applied evenly across the spine - each axis has a different distribution that reflects how the real spine moves.

`Flexion` bends the trunk forward (positive) or backward (negative). The motion is lumbar-dominant: the lower back carries most of the bend.

`Rotation` twists the trunk. Thoracic-dominant: the mid and lower thoracic segments carry most of the rotation while lumbar rotation stays limited - which matches real anatomy where thoracic vertebrae rotate more freely than lumbar.

`Lateral` side-bends the trunk. More evenly shared across the lumbar and thoracic spine compared to the other two axes.

### Segment distribution

The exact split for each axis:

| Segment | Flexion | Rotation | Lateral |
|---------|---------|----------|---------|
| L5 (lower lumbar) | 40% | 5% | 30% |
| L3 (mid lumbar) | 35% | 25% | 30% |
| T12 (lower thoracic) | 20% | 40% | 25% |
| T6 (mid thoracic) | 5% | 30% | 15% |

This explains why a strong `Flexion` reads as a lumbar bend while a strong `Rotation` reads as a ribcage twist. The global sliders drive the intent; the distribution determines where that intent lands.

### Spine Segments

`Spine Segments` opens a per-segment refinement table. Each of the four thoracic and lumbar segments (T6, T12, L3, L5) exposes `Flexion`, `Rotation`, and `Lateral` channels. These are additive on top of the global torso result.

Use them when the global Torso controls get the broad shape right but a specific region needs correction - for example, flattening the lower thoracic while keeping the lumbar curve, or adding a local thoracic twist without affecting the lumbar.

<!-- TODO: screenshot - the Spine Segments foldout expanded -->
<!-- ![Spine Segments](../assets/images/pose-torso-spine-segments.avif) -->

## Neck

`Flexion`, `Rotation`, and `Lateral` distribute across two cervical regions - the lower cervical (C7) and mid cervical (C4).

| Segment | Flexion | Rotation | Lateral |
|---------|---------|----------|---------|
| C7 (lower cervical) | 60% | 100% | 80% |
| C4 (mid cervical) | 40% | 0% | 20% |

`Rotation` is concentrated entirely at C7 - the lower cervical region handles all neck yaw. `Flexion` and `Lateral` are shared between the two regions, with C7 carrying more of both.

The cervical segments in the `Spine Segments` foldout add local refinement on top of the neck result. C4 exposes `Flexion` and `Lateral` only - it has no rotation channel, matching the distribution above.

## Head

`Pitch`, `Yaw`, and `Roll` are applied on top of the full neck orientation.

- `Pitch` nods the head up or down.
- `Yaw` turns the head left or right.
- `Roll` tilts the head to the side.

The neck establishes where the head is pointing. The head controls add local refinement - look direction, nod, or tilt - without replacing neck motion.

## Update mode

The section header includes a compact update mode control. This affects when the trunk mesh deformation recalculates as you drag pose values.

- `Immediate` - deformation updates on every change. Most responsive but can be slower on complex scenes.
- `Deferred` - deformation updates after you stop dragging. Smoother interaction at the cost of a short delay. The delay duration is configurable next to the mode selector.
- `Off` - deformation does not update while posing. Fastest, but the mesh only reflects the pose when you re-enable updates.

For more detail on update modes, see [How FBG Works](../how-fbg-works.md#update-modes).
