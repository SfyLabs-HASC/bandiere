package ai.homedesign.app

import android.net.Uri
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.compose.runtime.*
import androidx.compose.material3.*
import androidx.compose.foundation.layout.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val android.content.Context.dataStore by preferencesDataStore(name = "settings")

object SettingsKeys {
    val ModelDir = stringPreferencesKey("model_dir")
    val UpscalerBin = stringPreferencesKey("upscaler_bin")
}

@Composable
fun SettingsScreen() {
    val ctx = LocalContext.current
    val modelDirFlow: Flow<String> = ctx.dataStore.data.map { it[SettingsKeys.ModelDir] ?: "" }
    val upscalerFlow: Flow<String> = ctx.dataStore.data.map { it[SettingsKeys.UpscalerBin] ?: "" }
    val modelDir by modelDirFlow.collectAsState(initial = "")
    val upscaler by upscalerFlow.collectAsState(initial = "")

    val pickModelDir = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocumentTree()) { uri ->
        if (uri != null) savePref(ctx, SettingsKeys.ModelDir, uri.toString())
    }
    val pickUpscaler = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) savePref(ctx, SettingsKeys.UpscalerBin, uri.toString())
    }

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Impostazioni", style = MaterialTheme.typography.titleLarge)
        Text("Cartella modelli SD/ControlNet/VAEs")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(value = modelDir, onValueChange = {}, readOnly = true, modifier = Modifier.weight(1f))
            Button(onClick = { pickModelDir.launch(null) }) { Text("Scegli") }
        }
        Text("Binario upscaler (realesrgan-ncnn-vulkan)")
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(value = upscaler, onValueChange = {}, readOnly = true, modifier = Modifier.weight(1f))
            Button(onClick = { pickUpscaler.launch(arrayOf("application/octet-stream")) }) { Text("Scegli") }
        }
    }
}

private fun savePref(ctx: android.content.Context, key: Preferences.Key<String>, value: String) {
    androidx.lifecycle.lifecycleScope.launchWhenResumed {
        ctx.dataStore.edit { it[key] = value }
    }
}
