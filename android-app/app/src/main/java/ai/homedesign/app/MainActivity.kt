package ai.homedesign.app

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.homedesign.app.settings.SettingsStore
import androidx.compose.material3.Icon
import androidx.compose.material3.icons.Icons
import androidx.compose.material3.icons.filled.Settings
import androidx.compose.ui.platform.LocalContext

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { App() }
    }
}

@Composable
fun App() {
    MaterialTheme {
        var showSettings by remember { mutableStateOf(false) }
        val ctx = LocalContext.current
        val store = remember { SettingsStore(ctx) }
        Surface(Modifier.fillMaxSize()) {
            if (showSettings) SettingsScreen(store) else HomeScreen(store)
        }
        FloatingActionButton(onClick = { showSettings = !showSettings }, modifier = Modifier.padding(16.dp)) {
            Icon(Icons.Default.Settings, contentDescription = null)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(store: SettingsStore) {
    var selectedBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var resultBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var style by remember { mutableStateOf("scandinavian") }

    val photoPicker = rememberLauncherForActivityResult(
        contract = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU)
            ActivityResultContracts.PickVisualMedia() else ActivityResultContracts.GetContent()
    ) { uri: Any? ->
        when (uri) {
            is Uri -> selectedBitmap = loadBitmap(uri)
            is android.net.Uri? -> selectedBitmap = uri?.let { loadBitmap(it) }
            is String? -> selectedBitmap = null
        }
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("HomeDesignAI (Android)", fontSize = 20.sp)

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
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

        selectedBitmap?.let { bmp -> Image(bmp.asImageBitmap(), null, Modifier.height(220.dp)) }

        Button(onClick = {
            val input = selectedBitmap ?: Bitmap.createBitmap(768, 512, Bitmap.Config.ARGB_8888)
            val working = input.copy(Bitmap.Config.ARGB_8888, true)

            val logos = listOf(Pipeline.LogoBox((working.width*0.7).toInt(), 16, working.width-16, (working.height*0.3).toInt()))
            Pipeline.blurBoxesInPlace(working, logos)
            resultBitmap = working
        }) { Text("Genera") }

        resultBitmap?.let { out ->
            Text("Risultato:")
            Image(out.asImageBitmap(), null, Modifier.height(220.dp))
        }
    }
}

@Composable
private fun loadBitmap(uri: Uri): Bitmap? = try {
    val cr = LocalContext.current.contentResolver
    cr.openInputStream(uri)?.use { BitmapFactory.decodeStream(it) }
} catch (e: Exception) { null }

