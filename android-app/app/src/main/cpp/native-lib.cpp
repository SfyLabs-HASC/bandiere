#include <jni.h>

extern "C" JNIEXPORT jstring JNICALL
Java_ai_homedesign_app_NativeBridge_sdVersion(JNIEnv* env, jobject /*thiz*/) {
    return env->NewStringUTF("sd-stub-0.1");
}

extern "C" JNIEXPORT jstring JNICALL
Java_ai_homedesign_app_NativeBridge_upscalerVersion(JNIEnv* env, jobject /*thiz*/) {
    return env->NewStringUTF("realesrgan-stub-0.1");
}

