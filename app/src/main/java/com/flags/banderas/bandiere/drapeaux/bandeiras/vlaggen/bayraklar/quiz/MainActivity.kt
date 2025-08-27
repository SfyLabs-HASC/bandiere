package com.flags.banderas.bandiere.drapeaux.bandeiras.vlaggen.bayraklar.quiz

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.collection.LruCache
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Brightness4
import androidx.compose.material.icons.filled.Brightness7
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.VolumeOff
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardItem
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.util.Locale

// -------------------- Data --------------------

data class Country(val code: String, val nameEn: String)

object CountryRepository {
    private var cached: List<Country>? = null

    suspend fun loadAll(context: android.content.Context): List<Country> {
        cached?.let { return it }
        return withContext(Dispatchers.IO) {
            val json = context.assets.open("countries.json").bufferedReader().use { it.readText() }
            val arr = JSONArray(json)
            val list = buildList {
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    add(Country(obj.getString("code"), obj.getString("name_en")))
                }
            }
            cached = list
            list
        }
    }
}

// -------------------- ML Kit Translate (runtime i18n) --------------------

class Translator(
    private val appContext: android.content.Context,
    private val baseLanguage: String = "en"
) {
    private val cache = LruCache<String, String>(2048)

    suspend fun translate(text: String, target: String): String {
        val key = "$target::$text"
        cache.get(key)?.let { return it }
        val client = com.google.mlkit.nl.translate.Translation.getClient(
            com.google.mlkit.nl.translate.TranslatorOptions.Builder()
                .setSourceLanguage(langCode(baseLanguage))
                .setTargetLanguage(langCode(target))
                .build()
        )
        try {
            withContext(Dispatchers.IO) {
                client.downloadModelIfNeeded(
                    com.google.mlkit.common.model.DownloadConditions.Builder().build()
                ).await()
            }
            val result = withContext(Dispatchers.IO) { client.translate(text).await() }
            cache.put(key, result)
            return result
        } finally {
            client.close()
        }
    }

    private fun langCode(bcp47: String): String {
        return com.google.mlkit.nl.translate.TranslateLanguage.fromLanguageTag(bcp47)
            ?: com.google.mlkit.nl.translate.TranslateLanguage.ENGLISH
    }
}

private suspend fun <T> com.google.android.gms.tasks.Task<T>.await(): T =
    kotlinx.coroutines.suspendCancellableCoroutine { cont ->
        addOnSuccessListener { cont.resume(it, null) }
        addOnFailureListener { cont.resumeWithException(it) }
    }

// -------------------- Ads helpers --------------------

class AdsManager(private val context: android.content.Context) {
    var interstitial: InterstitialAd? by mutableStateOf(null)
    var rewarded: RewardedAd? by mutableStateOf(null)
    var adsDisabledUntilMs by mutableStateOf(0L)

    fun init() {
        MobileAds.initialize(context)
        loadInterstitial()
        loadRewarded()
    }

    fun areAdsDisabledNow(): Boolean = System.currentTimeMillis() < adsDisabledUntilMs

    fun disableAdsFor(minutes: Int) { adsDisabledUntilMs = System.currentTimeMillis() + minutes * 60_000 }

    private fun loadInterstitial() {
        if (areAdsDisabledNow()) { interstitial = null; return }
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            context,
            "ca-app-pub-3940256099942544/1033173712",
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) { interstitial = ad }
                override fun onAdFailedToLoad(error: LoadAdError) { interstitial = null }
            }
        )
    }

    private fun loadRewarded() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(
            context,
            "ca-app-pub-3940256099942544/5354046379",
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) { rewarded = ad }
                override fun onAdFailedToLoad(error: LoadAdError) { rewarded = null }
            }
        )
    }

    fun showInterstitial(onClosed: () -> Unit) {
        if (areAdsDisabledNow()) { onClosed(); return }
        interstitial?.show(context as ComponentActivity) {
            loadInterstitial(); onClosed()
        } ?: onClosed()
    }

    fun showRewarded(onReward: (RewardItem) -> Unit, onClosed: () -> Unit) {
        rewarded?.show(context as ComponentActivity) { rewardItem -> onReward(rewardItem) } ?: onClosed()
        loadRewarded()
    }
}

@Composable
fun BottomBanner(modifier: Modifier = Modifier, adsManager: AdsManager) {
    if (adsManager.areAdsDisabledNow()) {
        Box(modifier.fillMaxWidth().height(0.dp))
        return
    }
    AndroidView(
        factory = { ctx ->
            AdView(ctx).apply {
                setAdSize(AdSize.BANNER)
                adUnitId = "ca-app-pub-3940256099942544/9214589741"
                loadAd(AdRequest.Builder().build())
            }
        },
        modifier = modifier
    )
}

// -------------------- Quiz ViewModel --------------------

class QuizViewModel : androidx.lifecycle.ViewModel() {
    var countries by mutableStateOf<List<Country>>(emptyList())
        private set
    var currentIndex by mutableStateOf(0)
        private set
    var options by mutableStateOf<List<Country>>(emptyList())
        private set
    var score by mutableStateOf(0)
        private set
    var lives by mutableStateOf(3)
        private set
    var isFinished by mutableStateOf(false)
        private set
    var lastAnswerCorrect by mutableStateOf<Boolean?>(null)
        private set

    fun start(list: List<Country>) {
        countries = list.shuffled()
        currentIndex = 0
        lives = 3
        score = 0
        isFinished = false
        nextRound()
    }

    private fun nextRound() {
        if (currentIndex >= countries.size) { isFinished = true; return }
        val correct = countries[currentIndex]
        val wrongs = countries.filter { it.code != correct.code }.shuffled().take(3)
        options = (wrongs + correct).shuffled()
        lastAnswerCorrect = null
    }

    fun answer(country: Country) {
        val correct = countries[currentIndex]
        if (country.code == correct.code) {
            score++
            lastAnswerCorrect = true
            currentIndex++
            nextRound()
        } else {
            lives--
            lastAnswerCorrect = false
            if (lives <= 0) isFinished = true
        }
    }

    fun refillLives() { lives = 3 }
}

// -------------------- UI --------------------

@OptIn(ExperimentalMaterial3Api::class)
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val ads = AdsManager(this)
        ads.init()

        setContent {
            var isDark by remember { mutableStateOf(false) }
            var soundOn by remember { mutableStateOf(true) }
            val translator = remember { Translator(applicationContext, "en") }
            val locale = remember { mutableStateOf(Locale.getDefault().language) }

            MaterialTheme(colorScheme = if (isDark) darkColorScheme() else lightColorScheme()) {
                var showMenu by remember { mutableStateOf(false) }
                var currentScreen by remember { mutableStateOf("home") }

                var showLanguageDialog by remember { mutableStateOf(false) }

                Scaffold(
                    topBar = {
                        TopAppBar(
                            title = { Text("BANDIERE DEL MONDO", fontWeight = FontWeight.Bold) },
                            actions = {
                                IconButton(onClick = { soundOn = !soundOn }) {
                                    Icon(if (soundOn) Icons.Filled.VolumeUp else Icons.Filled.VolumeOff, contentDescription = "Suono")
                                }
                                IconButton(onClick = { isDark = !isDark }) {
                                    Icon(if (isDark) Icons.Filled.Brightness7 else Icons.Filled.Brightness4, contentDescription = "Tema")
                                }
                                Box {
                                    IconButton(onClick = { showMenu = true }) {
                                        Icon(Icons.Filled.Menu, contentDescription = "Menu")
                                    }
                                    DropdownMenu(expanded = showMenu, onDismissRequest = { showMenu = false }) {
                                        val ctx = LocalContext.current
                                        DropdownMenuItem(
                                            text = { Text("Lingua") },
                                            onClick = {
                                                showMenu = false
                                                showLanguageDialog = true
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Info") },
                                            onClick = {
                                                showMenu = false
                                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/dev?id=8110003578536044721&hl=it"))
                                                ctx.startActivity(intent)
                                            }
                                        )
                                        DropdownMenuItem(
                                            text = { Text("Rimuovi pubblicità per 10 minuti") },
                                            onClick = {
                                                showMenu = false
                                                ads.showRewarded(onReward = { ads.disableAdsFor(10) }, onClosed = {})
                                            }
                                        )
                                    }
                                }
                            }
                        )
                    },
                    bottomBar = { BottomBanner(Modifier.fillMaxWidth(), ads) }
                ) { innerPadding ->
                    if (showLanguageDialog) {
                        LanguageDialog(onPick = { lang ->
                            locale.value = lang
                            showLanguageDialog = false
                        }, onDismiss = { showLanguageDialog = false })
                    }

                    when (currentScreen) {
                        "home" -> HomeScreen(Modifier.padding(innerPadding), onPlay = { currentScreen = "quiz" })
                        "quiz" -> QuizScreen(
                            modifier = Modifier.padding(innerPadding),
                            ads = ads,
                            translator = translator,
                            locale = locale.value,
                            soundOn = soundOn,
                            onExitToHome = { currentScreen = "home" }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun LanguageDialog(onPick: (String) -> Unit, onDismiss: () -> Unit) {
    val all = remember { com.google.mlkit.nl.translate.TranslateLanguage.getAllLanguages().sorted() }
    val ctx = LocalContext.current
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Seleziona lingua") },
        text = {
            LazyColumn(Modifier.height(400.dp)) {
                items(all) { code ->
                    val localeName = Locale(code).displayName.replaceFirstChar { it.uppercase() }
                    ListItem(
                        headlineContent = { Text(localeName) },
                        modifier = Modifier.clickable {
                            onPick(code)
                            Toast.makeText(ctx, "Lingua: $localeName", Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        },
        confirmButton = { TextButton(onClick = onDismiss) { Text("Chiudi") } }
    )
}

@Composable
fun HomeScreen(modifier: Modifier = Modifier, onPlay: () -> Unit) {
    Column(
        modifier = modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            BigCardButton(titleTop = "1", titleBottom = "1 BANDIERA\n4 NOMI", enabled = true, onClick = onPlay)
            BigCardButton(titleTop = "2", titleBottom = "4 BANDIERE\n1 NOME", enabled = false) {}
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            BigCardButton(titleTop = "3", titleBottom = "CAPITALI", enabled = false) {}
            BigCardButton(titleTop = "4", titleBottom = "STUDIA E IMPARA", enabled = false) {}
        }
        Spacer(Modifier.weight(1f))
    }
}

@Composable
fun BigCardButton(titleTop: String, titleBottom: String, enabled: Boolean, onClick: () -> Unit) {
    val surfaceColor = if (enabled) MaterialTheme.colorScheme.primary else Color(0xFF6FA8FF)
    Column(
        modifier = Modifier
            .weight(1f)
            .height(220.dp)
            .background(Color.Transparent)
            .clickable(enabled = enabled, onClick = onClick)
    ) {
        Box(
            modifier = Modifier.fillMaxWidth().height(140.dp).background(Color.White),
            contentAlignment = Alignment.Center
        ) {
            Text(titleTop, color = Color.Blue, style = MaterialTheme.typography.headlineLarge)
        }
        Box(
            modifier = Modifier.fillMaxWidth().height(80.dp).background(surfaceColor),
            contentAlignment = Alignment.Center
        ) {
            Text(titleBottom, color = Color.White, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
        }
    }
}

@Composable
fun QuizScreen(
    modifier: Modifier = Modifier,
    ads: AdsManager,
    translator: Translator,
    locale: String,
    soundOn: Boolean,
    onExitToHome: () -> Unit,
    vm: QuizViewModel = viewModel()
) {
    val ctx = LocalContext.current
    var showExitDialog by remember { mutableStateOf(false) }
    var showLoseDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        val all = CountryRepository.loadAll(ctx)
        vm.start(all)
    }

    BackHandler(enabled = true) { showExitDialog = true }

    if (vm.isFinished && vm.lives <= 0) { showLoseDialog = true }

    if (showExitDialog) {
        ConfirmDialog(
            text = "Sei sicuro? I tuoi risultati andranno persi e dovrai ricominciare da capo.",
            onNo = { showExitDialog = false },
            onYes = { showExitDialog = false; onExitToHome() }
        )
    }

    if (showLoseDialog) {
        LoseDialog(
            score = vm.score,
            onContinue = { ads.showRewarded(onReward = { vm.refillLives(); showLoseDialog = false }, onClosed = {}) },
            onShare = {
                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, "Ciao ho appena giocato a Bandiere del Mondo e ho realizzato ${vm.score} punti! Gioca anche tu: https://play.google.com/store/apps/details?id=com.asmolgam.flags&hl=it")
                }
                ctx.startActivity(Intent.createChooser(shareIntent, "Condividi"))
                ads.showInterstitial { onExitToHome() }
            },
            onRetry = { ads.showInterstitial { showLoseDialog = false; val all = CountryRepository.loadAll(ctx); vm.start(all) } },
            onClose = { ads.showInterstitial { showLoseDialog = false; onExitToHome() } }
        )
    }

    Column(modifier = modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { showExitDialog = true }) { Icon(Icons.Filled.ArrowBack, contentDescription = "Back") }
            Row {
                repeat(3) { i ->
                    val filled = i < vm.lives
                    val res = if (filled) R.drawable.ic_heart_filled else R.drawable.ic_heart_outline
                    Image(painterResource(res), contentDescription = null, modifier = Modifier.size(28.dp))
                    Spacer(Modifier.width(8.dp))
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        Box(modifier = Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
            val current = vm.countries.getOrNull(vm.currentIndex)
            if (current != null) {
                AsyncImage(
                    model = "file:///android_asset/flags/${current.code.lowercase(Locale.ROOT)}.png",
                    contentDescription = "Flag",
                    modifier = Modifier.fillMaxWidth(0.9f).aspectRatio(4f / 3f).background(Color.White)
                )
            }
        }

        Spacer(Modifier.height(8.dp))

        Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            vm.options.chunked(2).forEach { row ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEach { opt ->
                        val textState = remember(opt to locale) { mutableStateOf(opt.nameEn) }
                        LaunchedEffect(opt.code, locale) {
                            textState.value = try { translator.translate(opt.nameEn, locale) } catch (_: Exception) { opt.nameEn }
                        }
                        AnswerButton(text = textState.value, onClick = { vm.answer(opt); playSound(ctx, soundOn, vm.lastAnswerCorrect == true) }, enabled = !vm.isFinished)
                    }
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        if (vm.isFinished && vm.lives > 0) {
            LaunchedEffect("win") { ads.showInterstitial { onExitToHome() } }
        }
    }
}

@Composable
fun AnswerButton(text: String, onClick: () -> Unit, enabled: Boolean) {
    Button(
        onClick = onClick,
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDDDDDD)),
        modifier = Modifier.weight(1f).height(56.dp)
    ) { Text(text = text, color = Color.Black, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth()) }
}

@Composable
fun ConfirmDialog(text: String, onNo: () -> Unit, onYes: () -> Unit) {
    AlertDialog(
        onDismissRequest = onNo,
        title = { Text("Conferma") },
        text = { Text(text) },
        confirmButton = { TextButton(onClick = onYes) { Text("SI") } },
        dismissButton = { TextButton(onClick = onNo) { Text("NO") } }
    )
}

@Composable
fun LoseDialog(score: Int, onContinue: () -> Unit, onShare: () -> Unit, onRetry: () -> Unit, onClose: () -> Unit) {
    AlertDialog(
        onDismissRequest = {},
        title = { Text("HAI PERSO") },
        text = { Text("Punteggio: $score") },
        confirmButton = {
            Column {
                TextButton(onClick = onContinue) { Text("CONTINUA (Guarda video)") }
                TextButton(onClick = onShare) { Text("CONDIVIDI") }
                TextButton(onClick = onRetry) { Text("RIPROVA") }
                TextButton(onClick = onClose) { Text("CHIUDI") }
            }
        }
    )
}

fun playSound(ctx: android.content.Context, enabled: Boolean, success: Boolean) {
    if (!enabled) return
    val res = if (success) R.raw.correct else R.raw.wrong
    val mp = android.media.MediaPlayer.create(ctx, res)
    mp.setOnCompletionListener { it.release() }
    mp.start()
}

