package ai.homedesign.app

object NativeBridge {
    init { try { System.loadLibrary("homedesignai") } catch (_: Throwable) {} }

    external fun sdVersion(): String
    external fun upscalerVersion(): String

    // Upscaler JNI placeholders
    external fun upscalerInit(modelDir: String, modelName: String): Boolean
    external fun upscalerRun(pixelsIn: IntArray, width: Int, height: Int, scale: Int): IntArray?
}

