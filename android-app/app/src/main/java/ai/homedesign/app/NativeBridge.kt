package ai.homedesign.app

object NativeBridge {
    init { try { System.loadLibrary("homedesignai") } catch (_: Throwable) {} }

    external fun sdVersion(): String
    external fun upscalerVersion(): String
}

