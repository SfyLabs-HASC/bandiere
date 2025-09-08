from __future__ import annotations
import numpy as np

# returns a simple mask: foreground rectangle in the center

def segment_semantic_stub(image_rgb: "np.ndarray") -> "np.ndarray":
    h, w, _ = image_rgb.shape
    mask = np.zeros((h, w), dtype=np.uint8)
    y0, y1 = int(h * 0.2), int(h * 0.8)
    x0, x1 = int(w * 0.2), int(w * 0.8)
    mask[y0:y1, x0:x1] = 1
    return mask
