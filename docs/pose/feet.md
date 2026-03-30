# Feet

This section covers two kinds of foot control: support controls that rock the foot against the ground, and anatomical controls that rotate the ankle or toes directly.

<!-- TODO: screenshot - the Feet section expanded in the Pose panel -->
<!-- ![Feet section](../assets/images/pose-feet-overview.avif) -->

## At a glance

**Support controls** - define how the foot rocks against the ground:

- `Foot Roll` is the main planted-foot rocker.
- `Foot Bank` rolls the foot onto its lateral or medial edge.

**Ankle orientation** - shape the foot directly:

- `Dorsiflexion` rotates the foot at the ankle.
- `Yaw` changes the foot heading.
- `Inversion` tilts the sole inward or outward.

**Toe articulation** - shape the forefoot and toes:

- `MTP Flexion` controls the ball-of-foot break.
- `Toe Curl` folds the toe chains.
- `Toe Abduction` spreads or closes the toes.
- `Hallux MTP`, `Hallux Curl`, and `Hallux Abduction` refine the big toe separately.
- `Per-Toe Control` adds local `Curl` and `Abd` channels for toes 2-5.

## Support controls

### Foot Roll

`Foot Roll` is a bidirectional support rocker.

- Negative values roll the foot backward over the heel (up to 20 deg).
- `0` is flat-foot support.
- Positive values lift the heel and roll forward over the ball (up to 60 deg).

In IK leg mode, `Foot Roll` is a true planted-foot mechanic - the ankle shifts to keep the contact point on the ground. Heel roll pivots around the heel, ball roll pivots around the ball of the foot.

In FK leg mode, the same rotational motion applies but the ankle position is fixed by the FK chain. The foot rotates the same way, but ground contact is not maintained automatically.

<!-- TODO: image - three-state comparison showing heel roll, flat foot, and push-off over the ball -->
<!-- ![Foot Roll comparison](../assets/images/pose-feet-foot-roll.avif) -->

### Foot Bank

`Foot Bank` rolls the foot side to side over its support edge - positive values roll toward the outer edge, negative values toward the inner edge.

Like `Foot Roll`, bank is a ground-contact mechanic in IK and a direct rotation in FK.

## Ankle orientation

The ankle controls shape the foot directly, on top of the support state.

`Dorsiflexion` rotates the foot at the ankle joint - positive values lift the toes, negative values point the foot downward.

`Yaw` turns the foot outward or inward - positive values turn the toes out, negative values turn them in. The figure already has a built-in default yaw from its proportions, so the feet point slightly outward even when the slider is at zero:

- female presets - `12 deg`
- male presets - `8 deg`

!!! note "Yaw and support heading"
    `Yaw` changes the heading that `Foot Roll` and `Foot Bank` operate in. The support controls still do the same motion, but they follow the foot's current yawed direction.

`Inversion` tilts the sole inward or outward at the ankle - positive values invert (sole faces inward), negative values evert (sole faces outward).

<!-- TODO: image - comparison showing Foot Bank versus Inversion, and how Yaw changes the support heading -->
<!-- ![Foot Bank and Inversion comparison](../assets/images/pose-feet-bank-vs-inversion.avif) -->

## Toe controls

### MTP Flexion

`MTP Flexion` controls the ball-of-foot break - negative values extend the toes upward at the base, positive values flex them downward.

`Hallux MTP` adds a big-toe-specific offset on top of the global `MTP Flexion`.

### Toe Curl

`Toe Curl` is the main toe shape control. It bends the toes themselves, past the MTP break.

- `-1` extends the toes.
- `0` keeps the toes near their resting pose.
- `1` fully flexes them.

`Hallux Curl` adds a big-toe-specific curl offset on top of the global value.

### Toe Abduction

`Toe Abduction` controls the overall toe spread - positive values splay, negative values close.

`Hallux Abduction` adds a big-toe-specific offset on top of the global spread.

The toe splay system uses the second toe as the reference axis. That matters most when using the per-toe controls.

### Per-Toe Control

`Per-Toe Control` opens a compact table with `Curl` and `Abd` channels for toes 2-5. The hallux is not part of this table because it already has its own dedicated controls in the main section. There is no per-toe MTP channel.

Most per-toe channels are additive on top of the global controls. The exception is toe 2's `Abd` channel, which acts as its own reference rather than adding to the global spread - matching the reference axis role described above.

The foldout header includes its own reset button, so you can clear only the per-toe overrides without resetting the whole foot.

<!-- TODO: screenshot - the Per-Toe Control foldout expanded -->
<!-- ![Per-Toe Control](../assets/images/pose-feet-per-toe.avif) -->

## How the controls interact

- `Foot Roll` and `Foot Bank` define the foot's ground support state.
- `Yaw` sets the heading that those support mechanics operate in.
- `Dorsiflexion` and `Inversion` shape the ankle on top of that support state.
- `MTP Flexion` sets the toe-base break.
- `Toe Curl` folds the toe chains.
- `Hallux` and `Per-Toe Control` channels refine the result locally.
