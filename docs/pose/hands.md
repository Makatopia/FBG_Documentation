# Hands

This section covers wrist orientation, finger curl and splay, and thumb position. The system is layered: a few broad controls establish most hand poses, while more specific channels are available when you need local refinement.

<!-- TODO: screenshot - the Hands section overview with wrist, finger, and thumb controls visible -->
<!-- ![Hands section overview](assets/images/pose-hands-overview.avif) -->

## At a glance

**Wrist** - `Flexion` and `Deviation` set the hand attitude. Together with [`Pronation`](shoulders-arms.md#fk-mode), they define the full wrist orientation.

**Fingers** - layered from broad to specific:

- `Relax` sets the resting posture (baseline curl and slight rest splay).
- `Curl Shape` and `DIP Lock` refine how curl distributes across the joints.
- `Finger Curl`, `Finger Abd`, and `MCP Ext` are the main shape controls.
- `Per-Finger Control` opens individual channels for each finger.

**Thumb** - independent from the finger system:

- `Thumb Curl` and `Thumb IP Lock` control the fold.
- `T Opp`, `T Abd`, and `T Roll` set the base placement.

## Joint terminology

The hand controls reference specific finger joints by their anatomical abbreviations. From base to tip:

- **CMC** - carpometacarpal joint, at the base of the thumb where it meets the palm.
- **MCP** - metacarpophalangeal joint, the knuckle. All five digits have an MCP joint.
- **PIP** - proximal interphalangeal joint, the middle joint of the four fingers.
- **DIP** - distal interphalangeal joint, the last joint before the fingertip on the four fingers.
- **IP** - interphalangeal joint, the single joint near the thumb tip. It is the thumb's equivalent of the finger DIP.

<!-- TODO: image - annotated hand diagram showing CMC, MCP, PIP, DIP, and IP joint locations -->
![Joint terminology](../assets/images/pose-hands-joint-terminology.avif){width=80%}

## Wrist controls

The wrist controls shape the hand's orientation relative to the forearm. `Pronation` lives in the arm section but works together with these controls to define the full hand attitude.

`Flexion` bends the hand toward or away from the forearm - positive values flex, negative values extend.

`Deviation` shifts the hand side to side - positive values produce ulnar deviation (toward the pinky), negative values produce radial deviation (toward the thumb).

!!! note "Wrist controls and Hand Pin"
    When [Hand Pin](shoulders-arms.md#hand-pin) is active, wrist controls remain available but the pinned solve tries to preserve the captured hand orientation. They can appear weakly reactive after capture. For predictable results, set the wrist attitude before capturing, or recapture after major wrist changes.

## Finger controls

The finger controls are built in layers. `Relax` sets the baseline posture, the global controls (`Finger Curl`, `Finger Abd`, `MCP Ext`) shape the hand, and per-finger channels add local refinement where needed.

### Relax

`Relax` sets the resting posture of the four fingers - both the baseline finger curl and a small amount of natural rest splay. At `0` the fingers are flat and straight. At `1` they settle into a natural relaxed curve. Values above `1` exaggerate that resting curl.

`Relax` does not affect the thumb.

### Curl Shape

`Curl Shape` changes how finger curl is distributed across the MCP, PIP, and DIP joints. At `0` the distribution is even and all joints curl at the same rate. Positive values make the curl tip-heavy so the distal joints close faster. Negative values make it base-heavy so the knuckles lead more of the motion.

Internally, Curl Shape works by scaling the curl input differently per joint before it reaches the ROM mapping. At `0` all weights are identical. At the extremes, one end reaches its ROM limit earlier in the slider range, which can produce hook-like or knuckle-led grips.

`Curl Shape` does not affect the thumb.

### DIP Lock

`DIP Lock` keeps the fingertip (DIP) joints flatter while the rest of the finger continues to curl - positive values blend the DIP angle toward zero. At `1` the DIP stays fully flat regardless of curl, while MCP and PIP curl freely. Partial values give a proportional result.

This is useful for poses where you need PIP bend without fully curling the fingertips. A typical claw or tabletop shape: set `MCP Ext` positive to lift the knuckles, `Finger Curl` to moderate positive for PIP flexion, and `DIP Lock` to `1` so the fingertips stay flat against the surface.

`DIP Lock` does not affect the thumb. Thumb tip locking is handled separately by `Thumb IP Lock`.

### Main controls

The global controls expose the broad shaping for all four fingers.

`Finger Curl` is the main grip control.

- `-1` extends the fingers.
- `0` keeps the fingers at their resting pose (set by `Relax`).
- `1` fully curls them into flexion.

`Finger Abd` spreads or closes the fingers at the knuckles - positive values splay, negative values close.

`MCP Ext` adjusts the knuckles independently of the rest of the finger curl - positive values extend the knuckles back, negative values add flexion. Only the MCP joint is affected, so you can lift or flatten the knuckles without changing how curled the fingers are.

<!-- TODO: screenshot - main finger controls showing Relax, Curl Shape, DIP Lock, and the main finger row -->
<!-- ![Main finger controls](assets/images/pose-hands-finger-controls.avif) -->

### Per-Finger Control

`Per-Finger Control` opens a compact table with `Curl`, `Abd`, and `MCP` channels for each finger (index, middle, ring, pinky). Use this when the global controls are close but the hand needs asymmetry or a more specific gesture.

Most per-finger channels are additive on top of the main controls. The exception is the middle finger's `Abd` channel, which acts as its own reference rather than adding to the global splay - this matches the anatomy where the middle finger is the reference axis for finger abduction.

Per-finger curl channels include a small built-in extra headroom (about 15%), so you can push one finger slightly further even when global `Finger Curl` is already near its limit. The extra range is intentionally modest to keep posing predictable.

The foldout header includes its own reset button, so you can clear only the per-finger overrides without resetting the whole hand.

<!-- TODO: screenshot - the Per-Finger Control foldout expanded -->
<!-- ![Per-Finger Control](assets/images/pose-hands-per-finger.avif) -->

## Thumb controls

The thumb uses its own control set and is not affected by `Relax`, `Curl Shape`, or `DIP Lock`.

`Thumb Curl` folds the thumb through its MCP and IP joints. At stronger negative values (below `-0.5`), it also produces a hitchhiker-like IP extension.

`Thumb IP Lock` keeps the thumb tip straighter by suppressing thumb-curl influence at the IP joint while preserving the opposition-driven IP contribution. This lets you lock the tip posture while still adjusting the overall thumb curl.

`T Opp` moves the thumb across the palm. It also drives automatic thumb pronation and slight flexion so the opposing motion reads more naturally.

`T Abd` moves the thumb away from or toward the palm.

`T Roll` rotates the thumb around its own axis to refine pad orientation.

`T Opp`, `T Abd`, and `T Roll` define the thumb's base placement, while `Thumb Curl` and `Thumb IP Lock` refine the final shape.

## How the controls interact

The hand controls are designed to combine without fighting each other:

- `Relax` establishes the fingers' starting posture by setting both baseline curl and a small amount of rest splay.
- `Finger Abd` and the per-finger `Abd` channels spread or close the fingers at the knuckles.
- `MCP Ext` and the per-finger `MCP` channels adjust the knuckles independently of the main curl.
- `Finger Curl` is the main global grip control, while per-finger `Curl` channels add local offsets.
- `Curl Shape` changes how that curl is distributed across the MCP, PIP, and DIP joints rather than acting as a separate pose layer.
- As the fingers flex, FBG adds natural PIP-DIP coupling, and `DIP Lock` can then hold the fingertip joints flatter when needed.
- The thumb is solved separately: `T Opp`, `T Abd`, and `T Roll` define the base orientation, `Thumb Curl` folds the thumb, and `Thumb IP Lock` keeps the tip straighter when needed.


## Animation notes

All hand properties are keyframeable. A few things worth knowing:

- `Finger Curl` produces linear angular velocity at the default `Curl Shape` of `0`, so F-curve easing works as expected. At other Curl Shape values, different joints reach their ROM limits at different points in the slider range - the effective angular velocity is not perfectly uniform across joints.
