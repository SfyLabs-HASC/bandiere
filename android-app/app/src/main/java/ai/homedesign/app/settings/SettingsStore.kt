package ai.homedesign.app.settings

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore by preferencesDataStore("settings")

object Keys {
    val MODEL_DIR = stringPreferencesKey("model_dir")
    val UPSCALER_BIN = stringPreferencesKey("upscaler_bin")
    val STEPS = intPreferencesKey("steps")
    val SEED = intPreferencesKey("seed")
    val UPSCALE = intPreferencesKey("upscale")
}

data class AppSettings(
    val modelDir: String = "",
    val upscalerBin: String = "",
    val steps: Int = 20,
    val seed: Int = 0,
    val upscale: Int = 1,
)

class SettingsStore(private val context: Context) {
    val flow: Flow<AppSettings> = context.dataStore.data.map { p: Preferences ->
        AppSettings(
            modelDir = p[Keys.MODEL_DIR] ?: "",
            upscalerBin = p[Keys.UPSCALER_BIN] ?: "",
            steps = p[Keys.STEPS] ?: 20,
            seed = p[Keys.SEED] ?: 0,
            upscale = p[Keys.UPSCALE] ?: 1,
        )
    }

    suspend fun update(block: (AppSettings) -> AppSettings) {
        context.dataStore.edit { p ->
            val cur = AppSettings(
                modelDir = p[Keys.MODEL_DIR] ?: "",
                upscalerBin = p[Keys.UPSCALER_BIN] ?: "",
                steps = p[Keys.STEPS] ?: 20,
                seed = p[Keys.SEED] ?: 0,
                upscale = p[Keys.UPSCALE] ?: 1,
            )
            val n = block(cur)
            p[Keys.MODEL_DIR] = n.modelDir
            p[Keys.UPSCALER_BIN] = n.upscalerBin
            p[Keys.STEPS] = n.steps
            p[Keys.SEED] = n.seed
            p[Keys.UPSCALE] = n.upscale
        }
    }
}

