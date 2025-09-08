pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "HomeDesignAI"
include(":app")
\nEOF\n
cat > /workspace/android-app/build.gradle.kts << nEOFn
plugins {
    id("com.android.application") version "8.4.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
\nEOF\n
cat > /workspace/android-app/gradle.properties << nEOFn
org.gradle.jvmargs=-Xmx4g -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
android.enableJetifier=true
\nEOF\n
cat > /workspace/android-app/app/build.gradle.kts << nEOFn
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "ai.homedesign.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "ai.homedesign.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "0.1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
        }
    }

    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }

    packaging {
        resources { excludes += "/META-INF/{AL2.0,LGPL2.1}" }
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.06.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.activity:activity-compose:1.9.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.3")

    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
\nEOF\n
cat > /workspace/android-app/app/src/main/AndroidManifest.xml << nEOFn
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:label="HomeDesignAI"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="true"
        android:supportsRtl="true">
        <activity
            android:name="ai.homedesign.app.MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
\nEOF\n
cat > /workspace/android-app/app/src/main/res/values/strings.xml << nEOFn
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">HomeDesignAI</string>
</resources>
\nEOF\n
cat > /workspace/android-app/app/src/main/res/values/themes.xml << nEOFn
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.HomeDesignAI" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>
    </style>
</resources>
\nEOF\n
cat > /workspace/android-app/app/src/main/java/ai/homedesign/app/Pipeline.kt << nEOFn
package ai.homedesign.app

import android.graphics.*
import android.os.Build

object Pipeline {
    data class LogoBox(val left: Int, val top: Int, val right: Int, val bottom: Int)

    fun estimateDepthStub(width: Int, height: Int): Bitmap {
        val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bmp)
        val paint = Paint()
        val shader = LinearGradient(0f, 0f, 0f, height.toFloat(), Color.BLACK, Color.WHITE, Shader.TileMode.CLAMP)
        paint.shader = shader
        canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)
        return bmp
    }

    fun segmentSemanticStub(width: Int, height: Int): Bitmap {
        val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ALPHA_8)
        val canvas = Canvas(bmp)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE }
        val x0 = (width * 0.2f)
        val y0 = (height * 0.2f)
        val x1 = (width * 0.8f)
        val y1 = (height * 0.8f)
        canvas.drawRect(x0, y0, x1, y1, paint)
        return bmp
    }

    fun detectLogosStub(width: Int, height: Int): List<LogoBox> {
        val bw = (width / 6).coerceAtLeast(40)
        val bh = (height / 6).coerceAtLeast(40)
        val left = (width - bw - 16).coerceAtLeast(0)
        val top = 16
        return listOf(LogoBox(left, top, left + bw, top + bh))
    }

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

    // Simple stack blur via downscale-upscale trick (not true blur but fast and dependency-free)
    private fun fastBlur(src: Bitmap, factor: Int): Bitmap {
        val w = (src.width / factor).coerceAtLeast(1)
        val h = (src.height / factor).coerceAtLeast(1)
        val small = Bitmap.createScaledBitmap(src, w, h, true)
        return Bitmap.createScaledBitmap(small, src.width, src.height, true)
    }
}
\nEOF\n
cat > /workspace/android-app/app/src/main/java/ai/homedesign/app/MainActivity.kt << nEOFn
package ai.homedesign.app

import android.Manifest
import android.app.Activity
import android.content.ContentResolver
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.result.PickVisualMediaRequest
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { App() }
    }
}

@Composable
fun App() {
    MaterialTheme {
        Surface(Modifier.fillMaxSize()) {
            HomeScreen()
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    val ctx = LocalContext.current
    var selectedBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var resultBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var style by remember { mutableStateOf("scandinavian") }

    val photoPicker = rememberLauncherForActivityResult(
        contract = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            ActivityResultContracts.PickVisualMedia() else ActivityResultContracts.GetContent()
    ) { uri: Any? ->
        when (uri) {
            is Uri -> selectedBitmap = loadBitmap(ctx.contentResolver, uri)
            is android.net.Uri? -> selectedBitmap = uri?.let { loadBitmap(ctx.contentResolver, it) }
            is String? -> selectedBitmap = null // fallback not used
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("HomeDesignAI (Android)", fontWeight = FontWeight.Bold, fontSize = 22.sp)

        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    photoPicker.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
                } else {
                    @Suppress("DEPRECATION")
                    photoPicker.launch("image/*")
                }
            }) { Text("Seleziona foto") }

            var expanded by remember { mutableStateOf(false) }
            ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = !expanded }) {
                TextField(
                    value = style,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Stile") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    modifier = Modifier.menuAnchor()
                )
                ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    listOf("scandinavian", "minimal", "industrial", "boho").forEach { s ->
                        DropdownMenuItem(text = { Text(s) }, onClick = { style = s; expanded = false })
                    }
                }
            }
        }

        selectedBitmap?.let { bmp ->
            Image(bmp.asImageBitmap(), contentDescription = null, modifier = Modifier.height(220.dp))
        }

        Button(onClick = {
            val input = selectedBitmap ?: Bitmap.createBitmap(768, 512, Bitmap.Config.ARGB_8888)
            val working = input.copy(Bitmap.Config.ARGB_8888, true)

            // stubs
            val depth = Pipeline.estimateDepthStub(working.width, working.height)
            val seg = Pipeline.segmentSemanticStub(working.width, working.height)
            val logos = Pipeline.detectLogosStub(working.width, working.height)
            Pipeline.blurBoxesInPlace(working, logos)

            // TODO: integrate SD img2img / Real-ESRGAN via JNI in future
            resultBitmap = working
            depth.recycle(); seg.recycle()
        }) { Text("Genera") }

        resultBitmap?.let { out ->
            Text("Risultato:")
            Image(out.asImageBitmap(), contentDescription = null, modifier = Modifier.height(220.dp))
        }
    }
}

private fun loadBitmap(cr: ContentResolver, uri: Uri): Bitmap? = try {
    cr.openInputStream(uri)?.use { BitmapFactory.decodeStream(it) }
} catch (e: Exception) { null }
\nEOF\n
cat > /workspace/android-app/README-ANDROID.md << nEOFn
# HomeDesignAI Android (scaffold)

Status: Compose UI + pipeline stub (depth/seg/logo blur). No Stable Diffusion yet.

## Build & Run
1. Install Android Studio (Giraffe+).
2. Open the folder .
3. Let Gradle sync. If Gradle Wrapper is missing JAR, run:  or use Android Studio to generate wrapper.
4. Select a device (Android 13+ recommended for Photo Picker).
5. Run the app.

## Using the App
- Tap "Seleziona foto" to pick a room image.
- Choose a style from the dropdown.
- Tap "Genera" to apply stubbed processing and preview the result.

## Next steps
- Add JNI layer for offline Stable Diffusion (ncnn/Torch Mobile) and Real-ESRGAN.
- Replace stubs with on-device models and add settings for model directory.
\nEOF\n
