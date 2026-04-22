# Feet

Feet controls are organized by where the motion happens:

- **Support:** ground contact through `Foot Roll` and `Foot Bank`
- **Ankle:** foot orientation through `Dorsiflexion`, `Yaw`, and `Inversion`
- **Toes:** forefoot shaping through grouped toe controls, hallux controls, and per-toe refinement

![Feet section overview](../assets/images/pose-feet-overview.avif){ .zoom .img-center width=60% }

## Support controls

Support controls describe how the foot meets the ground. In leg IK, they reposition the ankle to keep the active contact point planted. In leg FK, the foot rotates from the ankle and figure lift approximates the same ground contact.

### Foot Roll

`Foot Roll` shifts planted support along the length of the foot: heel, flat foot, or ball of the foot.

- Negative values roll the foot backward over the heel (up to 20 deg).
- `0` is flat-foot.
- Positive values lift the heel and roll forward over the ball (up to 60 deg).

`Foot Roll` is different from `Dorsiflexion`: roll changes the support pivot, while dorsiflexion pitches the ankle after support is solved.

![Foot Roll](../assets/images/pose-feet-foot-roll.avif){ .zoom }

### Foot Bank

`Foot Bank` shifts planted support side to side onto the medial or lateral edge of the foot (up to 30 deg each way).

`Foot Bank` is different from `Inversion`: bank changes the support edge, while inversion tilts the ankle after support is solved.

![Foot Bank](../assets/images/pose-feet-foot-bank.avif){ .zoom }

### Figure lift

When `Foot Roll` or `Foot Bank` raises the ankle above its rest height, the entire figure can lift to match -- keeping the foot grounded without requiring a manual `Pelvis Z` adjustment for every heel-lift or bank pose.

`Auto Stance Height` controls whether this lift applies.

- **On** (default): the figure lifts to match whenever `Foot Roll` or `Foot Bank` raises the ankle above its rest height.
- **Off**: `Foot Roll` and `Foot Bank` stay local to the feet and legs.

!!! note "Media note"
    Some captures on this page were recorded before `Auto Stance Height` was added, so that toggle may not appear in the UI shown here. The foot controls themselves and the support behavior are still current.

When `Auto Stance Height` is on, the lift is based on the lower of the two feet. If both feet demand the same height (typical with mirror on), the figure lifts by that full amount. If the feet differ (mirror off, asymmetric pose), the figure only lifts by the lesser amount -- the higher foot is handled by the leg solver in IK, or approximated in FK.

In practice this means:

- **Mirror on:** any support change lifts the figure immediately, because both feet move together.
- **Mirror off, one foot adjusted:** the figure does not lift, because the other foot is still flat. Only the adjusted foot and its leg respond.
- **Mirror off, both feet adjusted:** the figure lifts by whichever foot demands less height. The leg with more support travel handles the remainder on its own.

![Figure lift](../assets/images/pose-feet-figure-lift.avif){ .zoom }

## Ankle orientation

The ankle controls rotate the foot after the support state has been applied.

`Dorsiflexion` pitches the foot up or down.

`Inversion` tilts the sole inward or outward at the ankle.

`Yaw` turns the foot inward or outward. The figure includes a base yaw from proportions, so the feet point slightly outward even at zero:

| Preset | Base yaw |
|--------|----------|
| Female | 12 deg |
| Male | 8 deg |

`Foot Roll` and `Foot Bank` follow the current yaw direction.


![Ankle orientation](../assets/images/pose-feet-ankle-orientation.avif){ .zoom }

## Toe controls

Toes 2-5 share the main toe controls. The big toe uses its own `Hallux` controls, so it can be posed independently.

!!! info "Toe overdrive"
    Toe sliders use `-1` to `1` as their draggable range. To use overdrive values, enable [Limits Bypass](index.md#limits-bypass-and-reset-pose), then type a value beyond `-1` or `1` into the field.

### MTP Flexion

`MTP Flexion` bends toes 2-5 at their base joints. This is the ball-of-foot break.

`Hallux MTP` controls the base-joint motion of the big toe.

### Toe Curl

`Toe Curl` folds toes 2-5 from their resting pose.

- `-1` extends the toes.
- `0` keeps the toes near their resting pose.
- `1` fully flexes them.

`Hallux Curl` folds or extends the big toe.

### Toe Abduction

`Toe Abduction` spreads or closes toes 3-5 around toe 2, which acts as the reference toe.

`Hallux Abduction` moves the big toe toward or away from toe 2.

![Toe Control](../assets/images/pose-feet-toe-control.avif){ .zoom }

### Per-Toe Control

`Per-Toe Control` opens individual `Curl` and `Abd` channels for toes 2-5. There is no per-toe MTP channel.

The `Curl` channels refine the group `Toe Curl` result. The `Abd` channels refine toe spread, except for toe 2: because toe 2 is the reference toe, its `Abd` channel moves independently instead of adding to the group spread.

The foldout header includes its own reset button, so you can clear only the per-toe overrides without resetting the whole foot.

---

![Feet anim](../assets/images/pose-feet-anim.avif){ .zoom }
