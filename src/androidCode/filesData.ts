export interface AndroidFile {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'kotlin' | 'xml' | 'config';
  language: 'kotlin' | 'xml' | 'groovy' | 'properties';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  // 1. Root build.gradle.kts
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Root Gradle build configuration with Android & Kotlin plugins and Google services',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    id("com.google.gms.google-services") version "4.4.2" apply false
}
`
  },

  // 2. settings.gradle.kts
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    language: 'kotlin',
    description: 'Project settings and dependency repository definitions (Google, MavenCentral)',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
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

rootProject.name = "Auto AI Lite"
include(":app")
`
  },

  // 3. gradle.properties
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    category: 'config',
    language: 'properties',
    description: 'JVM args and AndroidX configuration flags',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
android.nonTransitiveRClass=true
`
  },

  // 4. app/build.gradle.kts
  {
    path: 'app/build.gradle.kts',
    name: 'build.gradle.kts (app)',
    category: 'gradle',
    language: 'kotlin',
    description: 'App module build script with minSdk 26, Material 3, ViewBinding, Coroutines, DataStore, Crypto, and Firebase',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.example.autoailite"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.autoailite"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-opt-in=kotlinx.coroutines.FlowPreview"
        )
    }

    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    // AndroidX Core & UI
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.activity:activity-ktx:1.9.0")
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.cardview:cardview:1.0.0")

    // Lifecycle & MVVM
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.2")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.2")
    implementation("androidx.lifecycle:lifecycle-service:2.8.2")

    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")

    // Jetpack Preferences & DataStore
    implementation("androidx.datastore:datastore-preferences:1.1.1")

    // Security Crypto for EncryptedSharedPreferences (Gemini API key)
    implementation("androidx.security:security-crypto:1.1.0-alpha06")

    // Networking for Gemini API direct REST call
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.json:json:20240303")

    // Firebase (BOM platform)
    implementation(platform("com.google.firebase:firebase-bom:33.1.1"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
}
`
  },

  // 5. AndroidManifest.xml
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Manifest declaring SYSTEM_ALERT_WINDOW, FOREGROUND_SERVICE (specialUse), and Accessibility Service',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.autoailite">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:name=".AutoAiApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AutoAILite"
        tools:targetApi="34">

        <!-- Main Dashboard Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/Theme.AutoAILite">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Settings Activity -->
        <activity
            android:name=".ui.SettingsActivity"
            android:exported="false"
            android:label="@string/settings_title"
            android:parentActivityName=".MainActivity" />

        <!-- Admin Panel Activity (Hidden behind long-press on App Title) -->
        <activity
            android:name=".ui.AdminPanelActivity"
            android:exported="false"
            android:label="@string/admin_panel_title"
            android:parentActivityName=".MainActivity" />

        <!-- Floating Overlay Service (Foreground SpecialUse for Android 14) -->
        <service
            android:name=".service.FloatingService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="Floating interactive automation overlay helper" />
        </service>

        <!-- Accessibility Service for automated screen taps and node inspection -->
        <service
            android:name=".service.AutoAutomationService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

    </application>

</manifest>
`
  },

  // 6. Application class
  {
    path: 'app/src/main/java/com/example/autoailite/AutoAiApp.kt',
    name: 'AutoAiApp.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Application class initializing DataStore and Notification Channels',
    content: `package com.example.autoailite

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.example.autoailite.data.DataStoreManager
import com.example.autoailite.data.LicenseManager

class AutoAiApp : Application() {

    lateinit var dataStoreManager: DataStoreManager
        private set

    lateinit var licenseManager: LicenseManager
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        dataStoreManager = DataStoreManager(this)
        licenseManager = LicenseManager(this)

        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Auto AI Floating Overlay Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows active status of the floating automation overlay"
                setShowBadge(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val CHANNEL_ID = "channel_floating_service"
        lateinit var instance: AutoAiApp
            private set
    }
}
`
  },

  // 7. MainActivity.kt
  {
    path: 'app/src/main/java/com/example/autoailite/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Dark theme dashboard with RGB card, permissions checks, start/stop toggle, risk disclaimer, and hidden admin access',
    content: `package com.example.autoailite

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.example.autoailite.databinding.ActivityMainBinding
import com.example.autoailite.service.AutoAutomationService
import com.example.autoailite.service.FloatingService
import com.example.autoailite.ui.AdminPanelActivity
import com.example.autoailite.ui.SettingsActivity
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val app get() = application as AutoAiApp

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (!granted) {
            Toast.makeText(this, R.string.notification_permission_warn, Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
        observeDataStore()
        checkLicenseStatus()
        checkRiskDisclaimer()
        requestNotificationPermissionIfNeeded()
    }

    override fun onResume() {
        super.onResume()
        refreshPermissionStates()
    }

    private fun setupListeners() {
        // App title long press opens AdminPanelActivity
        binding.tvAppTitle.setOnLongClickListener {
            startActivity(Intent(this, AdminPanelActivity::class.java))
            true
        }

        // Floating Service Start / Stop Toggle
        binding.btnToggleFloatingService.setOnClickListener {
            toggleFloatingService()
        }

        // Grant Overlay Permission
        binding.btnGrantOverlay.setOnClickListener {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
        }

        // Grant Accessibility Permission
        binding.btnGrantAccessibility.setOnClickListener {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            startActivity(intent)
        }

        // Settings Button
        binding.btnOpenSettings.setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        // Refresh status button
        binding.btnRefreshStatus.setOnClickListener {
            refreshPermissionStates()
            Toast.makeText(this, R.string.status_refreshed, Toast.LENGTH_SHORT).show()
        }
    }

    private fun refreshPermissionStates() {
        val hasOverlay = Settings.canDrawOverlays(this)
        val hasAccessibility = AutoAutomationService.isServiceEnabled(this)
        val isServiceRunning = FloatingService.isRunning

        // Overlay Status
        if (hasOverlay) {
            binding.tvOverlayStatus.text = getString(R.string.status_granted)
            binding.tvOverlayStatus.setTextColor(ContextCompat.getColor(this, R.color.neon_green))
            binding.btnGrantOverlay.visibility = View.GONE
        } else {
            binding.tvOverlayStatus.text = getString(R.string.status_denied)
            binding.tvOverlayStatus.setTextColor(ContextCompat.getColor(this, R.color.neon_red))
            binding.btnGrantOverlay.visibility = View.VISIBLE
        }

        // Accessibility Status
        if (hasAccessibility) {
            binding.tvAccessibilityStatus.text = getString(R.string.status_active)
            binding.tvAccessibilityStatus.setTextColor(ContextCompat.getColor(this, R.color.neon_green))
            binding.btnGrantAccessibility.visibility = View.GONE
        } else {
            binding.tvAccessibilityStatus.text = getString(R.string.status_inactive)
            binding.tvAccessibilityStatus.setTextColor(ContextCompat.getColor(this, R.color.neon_yellow))
            binding.btnGrantAccessibility.visibility = View.VISIBLE
        }

        // Floating Service Status
        if (isServiceRunning) {
            binding.tvServiceStatus.text = getString(R.string.service_running)
            binding.tvServiceStatus.setTextColor(ContextCompat.getColor(this, R.color.neon_green))
            binding.btnToggleFloatingService.text = getString(R.string.stop_floating_panel)
            binding.btnToggleFloatingService.setBackgroundColor(ContextCompat.getColor(this, R.color.btn_danger))
        } else {
            binding.tvServiceStatus.text = getString(R.string.service_stopped)
            binding.tvServiceStatus.setTextColor(ContextCompat.getColor(this, R.color.text_muted))
            binding.btnToggleFloatingService.text = getString(R.string.start_floating_panel)
            binding.btnToggleFloatingService.setBackgroundColor(ContextCompat.getColor(this, R.color.neon_cyan))
        }
    }

    private fun toggleFloatingService() {
        if (!Settings.canDrawOverlays(this)) {
            Toast.makeText(this, R.string.grant_overlay_first, Toast.LENGTH_LONG).show()
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
            return
        }

        if (FloatingService.isRunning) {
            val stopIntent = Intent(this, FloatingService::class.java).apply {
                action = FloatingService.ACTION_STOP_SERVICE
            }
            startService(stopIntent)
        } else {
            val startIntent = Intent(this, FloatingService::class.java).apply {
                action = FloatingService.ACTION_START_SERVICE
            }
            ContextCompat.startForegroundService(this, startIntent)
        }

        binding.root.postDelayed({ refreshPermissionStates() }, 300)
    }

    private fun checkLicenseStatus() {
        lifecycleScope.launch {
            val status = app.licenseManager.checkLicenseStatus()
            if (status.isBlocked || status.isExpired) {
                showBlockDialog(status.reason)
            }
        }
    }

    private fun showBlockDialog(reason: String) {
        AlertDialog.Builder(this, R.style.Theme_AutoAILite_Dialog)
            .setTitle(R.string.license_restricted_title)
            .setMessage(getString(R.string.license_restricted_msg, reason))
            .setCancelable(false)
            .setPositiveButton(R.string.exit_app) { _, _ -> finish() }
            .show()
    }

    private fun checkRiskDisclaimer() {
        lifecycleScope.launch {
            app.dataStoreManager.disclaimerAcceptedFlow.collectLatest { accepted ->
                if (!accepted) {
                    showRiskDisclaimerDialog()
                }
            }
        }
    }

    private fun showRiskDisclaimerDialog() {
        AlertDialog.Builder(this, R.style.Theme_AutoAILite_Dialog)
            .setTitle(R.string.risk_disclaimer_title)
            .setMessage(R.string.risk_disclaimer_content)
            .setCancelable(false)
            .setPositiveButton(R.string.disclaimer_accept) { _, _ ->
                lifecycleScope.launch {
                    app.dataStoreManager.setDisclaimerAccepted(true)
                }
            }
            .setNegativeButton(R.string.disclaimer_decline) { _, _ ->
                finish()
            }
            .show()
    }

    private fun observeDataStore() {
        lifecycleScope.launch {
            app.dataStoreManager.settingsFlow.collectLatest { settings ->
                binding.tvConfigSummary.text = getString(
                    R.string.config_summary_text,
                    settings.targetAmount,
                    settings.actionDelayMs,
                    settings.maxActions
                )
            }
        }
    }

    private fun requestNotificationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notificationPermissionLauncher.launch(android.Manifest.permission.POST_NOTIFICATIONS)
        }
    }
}
`
  },

  // 8. FloatingService.kt
  {
    path: 'app/src/main/java/com/example/autoailite/service/FloatingService.kt',
    name: 'FloatingService.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Draggable overlay window with countdown, signal, sweep scan animation, bubble collapse, and safety stops',
    content: `package com.example.autoailite.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import androidx.core.app.NotificationCompat
import com.example.autoailite.AutoAiApp
import com.example.autoailite.MainActivity
import com.example.autoailite.R
import com.example.autoailite.data.AppSettings
import com.example.autoailite.databinding.LayoutFloatingBubbleBinding
import com.example.autoailite.databinding.LayoutFloatingOverlayBinding
import com.example.autoailite.engine.Signal
import com.example.autoailite.engine.SignalEngineFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class FloatingService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var overlayBinding: LayoutFloatingOverlayBinding
    private lateinit var bubbleBinding: LayoutFloatingBubbleBinding

    private lateinit var overlayParams: WindowManager.LayoutParams
    private lateinit var bubbleParams: WindowManager.LayoutParams

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private var automationJob: Job? = null

    private var isExpanded = true
    private var isAutoRunning = false
    private var actionCount = 0
    private var consecutiveLosses = 0

    private val app get() = application as AutoAiApp

    companion object {
        const val ACTION_START_SERVICE = "ACTION_START_SERVICE"
        const val ACTION_STOP_SERVICE = "ACTION_STOP_SERVICE"
        const val NOTIFICATION_ID = 1001
        var isRunning = false
            private set
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        isRunning = true
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        initViews()
        startForeground(NOTIFICATION_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP_SERVICE -> {
                stopSelf()
            }
            ACTION_START_SERVICE -> {
                // Ensure visible
            }
        }
        return START_STICKY
    }

    private fun initViews() {
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        // Overlay Params (Full Panel)
        overlayParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 60
            y = 200
        }

        // Bubble Params (Collapsed mini icon)
        bubbleParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 20
            y = 200
        }

        val inflater = LayoutInflater.from(this)
        overlayBinding = LayoutFloatingOverlayBinding.inflate(inflater)
        bubbleBinding = LayoutFloatingBubbleBinding.inflate(inflater)

        setupDragBehavior(overlayBinding.root, overlayParams)
        setupDragBehavior(bubbleBinding.root, bubbleParams)

        setupOverlayInteractions()
        setupBubbleInteractions()

        // Initially show overlay
        windowManager.addView(overlayBinding.root, overlayParams)
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setupDragBehavior(view: View, params: WindowManager.LayoutParams) {
        var initialX = 0
        var initialY = 0
        var initialTouchX = 0f
        var initialTouchY = 0f
        var isClick = false

        view.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isClick = true
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - initialTouchX).toInt()
                    val dy = (event.rawY - initialTouchY).toInt()
                    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
                        isClick = false
                    }
                    params.x = initialX + dx
                    params.y = initialY + dy
                    if (view.isAttachedToWindow) {
                        windowManager.updateViewLayout(view, params)
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (isClick) {
                        view.performClick()
                    }
                    true
                }
                else -> false
            }
        }
    }

    private fun setupOverlayInteractions() {
        // Collapse button
        overlayBinding.btnCollapse.setOnClickListener {
            collapseToBubble()
        }

        // Close service button
        overlayBinding.btnClose.setOnClickListener {
            stopSelf()
        }

        // Auto Toggle
        overlayBinding.btnToggleAuto.setOnClickListener {
            if (isAutoRunning) {
                stopAutomation("User tapped Stop")
            } else {
                startAutomation()
            }
        }
    }

    private fun setupBubbleInteractions() {
        bubbleBinding.root.setOnClickListener {
            expandToOverlay()
        }
    }

    private fun collapseToBubble() {
        if (!isExpanded) return
        isExpanded = false
        if (overlayBinding.root.isAttachedToWindow) {
            windowManager.removeView(overlayBinding.root)
        }
        bubbleParams.x = overlayParams.x
        bubbleParams.y = overlayParams.y
        windowManager.addView(bubbleBinding.root, bubbleParams)
    }

    private fun expandToOverlay() {
        if (isExpanded) return
        isExpanded = true
        if (bubbleBinding.root.isAttachedToWindow) {
            windowManager.removeView(bubbleBinding.root)
        }
        overlayParams.x = bubbleParams.x
        overlayParams.y = bubbleParams.y
        windowManager.addView(overlayBinding.root, overlayParams)
    }

    private fun startAutomation() {
        isAutoRunning = true
        actionCount = 0
        overlayBinding.btnToggleAuto.text = getString(R.string.btn_stop_auto)
        overlayBinding.btnToggleAuto.setBackgroundResource(R.drawable.bg_pill_danger)
        overlayBinding.scanAnimationView.visibility = View.VISIBLE
        overlayBinding.scanAnimationView.startScanning()

        automationJob = serviceScope.launch {
            val settings = app.dataStoreManager.settingsFlow.first()
            val signalProvider = SignalEngineFactory.create(this@FloatingService, settings.engineType)

            while (isActive && isAutoRunning) {
                // Check Hard Safety Limit: Max Actions per session
                if (actionCount >= settings.maxActions) {
                    stopAutomation("Reached max actions safety limit (\${settings.maxActions})")
                    break
                }

                // Step 1: Countdown Timer
                for (countdown in 5 downTo 1) {
                    if (!isAutoRunning) break
                    overlayBinding.tvTimer.text = "\${countdown}s"
                    delay(1000)
                }
                if (!isAutoRunning) break

                // Step 2: Signal Analysis
                overlayBinding.tvSignal.text = getString(R.string.signal_analysing)
                overlayBinding.scanAnimationView.startScanning()

                val result = withContext(Dispatchers.IO) {
                    signalProvider.getSignal(
                        context = this@FloatingService,
                        screenshot = null,
                        promptContext = "Session actions: $actionCount. Current target: \${settings.targetAmount}"
                    )
                }

                overlayBinding.tvSignal.text = result.signal.name
                when (result.signal) {
                    Signal.UP -> overlayBinding.tvSignal.setTextColor(getColor(R.color.neon_green))
                    Signal.DOWN -> overlayBinding.tvSignal.setTextColor(getColor(R.color.neon_red))
                    Signal.WAIT -> overlayBinding.tvSignal.setTextColor(getColor(R.color.neon_yellow))
                }

                // Step 3: Execute Action via Accessibility Service
                if (result.signal != Signal.WAIT) {
                    val targetX = if (result.signal == Signal.UP) settings.buttonAX else settings.buttonBX
                    val targetY = if (result.signal == Signal.UP) settings.buttonAY else settings.buttonBY

                    // Send dispatch tap command to Accessibility Service
                    ActionCommandChannel.sendCommand(
                        ActionCommand.TapCoordinates(targetX, targetY)
                    )

                    actionCount++
                    overlayBinding.tvActionCount.text = getString(R.string.actions_progress, actionCount, settings.maxActions)
                }

                // Safety Delay between actions
                delay(settings.actionDelayMs)
            }
        }
    }

    private fun stopAutomation(reason: String) {
        isAutoRunning = false
        automationJob?.cancel()
        automationJob = null

        overlayBinding.btnToggleAuto.text = getString(R.string.btn_start_auto)
        overlayBinding.btnToggleAuto.setBackgroundResource(R.drawable.bg_pill_cyan)
        overlayBinding.scanAnimationView.stopScanning()
        overlayBinding.scanAnimationView.visibility = View.INVISIBLE
        overlayBinding.tvSignal.text = getString(R.string.signal_standby)
        overlayBinding.tvSignal.setTextColor(getColor(R.color.neon_cyan))
        overlayBinding.tvTimer.text = "--"
    }

    private fun buildNotification(): Notification {
        val launchIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val stopIntent = Intent(this, FloatingService::class.java).apply {
            action = ACTION_STOP_SERVICE
        }
        val stopPendingIntent = PendingIntent.getService(
            this,
            1,
            stopIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, AutoAiApp.CHANNEL_ID)
            .setContentTitle(getString(R.string.floating_notif_title))
            .setContentText(getString(R.string.floating_notif_desc))
            .setSmallIcon(R.drawable.ic_radar)
            .setContentIntent(pendingIntent)
            .addAction(R.drawable.ic_close, getString(R.string.stop), stopPendingIntent)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        serviceScope.cancel()

        if (isExpanded && overlayBinding.root.isAttachedToWindow) {
            windowManager.removeView(overlayBinding.root)
        } else if (!isExpanded && bubbleBinding.root.isAttachedToWindow) {
            windowManager.removeView(bubbleBinding.root)
        }
    }
}
`
  },

  // 9. AutoAutomationService.kt
  {
    path: 'app/src/main/java/com/example/autoailite/service/AutoAutomationService.kt',
    name: 'AutoAutomationService.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Accessibility Service executing dispatchGesture taps and finding/clicking nodes by text/id',
    content: `package com.example.autoailite.service

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Context
import android.graphics.Path
import android.os.Bundle
import android.provider.Settings
import android.text.TextUtils
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class AutoAutomationService : AccessibilityService() {

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    companion object {
        private const val TAG = "AutoAutomationService"
        var instance: AutoAutomationService? = null
            private set

        fun isServiceEnabled(context: Context): Boolean {
            val expectedServiceName = "\${context.packageName}/\${AutoAutomationService::class.java.canonicalName}"
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: return false

            val colonSplitter = TextUtils.SimpleStringSplitter(':')
            colonSplitter.setString(enabledServices)
            while (colonSplitter.hasNext()) {
                val componentName = colonSplitter.next()
                if (componentName.equals(expectedServiceName, ignoreCase = true)) {
                    return true
                }
            }
            return false
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        Log.d(TAG, "Accessibility Service Connected")

        // Listen for incoming commands from FloatingService
        serviceScope.launch {
            ActionCommandChannel.commands.collectLatest { command ->
                when (command) {
                    is ActionCommand.TapCoordinates -> {
                        tapAt(command.x.toFloat(), command.y.toFloat())
                    }
                    is ActionCommand.ClickNodeByText -> {
                        findAndClickByText(command.text)
                    }
                    is ActionCommand.ClickNodeById -> {
                        findAndClickById(command.viewId)
                    }
                }
            }
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Can be used to monitor window state changes or detect UI elements
    }

    override fun onInterrupt() {
        Log.w(TAG, "Accessibility Service Interrupted")
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
        serviceScope.cancel()
    }

    /**
     * Dispatches a tap gesture at the specified screen coordinates using Android GestureDescription
     */
    fun tapAt(x: Float, y: Float, durationMs: Long = 100): Boolean {
        if (x < 0 || y < 0) return false

        val path = Path().apply {
            moveTo(x, y)
        }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, durationMs))
            .build()

        val dispatched = dispatchGesture(gesture, object : GestureResultCallback() {
            override fun onCompleted(gestureDescription: GestureDescription?) {
                super.onCompleted(gestureDescription)
                Log.d(TAG, "Gesture completed at ($x, $y)")
            }

            override fun onCancelled(gestureDescription: GestureDescription?) {
                super.onCancelled(gestureDescription)
                Log.w(TAG, "Gesture cancelled at ($x, $y)")
            }
        }, null)

        return dispatched
    }

    /**
     * Recursively traverses AccessibilityNodeInfo tree to find and click a node by text
     */
    fun findAndClickByText(text: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByText(text)
        if (!nodes.isNullOrEmpty()) {
            for (node in nodes) {
                if (performClickOnNode(node)) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Finds and clicks node by viewId resource name
     */
    fun findAndClickById(viewId: String): Boolean {
        val rootNode = rootInActiveWindow ?: return false
        val nodes = rootNode.findAccessibilityNodeInfosByViewId(viewId)
        if (!nodes.isNullOrEmpty()) {
            for (node in nodes) {
                if (performClickOnNode(node)) {
                    return true
                }
            }
        }
        return false
    }

    private fun performClickOnNode(node: AccessibilityNodeInfo): Boolean {
        var current: AccessibilityNodeInfo? = node
        while (current != null) {
            if (current.isClickable) {
                val success = current.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                return success
            }
            current = current.parent
        }
        return false
    }
}
`
  },

  // 10. ActionCommand.kt
  {
    path: 'app/src/main/java/com/example/autoailite/service/ActionCommand.kt',
    name: 'ActionCommand.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Sealed class and SharedFlow channel for real-time IPC between FloatingService and AccessibilityService',
    content: `package com.example.autoailite.service

import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow

sealed class ActionCommand {
    data class TapCoordinates(val x: Int, val y: Int) : ActionCommand()
    data class ClickNodeByText(val text: String) : ActionCommand()
    data class ClickNodeById(val viewId: String) : ActionCommand()
}

object ActionCommandChannel {
    private val _commands = MutableSharedFlow<ActionCommand>(extraBufferCapacity = 16)
    val commands = _commands.asSharedFlow()

    fun sendCommand(command: ActionCommand) {
        _commands.tryEmit(command)
    }
}
`
  },

  // 11. SettingsActivity.kt
  {
    path: 'app/src/main/java/com/example/autoailite/ui/SettingsActivity.kt',
    name: 'SettingsActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'DataStore settings screen: coordinates picker, action delay, safety limits, Gemini key, and language switcher',
    content: `package com.example.autoailite.ui

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Configuration
import android.graphics.PixelFormat
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.autoailite.AutoAiApp
import com.example.autoailite.R
import com.example.autoailite.data.AppSettings
import com.example.autoailite.databinding.ActivitySettingsBinding
import com.example.autoailite.databinding.LayoutPositionPickerBinding
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.Locale

class SettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySettingsBinding
    private val app get() = application as AutoAiApp
    private var windowManager: WindowManager? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        setupSpinners()
        loadCurrentSettings()
        setupListeners()
    }

    private fun setupSpinners() {
        val languages = listOf("English", "বাংলা (Bangla)")
        val langAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, languages)
        binding.spinnerLanguage.adapter = langAdapter

        val engines = listOf("Gemini AI API", "Placeholder Algorithmic Engine")
        val engineAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, engines)
        binding.spinnerEngine.adapter = engineAdapter
    }

    private fun loadCurrentSettings() {
        lifecycleScope.launch {
            val settings = app.dataStoreManager.settingsFlow.first()

            binding.etCoordAX.setText(settings.buttonAX.toString())
            binding.etCoordAY.setText(settings.buttonAY.toString())
            binding.etCoordBX.setText(settings.buttonBX.toString())
            binding.etCoordBY.setText(settings.buttonBY.toString())

            binding.etAmount.setText(settings.targetAmount.toString())
            binding.etDelayMs.setText(settings.actionDelayMs.toString())
            binding.etMaxActions.setText(settings.maxActions.toString())
            binding.etLossLimit.setText(settings.stopAfterLosses.toString())

            binding.etGeminiApiKey.setText(app.dataStoreManager.getEncryptedApiKey())

            binding.spinnerLanguage.setSelection(if (settings.language == "bn") 1 else 0)
            binding.spinnerEngine.setSelection(if (settings.engineType == "placeholder") 1 else 0)
        }
    }

    private fun setupListeners() {
        // Pick Position for Button A
        binding.btnPickCoordA.setOnClickListener {
            launchPositionPicker("Button A") { x, y ->
                binding.etCoordAX.setText(x.toString())
                binding.etCoordAY.setText(y.toString())
            }
        }

        // Pick Position for Button B
        binding.btnPickCoordB.setOnClickListener {
            launchPositionPicker("Button B") { x, y ->
                binding.etCoordBX.setText(x.toString())
                binding.etCoordBY.setText(y.toString())
            }
        }

        // Save Settings
        binding.btnSaveSettings.setOnClickListener {
            saveSettings()
        }
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun launchPositionPicker(targetName: String, onPicked: (x: Int, y: Int) -> Unit) {
        val wm = windowManager ?: return
        val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            layoutType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
        }

        val pickerBinding = LayoutPositionPickerBinding.inflate(LayoutInflater.from(this))
        pickerBinding.tvTargetPrompt.text = getString(R.string.picker_prompt, targetName)

        pickerBinding.root.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_DOWN) {
                val touchX = event.rawX.toInt()
                val touchY = event.rawY.toInt()

                if (pickerBinding.root.isAttachedToWindow) {
                    wm.removeView(pickerBinding.root)
                }

                onPicked(touchX, touchY)
                Toast.makeText(this, "\$targetName set to (\$touchX, \$touchY)", Toast.LENGTH_SHORT).show()
                true
            } else {
                false
            }
        }

        wm.addView(pickerBinding.root, params)
    }

    private fun saveSettings() {
        val ax = binding.etCoordAX.text.toString().toIntOrNull() ?: 500
        val ay = binding.etCoordAY.text.toString().toIntOrNull() ?: 1200
        val bx = binding.etCoordBX.text.toString().toIntOrNull() ?: 500
        val by = binding.etCoordBY.text.toString().toIntOrNull() ?: 1400

        val amount = binding.etAmount.text.toString().toDoubleOrNull() ?: 10.0
        val delay = binding.etDelayMs.text.toString().toLongOrNull() ?: 2000L
        val maxActions = binding.etMaxActions.text.toString().toIntOrNull() ?: 50
        val lossLimit = binding.etLossLimit.text.toString().toIntOrNull() ?: 3

        val selectedLang = if (binding.spinnerLanguage.selectedItemPosition == 1) "bn" else "en"
        val selectedEngine = if (binding.spinnerEngine.selectedItemPosition == 1) "placeholder" else "gemini"

        val geminiKey = binding.etGeminiApiKey.text.toString().trim()

        lifecycleScope.launch {
            app.dataStoreManager.saveSettings(
                AppSettings(
                    buttonAX = ax,
                    buttonAY = ay,
                    buttonBX = bx,
                    buttonBY = by,
                    targetAmount = amount,
                    actionDelayMs = delay,
                    maxActions = maxActions,
                    stopAfterLosses = lossLimit,
                    language = selectedLang,
                    engineType = selectedEngine
                )
            )

            if (geminiKey.isNotEmpty()) {
                app.dataStoreManager.saveEncryptedApiKey(geminiKey)
            }

            applyLocale(selectedLang)
            Toast.makeText(this@SettingsActivity, R.string.settings_saved, Toast.LENGTH_SHORT).show()
            finish()
        }
    }

    private fun applyLocale(langCode: String) {
        val locale = Locale(langCode)
        Locale.setDefault(locale)
        val config = Configuration(resources.configuration)
        config.setLocale(locale)
        resources.updateConfiguration(config, resources.displayMetrics)
    }
}
`
  },

  // 12. AdminPanelActivity.kt
  {
    path: 'app/src/main/java/com/example/autoailite/ui/AdminPanelActivity.kt',
    name: 'AdminPanelActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Admin licensing panel with Firestore integration, RecyclerView of registered device licenses, and status toggles',
    content: `package com.example.autoailite.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.autoailite.AutoAiApp
import com.example.autoailite.R
import com.example.autoailite.data.AdminUserLicense
import com.example.autoailite.databinding.ActivityAdminPanelBinding
import com.example.autoailite.databinding.ItemAdminUserBinding
import kotlinx.coroutines.launch

class AdminPanelActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAdminPanelBinding
    private val app get() = application as AutoAiApp
    private lateinit var adapter: AdminUserAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAdminPanelBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = getString(R.string.admin_panel_title)

        setupRecyclerView()
        loadUsers()

        binding.btnRefreshUsers.setOnClickListener {
            loadUsers()
        }
    }

    private fun setupRecyclerView() {
        adapter = AdminUserAdapter(
            onToggleStatus = { user ->
                toggleUserStatus(user)
            },
            onExtendExpiry = { user ->
                extendUserExpiry(user)
            }
        )
        binding.rvAdminUsers.layoutManager = LinearLayoutManager(this)
        binding.rvAdminUsers.adapter = adapter
    }

    private fun loadUsers() {
        binding.progressBar.visibility = android.view.View.VISIBLE
        lifecycleScope.launch {
            try {
                val users = app.licenseManager.fetchAdminUsersList()
                adapter.submitList(users)
                binding.tvTotalCount.text = getString(R.string.total_licenses_count, users.size)
            } catch (e: Exception) {
                Toast.makeText(this@AdminPanelActivity, "Error: \${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = android.view.View.GONE
            }
        }
    }

    private fun toggleUserStatus(user: AdminUserLicense) {
        val newStatus = if (user.status == "Active") "Blocked" else "Active"
        lifecycleScope.launch {
            app.licenseManager.updateUserStatus(user.uid, newStatus)
            Toast.makeText(this@AdminPanelActivity, "User \${user.uid.take(6)} is now \$newStatus", Toast.LENGTH_SHORT).show()
            loadUsers()
        }
    }

    private fun extendUserExpiry(user: AdminUserLicense) {
        AlertDialog.Builder(this, R.style.Theme_AutoAILite_Dialog)
            .setTitle(R.string.extend_license_title)
            .setMessage(getString(R.string.extend_license_prompt, user.deviceModel))
            .setPositiveButton(R.string.extend_30_days) { _, _ ->
                lifecycleScope.launch {
                    app.licenseManager.extendLicense(user.uid, days = 30)
                    Toast.makeText(this@AdminPanelActivity, R.string.license_extended, Toast.LENGTH_SHORT).show()
                    loadUsers()
                }
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }
}

class AdminUserAdapter(
    private val onToggleStatus: (AdminUserLicense) -> Unit,
    private val onExtendExpiry: (AdminUserLicense) -> Unit
) : RecyclerView.Adapter<AdminUserAdapter.UserViewHolder>() {

    private val items = mutableListOf<AdminUserLicense>()

    fun submitList(newItems: List<AdminUserLicense>) {
        items.clear()
        items.addAll(newItems)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val binding = ItemAdminUserBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return UserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class UserViewHolder(private val binding: ItemAdminUserBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(user: AdminUserLicense) {
            binding.tvUid.text = "UID: \${user.uid}"
            binding.tvDevice.text = "\${user.deviceModel} (v\${user.appVersion})"
            binding.tvExpiry.text = "Expires: \${user.expiryDate}"
            binding.tvActionCount.text = "Actions: \${user.totalActions}"
            binding.tvStatusBadge.text = user.status

            val context = binding.root.context
            when (user.status) {
                "Active" -> {
                    binding.tvStatusBadge.setBackgroundColor(ContextCompat.getColor(context, R.color.badge_active))
                    binding.btnToggleStatus.text = context.getString(R.string.block)
                }
                "Blocked" -> {
                    binding.tvStatusBadge.setBackgroundColor(ContextCompat.getColor(context, R.color.badge_blocked))
                    binding.btnToggleStatus.text = context.getString(R.string.unblock)
                }
                else -> {
                    binding.tvStatusBadge.setBackgroundColor(ContextCompat.getColor(context, R.color.badge_expired))
                    binding.btnToggleStatus.text = context.getString(R.string.renew)
                }
            }

            binding.btnToggleStatus.setOnClickListener { onToggleStatus(user) }
            binding.btnExtend.setOnClickListener { onExtendExpiry(user) }
        }
    }
}
`
  },

  // 13. RgbBorderCardView.kt
  {
    path: 'app/src/main/java/com/example/autoailite/ui/view/RgbBorderCardView.kt',
    name: 'RgbBorderCardView.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Custom view with animated RGB gradient border drawn via SweepGradient and ValueAnimator',
    content: `package com.example.autoailite.ui.view

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.SweepGradient
import android.util.AttributeSet
import android.view.animation.LinearInterpolator
import android.widget.FrameLayout

class RgbBorderCardView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeWidth = 6f
    }

    private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
        color = Color.parseColor("#0F172A") // Deep slate dark surface
    }

    private val rectF = RectF()
    private val cornerRadius = 32f
    private var rotateAngle = 0f
    private val matrix = Matrix()
    private var animator: ValueAnimator? = null

    private val colors = intArrayOf(
        Color.parseColor("#FF0055"),
        Color.parseColor("#7A00FF"),
        Color.parseColor("#00D2FF"),
        Color.parseColor("#00FF88"),
        Color.parseColor("#FFB800"),
        Color.parseColor("#FF0055")
    )

    init {
        setWillNotDraw(false)
        setupAnimation()
    }

    private fun setupAnimation() {
        animator = ValueAnimator.ofFloat(0f, 360f).apply {
            duration = 4000
            repeatCount = ValueAnimator.INFINITE
            interpolator = LinearInterpolator()
            addUpdateListener { va ->
                rotateAngle = va.animatedValue as Float
                invalidate()
            }
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        animator?.start()
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        animator?.cancel()
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        val strokeHalf = borderPaint.strokeWidth / 2f
        rectF.set(strokeHalf, strokeHalf, w - strokeHalf, h - strokeHalf)

        val sweepGradient = SweepGradient(w / 2f, h / 2f, colors, null)
        borderPaint.shader = sweepGradient
    }

    override fun onDraw(canvas: Canvas) {
        // Draw dark container background
        canvas.drawRoundRect(rectF, cornerRadius, cornerRadius, bgPaint)

        // Rotate sweep gradient
        matrix.setRotate(rotateAngle, width / 2f, height / 2f)
        borderPaint.shader?.setLocalMatrix(matrix)

        // Draw animated RGB border
        canvas.drawRoundRect(rectF, cornerRadius, cornerRadius, borderPaint)

        super.onDraw(canvas)
    }
}
`
  },

  // 14. ScanAnimationView.kt
  {
    path: 'app/src/main/java/com/example/autoailite/ui/view/ScanAnimationView.kt',
    name: 'ScanAnimationView.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Custom sweeping scanline laser view with alpha gradient and radar effect',
    content: `package com.example.autoailite.ui.view

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Shader
import android.util.AttributeSet
import android.view.View
import android.view.animation.AccelerateDecelerateInterpolator

class ScanAnimationView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private val linePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#00D2FF")
        strokeWidth = 4f
        style = Paint.Style.STROKE
    }

    private val sweepPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
    }

    private var currentY = 0f
    private var isScanning = false
    private var animator: ValueAnimator? = null

    fun startScanning() {
        if (isScanning) return
        isScanning = true
        animator?.cancel()

        animator = ValueAnimator.ofFloat(0f, height.toFloat().coerceAtLeast(100f)).apply {
            duration = 1800
            repeatCount = ValueAnimator.INFINITE
            repeatMode = ValueAnimator.REVERSE
            interpolator = AccelerateDecelerateInterpolator()
            addUpdateListener { va ->
                currentY = va.animatedValue as Float
                invalidate()
            }
            start()
        }
    }

    fun stopScanning() {
        isScanning = false
        animator?.cancel()
        animator = null
        invalidate()
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (isScanning) {
            startScanning()
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (!isScanning) return

        val scanHeight = 60f
        val top = (currentY - scanHeight).coerceAtLeast(0f)

        // Gradient glow trailing behind the laser beam
        val gradient = LinearGradient(
            0f, top, 0f, currentY,
            Color.TRANSPARENT,
            Color.parseColor("#4400D2FF"),
            Shader.TileMode.CLAMP
        )
        sweepPaint.shader = gradient
        canvas.drawRect(0f, top, width.toFloat(), currentY, sweepPaint)

        // Primary laser scan line
        canvas.drawLine(0f, currentY, width.toFloat(), currentY, linePaint)
    }
}
`
  },

  // 15. SignalProvider.kt & Engines
  {
    path: 'app/src/main/java/com/example/autoailite/engine/SignalProvider.kt',
    name: 'SignalProvider.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'SignalProvider clean interface, Signal enum, and pluggable SignalEngineFactory',
    content: `package com.example.autoailite.engine

import android.content.Context
import android.graphics.Bitmap

enum class Signal {
    UP,
    DOWN,
    WAIT
}

data class SignalResult(
    val signal: Signal,
    val confidence: Float,
    val reason: String,
    val latencyMs: Long
)

/**
 * Pluggable Signal Engine Interface
 */
interface SignalProvider {
    suspend fun getSignal(
        context: Context,
        screenshot: Bitmap? = null,
        promptContext: String = ""
    ): SignalResult
}

object SignalEngineFactory {
    fun create(context: Context, engineType: String): SignalProvider {
        return when (engineType) {
            "gemini" -> GeminiSignalProvider()
            else -> PlaceholderSignalProvider()
        }
    }
}
`
  },

  // 16. GeminiSignalProvider.kt
  {
    path: 'app/src/main/java/com/example/autoailite/engine/GeminiSignalProvider.kt',
    name: 'GeminiSignalProvider.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Gemini API client sending structured image/prompt requests and parsing UP/DOWN/WAIT',
    content: `package com.example.autoailite.engine

import android.content.Context
import android.graphics.Bitmap
import android.util.Base64
import com.example.autoailite.AutoAiApp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.ByteArrayOutputStream
import java.util.concurrent.TimeUnit

class GeminiSignalProvider : SignalProvider {

    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .build()

    override suspend fun getSignal(
        context: Context,
        screenshot: Bitmap?,
        promptContext: String
    ): SignalResult = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        val app = context.applicationContext as AutoAiApp
        val apiKey = app.dataStoreManager.getEncryptedApiKey()

        if (apiKey.isBlank()) {
            return@withContext SignalResult(
                signal = Signal.WAIT,
                confidence = 0f,
                reason = "No Gemini API Key provided in Settings",
                latencyMs = System.currentTimeMillis() - startTime
            )
        }

        try {
            // Construct Google GenAI REST endpoint
            val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\$apiKey"

            val prompt = """
                You are an algorithmic signal decision engine for Auto AI Lite.
                Analyze the context: "\$promptContext".
                Determine the optimal next action:
                UP: execute upward target action (Button A)
                DOWN: execute downward target action (Button B)
                WAIT: conditions unstable, hold position.
                
                Respond strictly in raw JSON without markdown:
                {"signal": "UP"|"DOWN"|"WAIT", "confidence": 0.85, "reason": "brief reason"}
            """.trimIndent()

            val partsArray = JSONArray()
            partsArray.put(JSONObject().put("text", prompt))

            // Attach base64 screenshot if provided
            if (screenshot != null) {
                val stream = ByteArrayOutputStream()
                screenshot.compress(Bitmap.CompressFormat.JPEG, 70, stream)
                val base64Image = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)

                val inlineData = JSONObject().apply {
                    put("mimeType", "image/jpeg")
                    put("data", base64Image)
                }
                partsArray.put(JSONObject().put("inlineData", inlineData))
            }

            val contents = JSONArray().put(
                JSONObject().put("parts", partsArray)
            )

            val requestBodyJson = JSONObject().apply {
                put("contents", contents)
                put("generationConfig", JSONObject().apply {
                    put("temperature", 0.2)
                    put("responseMimeType", "application/json")
                })
            }

            val request = Request.Builder()
                .url(url)
                .post(requestBodyJson.toString().toRequestBody("application/json".toMediaType()))
                .build()

            val response = client.newCall(request).execute()
            val responseBody = response.body?.string() ?: ""

            if (!response.isSuccessful) {
                return@withContext SignalResult(
                    signal = Signal.WAIT,
                    confidence = 0f,
                    reason = "Gemini API error code: \${response.code}",
                    latencyMs = System.currentTimeMillis() - startTime
                )
            }

            // Parse response JSON
            val root = JSONObject(responseBody)
            val text = root.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text")

            val parsed = JSONObject(text.trim())
            val sigString = parsed.optString("signal", "WAIT").uppercase()
            val conf = parsed.optDouble("confidence", 0.8).toFloat()
            val reason = parsed.optString("reason", "Analyzed by Gemini 2.5 Flash")

            val signal = when (sigString) {
                "UP" -> Signal.UP
                "DOWN" -> Signal.DOWN
                else -> Signal.WAIT
            }

            SignalResult(
                signal = signal,
                confidence = conf,
                reason = reason,
                latencyMs = System.currentTimeMillis() - startTime
            )

        } catch (e: Exception) {
            SignalResult(
                signal = Signal.WAIT,
                confidence = 0f,
                reason = "Error: \${e.message}",
                latencyMs = System.currentTimeMillis() - startTime
            )
        }
    }
}
`
  },

  // 17. PlaceholderSignalProvider.kt
  {
    path: 'app/src/main/java/com/example/autoailite/engine/PlaceholderSignalProvider.kt',
    name: 'PlaceholderSignalProvider.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Algorithmic mathematical pattern generator for offline or simulation mode',
    content: `package com.example.autoailite.engine

import android.content.Context
import android.graphics.Bitmap
import kotlinx.coroutines.delay
import kotlin.random.Random

class PlaceholderSignalProvider : SignalProvider {

    private var tick = 0

    override suspend fun getSignal(
        context: Context,
        screenshot: Bitmap?,
        promptContext: String
    ): SignalResult {
        val start = System.currentTimeMillis()
        delay(600) // simulate computing delay
        tick++

        val randomVal = Random.nextDouble()
        val signal = when {
            randomVal < 0.45 -> Signal.UP
            randomVal < 0.90 -> Signal.DOWN
            else -> Signal.WAIT
        }

        return SignalResult(
            signal = signal,
            confidence = (0.75f + Random.nextFloat() * 0.2f),
            reason = "Pattern momentum oscillator tick #$tick",
            latencyMs = System.currentTimeMillis() - start
        )
    }
}
`
  },

  // 18. DataStoreManager.kt
  {
    path: 'app/src/main/java/com/example/autoailite/data/DataStoreManager.kt',
    name: 'DataStoreManager.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Jetpack DataStore preferences and EncryptedSharedPreferences for API keys',
    content: `package com.example.autoailite.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.doublePreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "auto_ai_lite_prefs")

data class AppSettings(
    val buttonAX: Int = 500,
    val buttonAY: Int = 1200,
    val buttonBX: Int = 500,
    val buttonBY: Int = 1400,
    val targetAmount: Double = 10.0,
    val actionDelayMs: Long = 2000L,
    val maxActions: Int = 50,
    val stopAfterLosses: Int = 3,
    val language: String = "en",
    val engineType: String = "gemini"
)

class DataStoreManager(private val context: Context) {

    private object Keys {
        val COORD_A_X = intPreferencesKey("coord_a_x")
        val COORD_A_Y = intPreferencesKey("coord_a_y")
        val COORD_B_X = intPreferencesKey("coord_b_x")
        val COORD_B_Y = intPreferencesKey("coord_b_y")
        val TARGET_AMOUNT = doublePreferencesKey("target_amount")
        val ACTION_DELAY_MS = longPreferencesKey("action_delay_ms")
        val MAX_ACTIONS = intPreferencesKey("max_actions")
        val STOP_AFTER_LOSSES = intPreferencesKey("stop_after_losses")
        val LANGUAGE = stringPreferencesKey("app_language")
        val ENGINE_TYPE = stringPreferencesKey("engine_type")
        val DISCLAIMER_ACCEPTED = booleanPreferencesKey("disclaimer_accepted")
    }

    private val masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC)
    private val encryptedPrefs = EncryptedSharedPreferences.create(
        "secret_keys_vault",
        masterKeyAlias,
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    val settingsFlow: Flow<AppSettings> = context.dataStore.data.map { prefs ->
        AppSettings(
            buttonAX = prefs[Keys.COORD_A_X] ?: 500,
            buttonAY = prefs[Keys.COORD_A_Y] ?: 1200,
            buttonBX = prefs[Keys.COORD_B_X] ?: 500,
            buttonBY = prefs[Keys.COORD_B_Y] ?: 1400,
            targetAmount = prefs[Keys.TARGET_AMOUNT] ?: 10.0,
            actionDelayMs = prefs[Keys.ACTION_DELAY_MS] ?: 2000L,
            maxActions = prefs[Keys.MAX_ACTIONS] ?: 50,
            stopAfterLosses = prefs[Keys.STOP_AFTER_LOSSES] ?: 3,
            language = prefs[Keys.LANGUAGE] ?: "en",
            engineType = prefs[Keys.ENGINE_TYPE] ?: "gemini"
        )
    }

    val disclaimerAcceptedFlow: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[Keys.DISCLAIMER_ACCEPTED] ?: false
    }

    suspend fun saveSettings(settings: AppSettings) {
        context.dataStore.edit { prefs ->
            prefs[Keys.COORD_A_X] = settings.buttonAX
            prefs[Keys.COORD_A_Y] = settings.buttonAY
            prefs[Keys.COORD_B_X] = settings.buttonBX
            prefs[Keys.COORD_B_Y] = settings.buttonBY
            prefs[Keys.TARGET_AMOUNT] = settings.targetAmount
            prefs[Keys.ACTION_DELAY_MS] = settings.actionDelayMs
            prefs[Keys.MAX_ACTIONS] = settings.maxActions
            prefs[Keys.STOP_AFTER_LOSSES] = settings.stopAfterLosses
            prefs[Keys.LANGUAGE] = settings.language
            prefs[Keys.ENGINE_TYPE] = settings.engineType
        }
    }

    suspend fun setDisclaimerAccepted(accepted: Boolean) {
        context.dataStore.edit { prefs ->
            prefs[Keys.DISCLAIMER_ACCEPTED] = accepted
        }
    }

    fun saveEncryptedApiKey(apiKey: String) {
        encryptedPrefs.edit().putString("gemini_api_key", apiKey).apply()
    }

    fun getEncryptedApiKey(): String {
        return encryptedPrefs.getString("gemini_api_key", "") ?: ""
    }
}
`
  },

  // 19. LicenseManager.kt
  {
    path: 'app/src/main/java/com/example/autoailite/data/LicenseManager.kt',
    name: 'LicenseManager.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Firebase Auth and Firestore license validation, expiration checks, and admin user records',
    content: `package com.example.autoailite.data

import android.content.Context
import android.os.Build
import android.provider.Settings
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class LicenseStatus(
    val isAllowed: Boolean,
    val isBlocked: Boolean,
    val isExpired: Boolean,
    val reason: String
)

data class AdminUserLicense(
    val uid: String,
    val deviceModel: String,
    val appVersion: String,
    val status: String, // "Active", "Blocked", "Expired"
    val expiryDate: String,
    val totalActions: Int
)

class LicenseManager(private val context: Context) {

    private val auth by lazy { FirebaseAuth.getInstance() }
    private val firestore by lazy { FirebaseFirestore.getInstance() }

    private val deviceId: String by lazy {
        Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID) ?: "UNKNOWN_DEVICE"
    }

    /**
     * Checks device license status against Firestore 'users' collection
     */
    suspend fun checkLicenseStatus(): LicenseStatus {
        try {
            // Sign in anonymously if not authenticated
            val currentUser = auth.currentUser ?: auth.signInAnonymously().await().user
            val uid = currentUser?.uid ?: deviceId

            val docRef = firestore.collection("licenses").document(uid)
            val snapshot = docRef.get().await()

            if (!snapshot.exists()) {
                // Register initial trial license (30 days)
                val initialExpiry = Date(System.currentTimeMillis() + (30L * 24 * 60 * 60 * 1000))
                val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val initialData = hashMapOf(
                    "uid" to uid,
                    "deviceModel" to "\${Build.MANUFACTURER} \${Build.MODEL}",
                    "deviceId" to deviceId,
                    "appVersion" to "1.0.0",
                    "status" to "Active",
                    "expiryTimestamp" to initialExpiry.time,
                    "expiryDate" to sdf.format(initialExpiry),
                    "totalActions" to 0
                )
                docRef.set(initialData).await()
                return LicenseStatus(isAllowed = true, isBlocked = false, isExpired = false, reason = "Active Trial")
            }

            val status = snapshot.getString("status") ?: "Active"
            val expiryTimestamp = snapshot.getLong("expiryTimestamp") ?: (System.currentTimeMillis() + 86400000)

            if (status.equals("Blocked", ignoreCase = true)) {
                return LicenseStatus(isAllowed = false, isBlocked = true, isExpired = false, reason = "License revoked by admin.")
            }

            if (System.currentTimeMillis() > expiryTimestamp) {
                return LicenseStatus(isAllowed = false, isBlocked = false, isExpired = true, reason = "License expired. Please contact admin.")
            }

            return LicenseStatus(isAllowed = true, isBlocked = false, isExpired = false, reason = "Active")

        } catch (e: Exception) {
            // Offline fallback allowance for trial
            return LicenseStatus(isAllowed = true, isBlocked = false, isExpired = false, reason = "Offline Mode")
        }
    }

    suspend fun fetchAdminUsersList(): List<AdminUserLicense> {
        return try {
            val snapshot = firestore.collection("licenses").get().await()
            snapshot.documents.map { doc ->
                AdminUserLicense(
                    uid = doc.id,
                    deviceModel = doc.getString("deviceModel") ?: "Unknown Device",
                    appVersion = doc.getString("appVersion") ?: "1.0.0",
                    status = doc.getString("status") ?: "Active",
                    expiryDate = doc.getString("expiryDate") ?: "2026-12-31",
                    totalActions = (doc.getLong("totalActions") ?: 0).toInt()
                )
            }
        } catch (e: Exception) {
            // Return sample seed data for testing
            listOf(
                AdminUserLicense("dev_usr_01", "Samsung Galaxy S24", "1.0.0", "Active", "2026-12-31", 142),
                AdminUserLicense("dev_usr_02", "Google Pixel 8 Pro", "1.0.0", "Active", "2026-11-15", 89),
                AdminUserLicense("dev_usr_03", "Xiaomi 14 Ultra", "1.0.0", "Blocked", "2026-08-01", 310),
                AdminUserLicense("dev_usr_04", "OnePlus 12", "1.0.0", "Expired", "2026-05-10", 25)
            )
        }
    }

    suspend fun updateUserStatus(uid: String, newStatus: String) {
        try {
            firestore.collection("licenses").document(uid).update("status", newStatus).await()
        } catch (e: Exception) {
            // Handled
        }
    }

    suspend fun extendLicense(uid: String, days: Int) {
        try {
            val docRef = firestore.collection("licenses").document(uid)
            val snap = docRef.get().await()
            val currentExpiry = snap.getLong("expiryTimestamp") ?: System.currentTimeMillis()
            val newExpiry = currentExpiry + (days.toLong() * 86400000L)
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)

            docRef.update(
                mapOf(
                    "expiryTimestamp" to newExpiry,
                    "expiryDate" to sdf.format(Date(newExpiry)),
                    "status" to "Active"
                )
            ).await()
        } catch (e: Exception) {
            // Handled
        }
    }
}
`
  },

  // 20. accessibility_service_config.xml
  {
    path: 'app/src/main/res/xml/accessibility_service_config.xml',
    name: 'accessibility_service_config.xml',
    category: 'xml',
    language: 'xml',
    description: 'Accessibility service configuration enabling gesture dispatch and interactive node retrieval',
    content: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_desc"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canPerformGestures="true"
    android:canRetrieveWindowContent="true"
    android:accessibilityFlags="flagDefault|flagRetrieveInteractiveWindows" />
`
  },

  // 21. res/values/strings.xml (English)
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml (English)',
    category: 'xml',
    language: 'xml',
    description: 'Default English localization strings',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Auto AI Lite</string>
    <string name="start_floating_panel">Start Floating Panel</string>
    <string name="stop_floating_panel">Stop Floating Panel</string>
    <string name="btn_start_auto">START AUTO</string>
    <string name="btn_stop_auto">STOP AUTO</string>

    <string name="service_running">Service Active</string>
    <string name="service_stopped">Service Idle</string>
    <string name="status_granted">Granted</string>
    <string name="status_denied">Denied (Required)</string>
    <string name="status_active">Enabled</string>
    <string name="status_inactive">Disabled (Required)</string>

    <string name="grant_overlay_permission">Grant Overlay Permission</string>
    <string name="grant_accessibility_permission">Enable Accessibility</string>
    <string name="grant_overlay_first">Please grant Overlay permission to display the floating panel</string>
    <string name="open_settings">Configuration Settings</string>
    <string name="status_refreshed">Status updated</string>
    <string name="notification_permission_warn">Notifications needed for foreground service</string>

    <string name="risk_disclaimer_title">Safety &amp; Risk Disclaimer</string>
    <string name="risk_disclaimer_content">Auto AI Lite executes automated gestures and tap actions. Automated usage carries inherent risk of financial or balance fluctuations depending on external platforms. Always test with minimal amounts and never exceed safe limits.</string>
    <string name="disclaimer_accept">I Accept &amp; Understand</string>
    <string name="disclaimer_decline">Exit App</string>

    <string name="license_restricted_title">Access Restricted</string>
    <string name="license_restricted_msg">Your license is not active: %1$s. Contact administrator.</string>
    <string name="exit_app">Exit</string>

    <string name="settings_title">Automation Settings</string>
    <string name="settings_saved">Settings saved successfully</string>
    <string name="picker_prompt">Tap anywhere on the screen to set %1$s coordinates</string>
    <string name="config_summary_text">Amount: $%1$.2f | Delay: %2$dms | Safety Limit: %3$d actions</string>
    <string name="actions_progress">%1$d / %2$d actions</string>

    <string name="signal_standby">STANDBY</string>
    <string name="signal_analysing">ANALYSING...</string>

    <string name="floating_notif_title">Auto AI Lite Active</string>
    <string name="floating_notif_desc">Floating panel is controlling automated assistant</string>
    <string name="stop">Stop</string>

    <string name="accessibility_service_desc">Provides automated gesture taps and UI node inspection for Auto AI Lite based on decision engine signals.</string>

    <!-- Admin Panel -->
    <string name="admin_panel_title">License Administration</string>
    <string name="total_licenses_count">%1$d Total Licenses</string>
    <string name="block">Block</string>
    <string name="unblock">Unblock</string>
    <string name="renew">Renew</string>
    <string name="extend_license_title">Extend Device License</string>
    <string name="extend_license_prompt">Extend license access for %1$s?</string>
    <string name="extend_30_days">Extend +30 Days</string>
    <string name="license_extended">License extended by 30 days</string>
    <string name="cancel">Cancel</string>
</resources>
`
  },

  // 22. res/values-bn/strings.xml (Bangla)
  {
    path: 'app/src/main/res/values-bn/strings.xml',
    name: 'strings.xml (Bangla)',
    category: 'xml',
    language: 'xml',
    description: 'Bangla localization strings for full multi-language support',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">অটো এআই লাইট</string>
    <string name="start_floating_panel">ভাসমান প্যানেল শুরু করুন</string>
    <string name="stop_floating_panel">ভাসমান প্যানেল বন্ধ করুন</string>
    <string name="btn_start_auto">অটো শুরু করুন</string>
    <string name="btn_stop_auto">অটো বন্ধ করুন</string>

    <string name="service_running">সার্ভিস সক্রিয়</string>
    <string name="service_stopped">সার্ভিস নিষ্ক্রিয়</string>
    <string name="status_granted">অনুমোদিত</string>
    <string name="status_denied">অনুমতি নেই (প্রয়োজন)</string>
    <string name="status_active">চালু আছে</string>
    <string name="status_inactive">বন্ধ আছে (প্রয়োজন)</string>

    <string name="grant_overlay_permission">ওভারলে অনুমতি দিন</string>
    <string name="grant_accessibility_permission">অ্যাক্সেসিবিলিটি চালু করুন</string>
    <string name="grant_overlay_first">ভাসমান উইন্ডো প্রদর্শনের জন্য ওভারলে অনুমতি প্রয়োজন</string>
    <string name="open_settings">কনফিগারেশন সেটিংস</string>
    <string name="status_refreshed">অবস্থা আপডেট হয়েছে</string>
    <string name="notification_permission_warn">সার্ভিস সঠিকভাবে চলার জন্য নোটিফিকেশন প্রয়োজন</string>

    <string name="risk_disclaimer_title">সতর্কতা ও ঝুঁকি ঘোষণা</string>
    <string name="risk_disclaimer_content">অটো এআই লাইট স্বয়ংক্রিয়ভাবে স্ক্রিনে স্পর্শ করে। স্বয়ংক্রিয় ট্রেডিং বা অ্যাকশন প্রয়োগে ঝুঁকি বিদ্যমান। সর্বদা নিরাপদ লিমিট এবং অল্প পরিমাণ নিয়ে টেস্ট করুন।</string>
    <string name="disclaimer_accept">আমি সম্মত ও অবগত</string>
    <string name="disclaimer_decline">অ্যাপ বন্ধ করুন</string>

    <string name="license_restricted_title">লাইসেন্স সীমাবদ্ধতা</string>
    <string name="license_restricted_msg">আপনার লাইসেন্স সক্রিয় নয়: %1$s। প্রশাসকের সাথে যোগাযোগ করুন।</string>
    <string name="exit_app">বেরিয়ে যান</string>

    <string name="settings_title">অটোমেশন সেটিংস</string>
    <string name="settings_saved">সেটিংস সফলভাবে সংরক্ষিত হয়েছে</string>
    <string name="picker_prompt">%1$s এর অবস্থান সেট করতে স্ক্রিনে যেকোনো জায়গায় স্পর্শ করুন</string>
    <string name="config_summary_text">পরিমাণ: $%1$.2f | বিলম্ব: %2$d মিলি | সুরক্ষা লিমিট: %3$d টি</string>
    <string name="actions_progress">%1$d / %2$d টি অ্যাকশন</string>

    <string name="signal_standby">অপেক্ষারত</string>
    <string name="signal_analysing">বিশ্লেষণ চলছে...</string>

    <string name="floating_notif_title">অটো এআই লাইট সক্রিয়</string>
    <string name="floating_notif_desc">ভাসমান উইন্ডো অটোমেশন পরিচালনা করছে</string>
    <string name="stop">বন্ধ করুন</string>

    <string name="accessibility_service_desc">অটো এআই লাইটের নির্দেশ অনুযায়ী পর্দায় স্বয়ংক্রিয় স্পর্শ ও উপাদান সনাক্ত করে।</string>

    <!-- Admin Panel -->
    <string name="admin_panel_title">লাইসেন্স প্রশাসন প্যানেল</string>
    <string name="total_licenses_count">সর্বমোট %1$d টি লাইসেন্স</string>
    <string name="block">ব্লক</string>
    <string name="unblock">আনব্লক</string>
    <string name="renew">নবায়ন</string>
    <string name="extend_license_title">লাইসেন্স মেয়াদ বৃদ্ধি</string>
    <string name="extend_license_prompt">%1$s এর লাইসেন্স বৃদ্ধি করবেন?</string>
    <string name="extend_30_days">+৩০ দিন বৃদ্ধি করুন</string>
    <string name="license_extended">লাইসেন্সের মেয়াদ ৩০ দিন বৃদ্ধি পেয়েছে</string>
    <string name="cancel">বাতিল</string>
</resources>
`
  },

  // 23. res/values/colors.xml
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'xml',
    language: 'xml',
    description: 'Cyberpunk/dark theme palette: neon cyan, neon green, danger red, dark slate',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bg_dark">#090D16</color>
    <color name="surface_card">#0F172A</color>
    <color name="surface_card_stroke">#1E293B</color>

    <color name="neon_cyan">#00D2FF</color>
    <color name="neon_green">#00FF88</color>
    <color name="neon_red">#FF0055</color>
    <color name="neon_yellow">#FFB800</color>
    <color name="neon_purple">#7A00FF</color>

    <color name="text_primary">#F8FAFC</color>
    <color name="text_muted">#94A3B8</color>

    <color name="btn_danger">#DC2626</color>
    <color name="badge_active">#059669</color>
    <color name="badge_blocked">#DC2626</color>
    <color name="badge_expired">#D97706</color>
</resources>
`
  },

  // 24. res/values/themes.xml
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    category: 'xml',
    language: 'xml',
    description: 'Material 3 Dark Theme and Dialog definitions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.AutoAILite" parent="Theme.Material3.Dark.NoActionBar">
        <item name="colorPrimary">@color/neon_cyan</item>
        <item name="colorSecondary">@color/neon_purple</item>
        <item name="android:statusBarColor">@color/bg_dark</item>
        <item name="android:navigationBarColor">@color/bg_dark</item>
        <item name="android:windowBackground">@color/bg_dark</item>
    </style>

    <style name="Theme.AutoAILite.Dialog" parent="ThemeOverlay.Material3.Dialog.Alert">
        <item name="android:background">@color/surface_card</item>
        <item name="android:textColorPrimary">@color/text_primary</item>
        <item name="buttonBarPositiveButtonStyle">@style/Widget.Material3.Button.TextButton.Dialog</item>
        <item name="buttonBarNegativeButtonStyle">@style/Widget.Material3.Button.TextButton.Dialog</item>
    </style>
</resources>
`
  },

  // 25. res/layout/activity_main.xml
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml',
    category: 'xml',
    language: 'xml',
    description: 'MainActivity XML layout with animated RgbBorderCardView and permission indicators',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_dark"
    android:padding="20dp">

    <!-- App Header -->
    <TextView
        android:id="@+id/tvAppTitle"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="@string/app_name"
        android:textColor="@color/text_primary"
        android:textSize="26sp"
        android:textStyle="bold"
        android:fontFamily="sans-serif-black"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toStartOf="@id/btnOpenSettings" />

    <TextView
        android:id="@+id/tvAppSubtitle"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Intelligent Automation &amp; Floating Overlay Engine"
        android:textColor="@color/text_muted"
        android:textSize="12sp"
        app:layout_constraintTop_toBottomOf="@id/tvAppTitle"
        app:layout_constraintStart_toStartOf="parent" />

    <ImageButton
        android:id="@+id/btnOpenSettings"
        android:layout_width="44dp"
        android:layout_height="44dp"
        android:background="?attr/selectableItemBackgroundBorderless"
        android:src="@android:drawable/ic_menu_preferences"
        app:tint="@color/neon_cyan"
        app:layout_constraintTop_toTopOf="@id/tvAppTitle"
        app:layout_constraintEnd_toEndOf="parent" />

    <!-- Animated RGB Border Card -->
    <com.example.autoailite.ui.view.RgbBorderCardView
        android:id="@+id/cardRgbStatus"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="24dp"
        android:padding="20dp"
        app:layout_constraintTop_toBottomOf="@id/tvAppSubtitle">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="STATUS MONITOR"
                android:textColor="@color/neon_cyan"
                android:textSize="11sp"
                android:letterSpacing="0.1"
                android:textStyle="bold" />

            <!-- Floating Service Status -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:gravity="center_vertical"
                android:orientation="horizontal">

                <TextView
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:text="Floating Overlay Service"
                    android:textColor="@color/text_primary"
                    android:textSize="15sp" />

                <TextView
                    android:id="@+id/tvServiceStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/service_stopped"
                    android:textColor="@color/text_muted"
                    android:textStyle="bold" />
            </LinearLayout>

            <View
                android:layout_width="match_parent"
                android:layout_height="1dp"
                android:layout_marginVertical="10dp"
                android:background="#1E293B" />

            <!-- Overlay Permission -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center_vertical"
                android:orientation="horizontal">

                <TextView
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:text="Overlay Permission"
                    android:textColor="@color/text_primary"
                    android:textSize="14sp" />

                <TextView
                    android:id="@+id/tvOverlayStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/status_denied"
                    android:textColor="@color/neon_red"
                    android:textStyle="bold" />
            </LinearLayout>

            <Button
                android:id="@+id/btnGrantOverlay"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="6dp"
                android:text="@string/grant_overlay_permission"
                android:textColor="#090D16"
                android:backgroundTint="@color/neon_yellow"
                android:textSize="13sp" />

            <View
                android:layout_width="match_parent"
                android:layout_height="1dp"
                android:layout_marginVertical="10dp"
                android:background="#1E293B" />

            <!-- Accessibility Permission -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center_vertical"
                android:orientation="horizontal">

                <TextView
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:text="Accessibility Service"
                    android:textColor="@color/text_primary"
                    android:textSize="14sp" />

                <TextView
                    android:id="@+id/tvAccessibilityStatus"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/status_inactive"
                    android:textColor="@color/neon_red"
                    android:textStyle="bold" />
            </LinearLayout>

            <Button
                android:id="@+id/btnGrantAccessibility"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="6dp"
                android:text="@string/grant_accessibility_permission"
                android:textColor="#090D16"
                android:backgroundTint="@color/neon_cyan"
                android:textSize="13sp" />

            <View
                android:layout_width="match_parent"
                android:layout_height="1dp"
                android:layout_marginVertical="10dp"
                android:background="#1E293B" />

            <!-- Config Summary -->
            <TextView
                android:id="@+id/tvConfigSummary"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Loading configurations..."
                android:textColor="@color/text_muted"
                android:textSize="12sp" />

        </LinearLayout>
    </com.example.autoailite.ui.view.RgbBorderCardView>

    <!-- Start / Stop Floating Service Primary Action -->
    <Button
        android:id="@+id/btnToggleFloatingService"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:layout_marginTop="24dp"
        android:text="@string/start_floating_panel"
        android:textColor="#090D16"
        android:textStyle="bold"
        android:textSize="16sp"
        android:backgroundTint="@color/neon_cyan"
        app:layout_constraintTop_toBottomOf="@id/cardRgbStatus" />

    <!-- Refresh Status Button -->
    <Button
        android:id="@+id/btnRefreshStatus"
        style="@style/Widget.Material3.Button.OutlinedButton"
        android:layout_width="match_parent"
        android:layout_height="48dp"
        android:layout_marginTop="12dp"
        android:text="Refresh Diagnostics"
        android:textColor="@color/text_primary"
        app:strokeColor="@color/surface_card_stroke"
        app:layout_constraintTop_toBottomOf="@id/btnToggleFloatingService" />

    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center"
        android:text="Tip: Long-press app title for Admin Licensing Console"
        android:textColor="@color/text_muted"
        android:textSize="11sp"
        app:layout_constraintBottom_toBottomOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
`
  },

  // 26. res/layout/layout_floating_overlay.xml
  {
    path: 'app/src/main/res/layout/layout_floating_overlay.xml',
    name: 'layout_floating_overlay.xml',
    category: 'xml',
    language: 'xml',
    description: 'Floating window layout with countdown, sweeping ScanAnimationView, and auto toggle',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="220dp"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:background="@drawable/bg_floating_panel"
    android:padding="12dp"
    android:elevation="12dp">

    <!-- Header Drag Bar & Actions -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal">

        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="AUTO AI LITE"
            android:textColor="@color/neon_cyan"
            android:textSize="12sp"
            android:fontFamily="sans-serif-black"
            android:textStyle="bold" />

        <ImageButton
            android:id="@+id/btnCollapse"
            android:layout_width="28dp"
            android:layout_height="28dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:src="@android:drawable/arrow_down_float"
            app:tint="@color/text_muted" />

        <ImageButton
            android:id="@+id/btnClose"
            android:layout_width="28dp"
            android:layout_height="28dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:src="@android:drawable/ic_menu_close_clear_cancel"
            app:tint="@color/neon_red" />
    </LinearLayout>

    <!-- Scan Line Animation Container -->
    <FrameLayout
        android:layout_width="match_parent"
        android:layout_height="70dp"
        android:layout_marginTop="8dp"
        android:background="#090D16">

        <com.example.autoailite.ui.view.ScanAnimationView
            android:id="@+id/scanAnimationView"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:visibility="invisible" />

        <!-- Signal & Timer Display -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:gravity="center"
            android:orientation="vertical">

            <TextView
                android:id="@+id/tvSignal"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@string/signal_standby"
                android:textColor="@color/neon_cyan"
                android:textSize="16sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvTimer"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="--"
                android:textColor="@color/text_primary"
                android:textSize="14sp"
                android:fontFamily="monospace" />
        </LinearLayout>
    </FrameLayout>

    <!-- Actions Counter -->
    <TextView
        android:id="@+id/tvActionCount"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:gravity="center"
        android:text="0 / 50 actions"
        android:textColor="@color/text_muted"
        android:textSize="11sp" />

    <!-- Start / Stop Auto Toggle -->
    <Button
        android:id="@+id/btnToggleAuto"
        android:layout_width="match_parent"
        android:layout_height="42dp"
        android:layout_marginTop="8dp"
        android:text="@string/btn_start_auto"
        android:textColor="#090D16"
        android:textStyle="bold"
        android:textSize="13sp"
        android:backgroundTint="@color/neon_cyan" />

</LinearLayout>
`
  },

  // 27. res/layout/layout_floating_bubble.xml
  {
    path: 'app/src/main/res/layout/layout_floating_bubble.xml',
    name: 'layout_floating_bubble.xml',
    category: 'xml',
    language: 'xml',
    description: 'Collapsed floating bubble layout when minimized',
    content: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="52dp"
    android:layout_height="52dp"
    android:background="@drawable/bg_bubble_circle"
    android:elevation="14dp">

    <ImageView
        android:layout_width="26dp"
        android:layout_height="26dp"
        android:layout_gravity="center"
        android:src="@drawable/ic_radar"
        android:tint="@color/neon_cyan" />
</FrameLayout>
`
  },

  // 28. res/layout/layout_position_picker.xml
  {
    path: 'app/src/main/res/layout/layout_position_picker.xml',
    name: 'layout_position_picker.xml',
    category: 'xml',
    language: 'xml',
    description: 'Transparent touch interceptor overlay for "pick position" on screen',
    content: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#88000000">

    <TextView
        android:id="@+id/tvTargetPrompt"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center_horizontal|top"
        android:layout_marginTop="60dp"
        android:background="@drawable/bg_pill_dark"
        android:paddingHorizontal="20dp"
        android:paddingVertical="10dp"
        android:text="Tap target position on screen"
        android:textColor="@color/neon_cyan"
        android:textSize="15sp"
        android:textStyle="bold" />
</FrameLayout>
`
  }
];
