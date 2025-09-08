from pathlib import Path
from typing import Optional
from PIL import Image
from .prompt.builder import build_prompt
from .utils.io import load_image_rgb, pil_to_numpy_rgb, numpy_to_pil_rgb
from .preprocess.depth import estimate_depth_stub
from .preprocess.segmentation import segment_semantic_stub
from .preprocess.logos import detect_logo_boxes_stub
from .utils.masks import blur_boxes_inplace
from .safety.nsfw import is_image_safe_stub
from .safety.brand import review_brand_risk_stub
from .generation.sd import generate_img2img
from .postprocess.upscale import upscale_image


def run_pipeline(input_path: Optional[Path], style: str, output_path: Path, sd_model_path: Path, upscale: int, dry_run: bool) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_text = build_prompt(style=style, image_path=input_path)
    print(f"Prompt: {prompt_text}")
    image = load_image_rgb(input_path)
    image_np = pil_to_numpy_rgb(image)

    depth = estimate_depth_stub(image_np)
    seg = segment_semantic_stub(image_np)
    logo_boxes = detect_logo_boxes_stub(image_np)

    blur_boxes_inplace(image_np, logo_boxes)

    negative = "nsfw, watermark, logo, text overlay, low quality, blurry, distorted"
    result_np = generate_img2img(
        image_rgb=image_np,
        prompt=prompt_text,
        negative_prompt=negative,
        model_dir=str(sd_model_path),
        num_inference_steps=20,
        strength=0.6,
        guidance_scale=7.5,
        seed=None,
    ) if not dry_run else image_np

    if not is_image_safe_stub():
        raise SystemExit("Image flagged as unsafe by stub checker")

    _ = review_brand_risk_stub(logo_boxes)

    # upscaling (prefer external realesrgan if provided via args; stub not wired here)
    result_np = upscale_image(result_np, scale=upscale, realesrgan_ncnn_bin=None)
    result = numpy_to_pil_rgb(result_np)
    result.save(output_path)
    print(f"Saved: {output_path}")
