#include <jni.h>
#include <string>
#include <map>

// Placeholders for SD components
struct Embedding { int id; /* placeholder */ };
static std::map<long, Embedding*> g_embeddings;
static long g_next_handle = 1;
static bool g_sd_inited = false;

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

extern "C" JNIEXPORT jboolean JNICALL
Java_ai_homedesign_app_NativeBridge_sdInit(JNIEnv* env, jobject /*thiz*/, jstring modelDir, jint maxWidth, jint maxHeight, jboolean useVulkan) {
    (void)modelDir; (void)maxWidth; (void)maxHeight; (void)useVulkan;
    g_sd_inited = true; // TODO: load clip/unet/vae via ncnn
    return JNI_TRUE;
}

extern "C" JNIEXPORT jlong JNICALL
Java_ai_homedesign_app_NativeBridge_sdEncodePrompt(JNIEnv* env, jobject /*thiz*/, jstring prompt, jstring negative) {
    (void)prompt; (void)negative;
    Embedding* e = new Embedding();
    e->id = (int)g_next_handle;
    long handle = g_next_handle++;
    g_embeddings[handle] = e;
    return handle;
}

extern "C" JNIEXPORT jintArray JNICALL
Java_ai_homedesign_app_NativeBridge_sdTxt2Img(JNIEnv* env, jobject /*thiz*/, jlong promptHandle, jint width, jint height, jint steps, jfloat guidance, jint seed) {
    (void)promptHandle; (void)steps; (void)guidance; (void)seed;
    const int n = width * height;
    jintArray out = env->NewIntArray(n);
    // gray placeholder
    std::vector<jint> buf(n, 0xFFCCCCCC);
    env->SetIntArrayRegion(out, 0, n, buf.data());
    return out;
}

extern "C" JNIEXPORT jintArray JNICALL
Java_ai_homedesign_app_NativeBridge_sdImg2Img(JNIEnv* env, jobject /*thiz*/, jintArray pixelsIn, jint width, jint height, jlong promptHandle, jfloat strength, jint steps, jfloat guidance, jint seed) {
    (void)promptHandle; (void)strength; (void)steps; (void)guidance; (void)seed;
    const int n = env->GetArrayLength(pixelsIn);
    jint* in = env->GetIntArrayElements(pixelsIn, nullptr);
    jintArray out = env->NewIntArray(n);
    env->SetIntArrayRegion(out, 0, n, in);
    env->ReleaseIntArrayElements(pixelsIn, in, 0);
    return out;
}

extern "C" JNIEXPORT void JNICALL
Java_ai_homedesign_app_NativeBridge_sdFreeEmbedding(JNIEnv* env, jobject /*thiz*/, jlong handle) {
    auto it = g_embeddings.find(handle);
    if (it != g_embeddings.end()) { delete it->second; g_embeddings.erase(it); }
}

