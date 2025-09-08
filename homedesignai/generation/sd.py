from __future__ import annotations
from typing import Optional
import numpy as np


def generate_img2img(
    image_rgb: "np.ndarray",
    prompt: str,
    negative_prompt: Optional[str],
    model_dir: str,
    num_inference_steps: int = 20,
    strength: float = 0.6,
    guidance_scale: float = 7.5,
    seed: Optional[int] = None,
) -> "np.ndarray":
    try:
        import torch  # type: ignore
        from diffusers import StableDiffusionImg2ImgPipeline  # type: ignore
    except Exception as e:
        print(f"[SD] Diffusers/Torch not available ({e}); returning passthrough image")
        return image_rgb

    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32

    try:
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
            model_dir,
            torch_dtype=dtype,
            local_files_only=True,
            safety_checker=None,
        )
    except Exception as e:
        print(f"[SD] Failed loading model from {model_dir}: {e}; passthrough")
        return image_rgb

    pipe = pipe.to(device)
    try:
        from PIL import Image
    except Exception:
        print("[SD] PIL not available; passthrough")
        return image_rgb

    init_image = Image.fromarray(image_rgb.astype("uint8"), mode="RGB")

    generator = None
    if seed is not None:
        generator = torch.Generator(device=device).manual_seed(int(seed))

    try:
        result = pipe(
            prompt=prompt,
            image=init_image,
            negative_prompt=negative_prompt or None,
            strength=float(strength),
            guidance_scale=float(guidance_scale),
            num_inference_steps=int(num_inference_steps),
            generator=generator,
        )
        out = result.images[0]
        return np.array(out)
    except Exception as e:
        print(f"[SD] Generation failed: {e}; returning passthrough image")
        return image_rgb

