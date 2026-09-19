# Pixel Fight — full-screen Phaser template

The pixel-art nighttime house/street background is already INCLUDED at `assets/background/street.png`. The full-viewport game opens on a blurred street backdrop with a **CHOOSE YOUR AVATAR** selection card. Pick one of four fighters and enter the street scene opposite a target. Press **A** to punch, **W** to kick, **D** to slap. The attacker image and target hit-reaction image change together and return to idle. There are touch buttons and a Change avatar button, too.

## Run

Unzip; inside this folder run `python -m http.server 8000` (on Windows, `py -m http.server 8000`); open `http://localhost:8000`. A network connection is required to load Phaser from the CDN referenced in `index.html`. Don't open the HTML as a `file://` URL; use the local server.

## Replace artwork

```
assets/
  background/street.png                   # already included; replace if desired
  avatars/avatar-1/idle.png punch.png kick.png slap.png
  avatars/avatar-2/idle.png punch.png kick.png slap.png
  avatars/avatar-3/idle.png punch.png kick.png slap.png
  avatars/avatar-4/idle.png punch.png kick.png slap.png
  target/idle.png hit-punch.png hit-kick.png hit-slap.png
```

Placeholder fighters are simple generic artwork. Export your own sprite images as **transparent PNGs, ideally 320 × 320 pixels**, with feet aligned near the bottom. Each avatar's four files should share the same dimensions and placement, facing right. Make the target face left. If your generated sprite has a gray or white background, remove it before replacing the PNG so it doesn't cover the street. The game uses one still image per action, rather than a multi-frame animation. It does NOT use any of your original personal photos as game assets.

## Adjustments

- Change `HIT_MS` in `game.js` to adjust how long an attack is shown.
- Change `.35`, `.67`, `.84` and `.65` in `layoutFighters()` to alter positions, floor level and fighter size.
- Replace `assets/background/street.png` with any landscape image. The game automatically crops it to fill the entire browser viewport; no letterboxing or boxed canvas.
- Avatar labels are in `index.html`. Keep folder names unchanged unless you also edit the `AVATARS` list in `game.js`.
- On mobile, on-screen A / W / D controls appear. On desktop, physical A / W / D keys work.
