package ai.homedesign.app

import android.graphics.Bitmap

object Upscaler {
    // Placeholder: upscale via simple resize until native hook is provided
    fun upscale(src: Bitmap, scale: Int, modelDir: String? = null, modelName: String? = null): Bitmap {
        if (scale <= 1) return src
        // Try native first
        try {
            if (!modelDir.isNullOrEmpty() && !modelName.isNullOrEmpty()) {
                NativeBridge.upscalerInit(modelDir, modelName)
                val argb = IntArray(src.width * src.height)
                src.getPixels(argb, 0, src.width, 0, 0, src.width, src.height)
                val out = NativeBridge.upscalerRun(argb, src.width, src.height, scale)
                if (out != null) {
                    val dst = Bitmap.createBitmap(src.width * scale, src.height * scale, Bitmap.Config.ARGB_8888)
                    // NOTE: stub returns same size; in real impl, out should be scaled
                    // For now, fallback to resize below if size mismatch
                    if (out.size == argb.size) {
                        dst.setPixels(out, 0, src.width, 0, 0, src.width, src.height)
                        return Bitmap.createScaledBitmap(dst, dst.width, dst.height, true)
                    }
                }
            }
        } catch (_: Throwable) {}

        return Bitmap.createScaledBitmap(src, src.width * scale, src.height * scale, true)
    }
}

