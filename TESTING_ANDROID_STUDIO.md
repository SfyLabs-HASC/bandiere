# 🚀 Guida Completa: Testing con Android Studio

## 📋 Prerequisiti

### 1. **Installazione Software**
- ✅ **Android Studio** (ultima versione)
- ✅ **Node.js** (v16 o superiore)
- ✅ **Java Development Kit (JDK)** (v11 o v17)
- ✅ **Android SDK** (API level 21+)

### 2. **Configurazione Android Studio**
1. Apri Android Studio
2. Vai su `File > Settings` (o `Android Studio > Preferences` su Mac)
3. Naviga su `Appearance & Behavior > System Settings > Android SDK`
4. Assicurati di avere installato:
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.0
   - Android Emulator
   - Android SDK Platform-Tools

## 🔧 Setup del Progetto

### 1. **Aprire il Progetto**
```bash
# Naviga nella cartella del progetto
cd /workspace

# Apri Android Studio e seleziona "Open an Existing Project"
# Seleziona la cartella "android" dentro il progetto
```

### 2. **Configurazione Emulatore**
1. In Android Studio, vai su `Tools > AVD Manager`
2. Clicca su `Create Virtual Device`
3. Scegli un dispositivo (es. Pixel 6)
4. Seleziona un'immagine di sistema (API 30+ raccomandato)
5. Clicca `Finish` e avvia l'emulatore

### 3. **Installazione Dipendenze**
```bash
# Nella root del progetto
npm install

# Se hai problemi con le dipendenze, prova:
npm install --legacy-peer-deps
```

## 🏃‍♂️ Avviare l'App

### Metodo 1: Da Android Studio
1. Apri il progetto Android (`/workspace/android`)
2. Aspetta che Gradle finisca la sincronizzazione
3. Assicurati che l'emulatore sia avviato
4. Clicca sul pulsante ▶️ "Run" o premi `Shift + F10`

### Metodo 2: Da Terminale
```bash
# Avvia Metro Bundler (in un terminale)
npm start

# In un altro terminale, avvia l'app Android
npm run android
```

### Metodo 3: Build APK per Testing
```bash
# Crea un APK di debug
cd android
./gradlew assembleDebug

# L'APK sarà in: android/app/build/outputs/apk/debug/app-debug.apk
```

## 🧪 Scenari di Test

### 1. **Test Funzionalità Multilingua**
```
✅ Test da eseguire:
1. Cambia lingua del dispositivo (Settings > System > Languages)
2. Riavvia l'app
3. Verifica che l'interfaccia sia tradotta
4. Testa italiano, inglese, spagnolo
5. Testa una lingua non supportata (dovrebbe usare inglese)

✅ Risultati attesi:
- Testi dell'interfaccia tradotti correttamente
- Nomi dei paesi nella lingua selezionata
- Fallback all'inglese per lingue non supportate
```

### 2. **Test Modalità di Gioco**
```
🎮 Guess the Flag:
✅ Mostra bandiera emoji
✅ 4 opzioni di nomi paesi
✅ Feedback visivo (verde/rosso)
✅ Punteggio incrementa (+5 punti)
✅ 20 domande totali

🌍 Guess the Country:
✅ Mostra nome paese
✅ 4 opzioni di bandiere
✅ Feedback visivo corretto
✅ Punteggio incrementa (+5 punti)

⏰ Timed Quiz:
✅ Timer 60 secondi
✅ Domande miste (bandiere + paesi)
✅ +5 secondi per risposta corretta
✅ -3 secondi per risposta sbagliata
✅ +10 punti per risposta corretta
✅ Gioco termina quando timer = 0

🏛️ Capital Quiz:
✅ Mostra nome paese + bandiera
✅ 4 opzioni di capitali
✅ Traduzioni capitali corrette
✅ Punteggio incrementa (+5 punti)
```

### 3. **Test Sistema Audio**
```
🔊 Test Suoni:
1. Vai in Settings
2. Attiva/disattiva "Sound Effects"
3. Testa ogni suono:
   ✅ Click sui pulsanti
   ✅ Inizio partita
   ✅ Risposta corretta
   ✅ Risposta sbagliata
   ✅ Fine partita

⚠️ Nota: I suoni sono placeholder, sostituisci con file MP3 reali
```

### 4. **Test Statistiche**
```
📊 Test Statistics Screen:
✅ Best Score per ogni modalità
✅ Total Games aggiornato
✅ Accuracy calcolata correttamente
✅ Achievement unlocked quando applicabile
✅ Statistiche persistenti (chiudi/riapri app)
```

### 5. **Test Navigazione e UI**
```
🎨 Test Interfaccia:
✅ Animazioni smooth tra schermate
✅ Gradienti visualizzati correttamente
✅ Icone caricate correttamente
✅ Responsive su diverse dimensioni schermo
✅ Orientamento portrait/landscape
✅ StatusBar colorata correttamente
```

## 🐛 Debug e Troubleshooting

### 1. **Problemi Comuni**
```bash
# Se l'app non si avvia:
npx react-native doctor

# Se ci sono errori di build:
cd android
./gradlew clean
cd ..
npm run android

# Se Metro non si connette:
npx react-native start --reset-cache
```

### 2. **Debug Console**
```bash
# Visualizza i log in tempo reale:
npx react-native log-android

# Oppure usa Android Studio Logcat:
# View > Tool Windows > Logcat
```

### 3. **React Native Debugger**
1. Installa React Native Debugger
2. Apri l'app sull'emulatore
3. Premi `Ctrl + M` (o scuoti il dispositivo)
4. Seleziona "Debug"

## 📱 Test su Dispositivo Fisico

### 1. **Preparazione Dispositivo**
1. Abilita "Developer Options" su Android
2. Abilita "USB Debugging"
3. Collega il dispositivo via USB

### 2. **Installazione**
```bash
# Verifica che il dispositivo sia riconosciuto
adb devices

# Avvia l'app sul dispositivo
npm run android
```

## ⚡ Performance Testing

### 1. **Test Performance**
```
✅ Test da eseguire:
- Tempo di avvio app (<3 secondi)
- Transizioni fluide tra schermate
- Nessun lag durante le animazioni
- Consumo memoria ragionevole
- Risposta touch immediata
```

### 2. **Test Stress**
```
✅ Scenari intensivi:
- Gioca 50+ partite consecutive
- Cambia rapidamente tra modalità
- Apri/chiudi l'app ripetutamente
- Ruota schermo durante il gioco
```

## 🏆 Checklist Completa di Test

### ✅ **Funzionalità Core**
- [ ] Tutte e 4 le modalità di gioco funzionano
- [ ] Punteggi calcolati correttamente
- [ ] Timer funziona in modalità Timed
- [ ] Domande randomizzate correttamente
- [ ] Nessuna domanda ripetuta nella stessa partita

### ✅ **Multilingua**
- [ ] Auto-detect lingua dispositivo
- [ ] Cambio lingua manuale funziona
- [ ] Tutte le traduzioni presenti
- [ ] Fallback inglese per lingue non supportate

### ✅ **UI/UX**
- [ ] Design responsive
- [ ] Animazioni fluide
- [ ] Feedback visivo chiaro
- [ ] Navigazione intuitiva

### ✅ **Persistenza Dati**
- [ ] Statistiche salvate correttamente
- [ ] Impostazioni persistenti
- [ ] Dati non persi al riavvio

### ✅ **Audio**
- [ ] Tutti i suoni funzionano
- [ ] Toggle audio funziona
- [ ] Nessun audio sovrapposto

## 🎯 Metriche di Successo

```
✅ App considerata funzionante se:
- Avvio < 3 secondi
- 0 crash durante test di 30 minuti
- Tutte le modalità completabili
- Statistiche accurate al 100%
- Traduzioni complete per lingue supportate
- UI responsive su schermi 5"-7"
```

## 📝 Report Bug Template

```
🐛 BUG REPORT:
- Dispositivo: [es. Pixel 6, Android 13]
- Versione App: 1.0.0
- Passi per riprodurre:
  1. [Passo 1]
  2. [Passo 2]
  3. [Passo 3]
- Risultato atteso: [Cosa dovrebbe succedere]
- Risultato attuale: [Cosa succede invece]
- Screenshot: [Se applicabile]
- Log: [Copia da Logcat se disponibile]
```

---

## 🚀 Quick Start per Testing

```bash
# 1. Setup rapido
cd /workspace
npm install

# 2. Avvia emulatore da Android Studio

# 3. Avvia app
npm run android

# 4. Inizia testing seguendo questa guida!
```

**Buon testing! 🎮📱**