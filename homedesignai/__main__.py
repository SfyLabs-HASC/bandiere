import argparse
from pathlib import Path
from .cli import run_pipeline


def main():
    parser = argparse.ArgumentParser(prog="homedesignai", description="Offline home design AI.")
    parser.add_argument("--input", type=Path, required=False, help="Input room image")
    parser.add_argument("--style", type=str, default="scandinavian")
    parser.add_argument("--output", type=Path, default=Path("./outputs/out.png"))
    parser.add_argument("--sd-model-path", dest="sd_model_path", type=Path, default=Path("/models/sd15"))
    parser.add_argument("--upscale", type=int, default=0)
    parser.add_argument("--dry-run", action="store_true", help="Run without models; passthrough.")
    args = parser.parse_args()
    run_pipeline(args.input, args.style, args.output, args.sd_model_path, args.upscale, args.dry_run)


if __name__ == "__main__":
    main()
