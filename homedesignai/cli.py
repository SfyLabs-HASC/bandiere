from pathlib import Path
from typing import Optional
from PIL import Image
from .prompt.builder import build_prompt


def run_pipeline(input_path: Optional[Path], style: str, output_path: Path, sd_model_path: Path, upscale: int, dry_run: bool) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt_text = build_prompt(style=style, image_path=input_path)
    print(f"Prompt: {prompt_text}")
    if input_path and input_path.exists():
        image = Image.open(input_path).convert("RGB")
    else:
        image = Image.new("RGB", (768, 512), (240, 240, 240))
    result = image
    if upscale and upscale > 1:
        result = result.resize((result.width * upscale, result.height * upscale), resample=Image.LANCZOS)
    result.save(output_path)
    print(f"Saved: {output_path}")
