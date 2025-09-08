#include <jni.h>

extern "C" JNIEXPORT jstring JNICALL
Java_ai_homedesign_app_NativeBridge_sdVersion(JNIEnv* env, jobject /*thiz*/) {
    return env->NewStringUTF("sd-stub-0.1");
}

extern "C" JNIEXPORT jstring JNICALL
Java_ai_homedesign_app_NativeBridge_upscalerVersion(JNIEnv* env, jobject /*thiz*/) {
    return env->NewStringUTF("realesrgan-stub-0.1");
}

extern "C" JNIEXPORT jboolean JNICALL
Java_ai_homedesign_app_NativeBridge_upscalerInit(JNIEnv* env, jobject /*thiz*/, jstring modelDir, jstring modelName) {
    // TODO: load ncnn models from modelDir/modelName
    return JNI_TRUE;
}

extern "C" JNIEXPORT jintArray JNICALL
Java_ai_homedesign_app_NativeBridge_upscalerRun(JNIEnv* env, jobject /*thiz*/, jintArray pixelsIn, jint width, jint height, jint scale) {
    // TODO: run ncnn upscaler; for now return input as-is
    const int len = env->GetArrayLength(pixelsIn);
    jint* in = env->GetIntArrayElements(pixelsIn, nullptr);
    jintArray out = env->NewIntArray(len);
    env->SetIntArrayRegion(out, 0, len, in);
    env->ReleaseIntArrayElements(pixelsIn, in, 0);
    return out;
}

