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

    result_np = image_np

    if not is_image_safe_stub():
        raise SystemExit("Image flagged as unsafe by stub checker")

    _ = review_brand_risk_stub(logo_boxes)

    result = numpy_to_pil_rgb(result_np)
    if upscale and upscale > 1:
        result = result.resize((result.width * upscale, result.height * upscale), resample=Image.LANCZOS)
    result.save(output_path)
    print(f"Saved: {output_path}")
