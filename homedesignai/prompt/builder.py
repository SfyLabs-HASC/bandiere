from pathlib import Path
from .styles import STYLES


def build_prompt(style: str, image_path: Path | None) -> str:
    style_piece = STYLES.get(style.lower(), STYLES["scandinavian"])
    base = (
        "photorealistic interior render of a living room, "
        + style_piece
        + ", natural light from a window on the left, bright and welcoming"
    )
    negative = "nsfw, watermark, logo, text overlay, low quality, blurry, distorted"
    return f"{base} [NEGATIVE: {negative}]"
