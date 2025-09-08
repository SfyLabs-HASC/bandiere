package ai.homedesign.app

import android.net.Uri
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ai.homedesign.app.settings.AppSettings
import ai.homedesign.app.settings.SettingsStore
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(store: SettingsStore) {
    val scope = rememberCoroutineScope()
    val state by store.flow.collectAsState(initial = AppSettings())

    var modelDir by remember { mutableStateOf(state.modelDir) }
    var upscalerBin by remember { mutableStateOf(state.upscalerBin) }
    var stepsText by remember { mutableStateOf(state.steps.toString()) }
    var seedText by remember { mutableStateOf(state.seed.toString()) }

    val dirPicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocumentTree()
    ) { uri: Uri? ->
        if (uri != null) {
            modelDir = uri.toString()
        }
    }

    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Impostazioni", style = MaterialTheme.typography.titleLarge)

        OutlinedTextField(value = modelDir, onValueChange = { modelDir = it }, label = { Text("Cartella modelli (URI)") }, modifier = Modifier.fillMaxWidth())
        Button(onClick = { dirPicker.launch(null) }) { Text("Scegli cartella modelli") }

        OutlinedTextField(value = upscalerBin, onValueChange = { upscalerBin = it }, label = { Text("Percorso upscaler bin (facoltativo)") }, modifier = Modifier.fillMaxWidth())

        OutlinedTextField(value = stepsText, onValueChange = { stepsText = it.filter { c -> c.isDigit() } }, label = { Text("Steps SD") })
        OutlinedTextField(value = seedText, onValueChange = { seedText = it.filter { c -> c.isDigit() } }, label = { Text("Seed") })

        Button(onClick = {
            scope.launch {
                store.update { cur ->
                    cur.copy(
                        modelDir = modelDir,
                        upscalerBin = upscalerBin,
                        steps = stepsText.toIntOrNull() ?: cur.steps,
                        seed = seedText.toIntOrNull() ?: cur.seed,
                    )
                }
            }
        }) { Text("Salva") }
    }
}

