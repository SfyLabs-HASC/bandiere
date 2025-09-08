package ai.homedesign.app

import android.graphics.Bitmap

object Upscaler {
    // Placeholder: upscale via simple resize until native hook is provided
    fun upscale(src: Bitmap, scale: Int): Bitmap {
        if (scale <= 1) return src
        return Bitmap.createScaledBitmap(src, src.width * scale, src.height * scale, true)
    }
}

