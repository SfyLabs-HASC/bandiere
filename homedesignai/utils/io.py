from __future__ import annotations
from pathlib import Path
from typing import Optional
import numpy as np
from PIL import Image
import numpy as np


def load_image_rgb(path: Optional[Path]) -> Image.Image:
    if path and path.exists():
        return Image.open(path).convert("RGB")
    return Image.new("RGB", (768, 512), (240, 240, 240))


def pil_to_numpy_rgb(img: Image.Image) -> np.ndarray:
    # ensure a writable copy
    return np.array(img).copy()


def numpy_to_pil_rgb(arr: np.ndarray) -> Image.Image:
    return Image.fromarray(arr.astype("uint8"), mode="RGB")
