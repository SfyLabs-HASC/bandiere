package ai.homedesign.app

object NativeBridge {
    init { try { System.loadLibrary("homedesignai") } catch (_: Throwable) {} }

    external fun sdVersion(): String
    external fun upscalerVersion(): String

    // Upscaler JNI placeholders
    external fun upscalerInit(modelDir: String, modelName: String): Boolean
    external fun upscalerRun(pixelsIn: IntArray, width: Int, height: Int, scale: Int): IntArray?

    // Stable Diffusion JNI placeholders
    external fun sdInit(modelDir: String, maxWidth: Int, maxHeight: Int, useVulkan: Boolean): Boolean
    external fun sdEncodePrompt(prompt: String, negative: String): Long
    external fun sdTxt2Img(promptHandle: Long, width: Int, height: Int, steps: Int, guidance: Float, seed: Int): IntArray?
    external fun sdImg2Img(pixelsIn: IntArray, width: Int, height: Int, promptHandle: Long, strength: Float, steps: Int, guidance: Float, seed: Int): IntArray?
    external fun sdFreeEmbedding(handle: Long)
}

