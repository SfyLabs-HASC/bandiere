from __future__ import annotations
from typing import List, Tuple
import numpy as np

# returns list of bounding boxes (x0, y0, x1, y1) where potential logos/text might be

def detect_logo_boxes_stub(image_rgb: "np.ndarray") -> List[Tuple[int, int, int, int]]:
    h, w, _ = image_rgb.shape
    # put a small box in the top-right corner as a placeholder
    box_w = max(10, w // 10)
    box_h = max(10, h // 10)
    x1 = w - 10
    y0 = 10
    x0 = max(0, x1 - box_w)
    y1 = min(h, y0 + box_h)
    return [(x0, y0, x1, y1)]
