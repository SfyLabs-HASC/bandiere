from __future__ import annotations
from typing import Optional
import subprocess
import shlex
import numpy as np
from PIL import Image


def upscale_image(
    image_rgb: "np.ndarray",
    scale: int = 2,
    realesrgan_ncnn_bin: Optional[str] = None,
) -> "np.ndarray":
    if scale is None or scale <= 1:
        return image_rgb

    # Try external realesrgan-ncnn-vulkan if provided
    if realesrgan_ncnn_bin:
        try:
            from tempfile import NamedTemporaryFile
            import os
            with NamedTemporaryFile(suffix=".png", delete=False) as tin:
                Image.fromarray(image_rgb.astype("uint8"), mode="RGB").save(tin.name)
                in_path = tin.name
            with NamedTemporaryFile(suffix=".png", delete=False) as tout:
                out_path = tout.name
            cmd = f"{shlex.quote(realesrgan_ncnn_bin)} -i {shlex.quote(in_path)} -o {shlex.quote(out_path)} -s {int(scale)}"
            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out = Image.open(out_path).convert("RGB")
            arr = np.array(out)
            try:
                os.remove(in_path)
                os.remove(out_path)
            except Exception:
                pass
            return arr
        except Exception as e:
            print(f"[UPSCALER] realesrgan-ncnn failed: {e}; falling back to PIL resize")

    # Fallback: PIL Lanczos
    pil = Image.fromarray(image_rgb.astype("uint8"), mode="RGB")
    up = pil.resize((pil.width * scale, pil.height * scale), resample=Image.LANCZOS)
    return np.array(up)

