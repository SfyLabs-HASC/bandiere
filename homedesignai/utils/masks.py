from __future__ import annotations
from typing import List, Tuple
import numpy as np


def blur_boxes_inplace(image_rgb: np.ndarray, boxes: List[Tuple[int, int, int, int]]) -> None:
    for (x0, y0, x1, y1) in boxes:
        x0, y0 = max(0, x0), max(0, y0)
        patch = image_rgb[y0:y1, x0:x1]
        if patch.size == 0:
            continue
        # simple box blur: average pooling
        k = 9
        hh = max(1, k // 2)
        for _ in range(2):
            padded = np.pad(patch, ((hh, hh), (hh, hh), (0, 0)), mode="edge")
            out = patch.copy()
            for i in range(patch.shape[0]):
                for j in range(patch.shape[1]):
                    region = padded[i:i + k, j:j + k]
                    out[i, j] = region.mean(axis=(0, 1))
            patch[:, :, :] = out
