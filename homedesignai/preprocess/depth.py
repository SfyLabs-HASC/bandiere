from __future__ import annotations
from pathlib import Path
from typing import Optional
import numpy as np


def estimate_depth_stub(image_rgb: "np.ndarray") -> "np.ndarray":
    h, w, _ = image_rgb.shape
    # simple vertical gradient as a placeholder [0..1]
    y = np.linspace(0.0, 1.0, h, dtype=np.float32)[:, None]
    depth = np.repeat(y, w, axis=1)
    return depth
