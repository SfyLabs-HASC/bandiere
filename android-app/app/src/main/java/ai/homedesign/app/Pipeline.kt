package ai.homedesign.app

import android.graphics.*

object Pipeline {
    data class LogoBox(val left: Int, val top: Int, val right: Int, val bottom: Int)

    fun blurBoxesInPlace(input: Bitmap, boxes: List<LogoBox>) {
        val canvas = Canvas(input)
        for (b in boxes) {
            val rect = Rect(b.left, b.top, b.right, b.bottom)
            val sub = Bitmap.createBitmap(input, rect.left, rect.top, rect.width(), rect.height())
            val blurred = fastBlur(sub, 8)
            canvas.drawBitmap(blurred, rect.left.toFloat(), rect.top.toFloat(), null)
            sub.recycle()
            blurred.recycle()
        }
    }

    private fun fastBlur(src: Bitmap, factor: Int): Bitmap {
        val w = (src.width / factor).coerceAtLeast(1)
        val h = (src.height / factor).coerceAtLeast(1)
        val small = Bitmap.createScaledBitmap(src, w, h, true)
        return Bitmap.createScaledBitmap(small, src.width, src.height, true)
    }
}

