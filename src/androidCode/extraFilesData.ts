import { AndroidFile } from './filesData';

export const ANDROID_EXTRA_FILES: AndroidFile[] = [
  // activity_settings.xml
  {
    path: 'app/src/main/res/layout/activity_settings.xml',
    name: 'activity_settings.xml',
    category: 'xml',
    language: 'xml',
    description: 'Settings screen layout with coordinate inputs, picker triggers, limits, API key, and language dropdown',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_dark">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/settings_title"
            android:textColor="@color/text_primary"
            android:textSize="22sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Configure gesture tap coordinates and automated safety limits"
            android:textColor="@color/text_muted"
            android:textSize="12sp"
            android:layout_marginBottom="20dp" />

        <!-- Target Button A Coordinates -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button A Target (UP Action)"
            android:textColor="@color/neon_cyan"
            android:textSize="14sp"
            android:textStyle="bold" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginTop="8dp">

            <EditText
                android:id="@+id/etCoordAX"
                android:layout_width="0dp"
                android:layout_height="48dp"
                android:layout_weight="1"
                android:hint="X (px)"
                android:inputType="number"
                android:textColor="@color/text_primary"
                android:textColorHint="@color/text_muted"
                android:background="@drawable/bg_pill_dark"
                android:paddingHorizontal="12dp"
                android:layout_marginEnd="8dp" />

            <EditText
                android:id="@+id/etCoordAY"
                android:layout_width="0dp"
                android:layout_height="48dp"
                android:layout_weight="1"
                android:hint="Y (px)"
                android:inputType="number"
                android:textColor="@color/text_primary"
                android:textColorHint="@color/text_muted"
                android:background="@drawable/bg_pill_dark"
                android:paddingHorizontal="12dp"
                android:layout_marginEnd="8dp" />

            <Button
                android:id="@+id/btnPickCoordA"
                android:layout_width="wrap_content"
                android:layout_height="48dp"
                android:text="Pick"
                android:textColor="#090D16"
                android:backgroundTint="@color/neon_cyan" />
        </LinearLayout>

        <!-- Target Button B Coordinates -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Button B Target (DOWN Action)"
            android:textColor="@color/neon_red"
            android:textSize="14sp"
            android:textStyle="bold"
            android:layout_marginTop="16dp" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:layout_marginTop="8dp">

            <EditText
                android:id="@+id/etCoordBX"
                android:layout_width="0dp"
                android:layout_height="48dp"
                android:layout_weight="1"
                android:hint="X (px)"
                android:inputType="number"
                android:textColor="@color/text_primary"
                android:textColorHint="@color/text_muted"
                android:background="@drawable/bg_pill_dark"
                android:paddingHorizontal="12dp"
                android:layout_marginEnd="8dp" />

            <EditText
                android:id="@+id/etCoordBY"
                android:layout_width="0dp"
                android:layout_height="48dp"
                android:layout_weight="1"
                android:hint="Y (px)"
                android:inputType="number"
                android:textColor="@color/text_primary"
                android:textColorHint="@color/text_muted"
                android:background="@drawable/bg_pill_dark"
                android:paddingHorizontal="12dp"
                android:layout_marginEnd="8dp" />

            <Button
                android:id="@+id/btnPickCoordB"
                android:layout_width="wrap_content"
                android:layout_height="48dp"
                android:text="Pick"
                android:textColor="#090D16"
                android:backgroundTint="@color/neon_red" />
        </LinearLayout>

        <!-- Automation Parameters -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Amount / Bet Size"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />

        <EditText
            android:id="@+id/etAmount"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="10.0"
            android:inputType="numberDecimal"
            android:textColor="@color/text_primary"
            android:textColorHint="@color/text_muted"
            android:background="@drawable/bg_pill_dark"
            android:paddingHorizontal="12dp"
            android:layout_marginTop="6dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Delay Between Actions (milliseconds)"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />

        <EditText
            android:id="@+id/etDelayMs"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="2000"
            android:inputType="number"
            android:textColor="@color/text_primary"
            android:textColorHint="@color/text_muted"
            android:background="@drawable/bg_pill_dark"
            android:paddingHorizontal="12dp"
            android:layout_marginTop="6dp" />

        <!-- Safety Limits -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Max Actions Per Session (Hard Safety Stop)"
            android:textColor="@color/neon_yellow"
            android:textSize="14sp"
            android:textStyle="bold"
            android:layout_marginTop="16dp" />

        <EditText
            android:id="@+id/etMaxActions"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="50"
            android:inputType="number"
            android:textColor="@color/text_primary"
            android:textColorHint="@color/text_muted"
            android:background="@drawable/bg_pill_dark"
            android:paddingHorizontal="12dp"
            android:layout_marginTop="6dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Stop-After-N-Losses Limit"
            android:textColor="@color/neon_yellow"
            android:textSize="14sp"
            android:textStyle="bold"
            android:layout_marginTop="16dp" />

        <EditText
            android:id="@+id/etLossLimit"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="3"
            android:inputType="number"
            android:textColor="@color/text_primary"
            android:textColorHint="@color/text_muted"
            android:background="@drawable/bg_pill_dark"
            android:paddingHorizontal="12dp"
            android:layout_marginTop="6dp" />

        <!-- Decision Engine Selection -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Decision Engine"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />

        <Spinner
            android:id="@+id/spinnerEngine"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:background="@drawable/bg_pill_dark"
            android:layout_marginTop="6dp" />

        <!-- Gemini API Key -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Gemini API Key (EncryptedSharedPreferences Vault)"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />

        <EditText
            android:id="@+id/etGeminiApiKey"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:hint="AIzaSy..."
            android:inputType="textPassword"
            android:textColor="@color/text_primary"
            android:textColorHint="@color/text_muted"
            android:background="@drawable/bg_pill_dark"
            android:paddingHorizontal="12dp"
            android:layout_marginTop="6dp" />

        <!-- Language Selector -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Language / ভাষা"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:layout_marginTop="16dp" />

        <Spinner
            android:id="@+id/spinnerLanguage"
            android:layout_width="match_parent"
            android:layout_height="48dp"
            android:background="@drawable/bg_pill_dark"
            android:layout_marginTop="6dp" />

        <!-- Save Button -->
        <Button
            android:id="@+id/btnSaveSettings"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:text="Save All Settings"
            android:textColor="#090D16"
            android:textStyle="bold"
            android:textSize="16sp"
            android:backgroundTint="@color/neon_green"
            android:layout_marginTop="28dp"
            android:layout_marginBottom="40dp" />

    </LinearLayout>
</ScrollView>
`
  },

  // activity_admin_panel.xml
  {
    path: 'app/src/main/res/layout/activity_admin_panel.xml',
    name: 'activity_admin_panel.xml',
    category: 'xml',
    language: 'xml',
    description: 'Admin licensing panel layout with RecyclerView, count indicators, and refresh button',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/bg_dark"
    android:padding="16dp">

    <!-- Top Admin Bar -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_vertical"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/tvTotalCount"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Loading licenses..."
            android:textColor="@color/neon_cyan"
            android:textSize="15sp"
            android:textStyle="bold" />

        <Button
            android:id="@+id/btnRefreshUsers"
            style="@style/Widget.Material3.Button.TextButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Refresh"
            android:textColor="@color/neon_cyan" />
    </LinearLayout>

    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:visibility="gone"
        android:layout_marginTop="20dp" />

    <!-- RecyclerView of User Licenses -->
    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvAdminUsers"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="12dp" />

</LinearLayout>
`
  },

  // item_admin_user.xml
  {
    path: 'app/src/main/res/layout/item_admin_user.xml',
    name: 'item_admin_user.xml',
    category: 'xml',
    language: 'xml',
    description: 'RecyclerView item card for device license records with status badge and actions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginVertical="6dp"
    app:cardBackgroundColor="@color/surface_card"
    app:cardCornerRadius="12dp"
    app:cardElevation="2dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="14dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center_vertical"
            android:orientation="horizontal">

            <TextView
                android:id="@+id/tvDevice"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="Samsung Galaxy S24 (v1.0.0)"
                android:textColor="@color/text_primary"
                android:textSize="15sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvStatusBadge"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Active"
                android:textColor="#FFFFFF"
                android:textSize="11sp"
                android:textStyle="bold"
                android:paddingHorizontal="8dp"
                android:paddingVertical="3dp"
                android:background="@drawable/bg_pill_dark" />
        </LinearLayout>

        <TextView
            android:id="@+id/tvUid"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="UID: usr_8723469123"
            android:textColor="@color/text_muted"
            android:textSize="12sp"
            android:fontFamily="monospace" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="6dp"
            android:orientation="horizontal">

            <TextView
                android:id="@+id/tvExpiry"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="Expires: 2026-12-31"
                android:textColor="@color/text_muted"
                android:textSize="12sp" />

            <TextView
                android:id="@+id/tvActionCount"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Actions: 142"
                android:textColor="@color/neon_cyan"
                android:textSize="12sp" />
        </LinearLayout>

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:gravity="end"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnExtend"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="wrap_content"
                android:layout_height="36dp"
                android:text="+30 Days"
                android:textSize="12sp"
                android:textColor="@color/neon_cyan"
                app:strokeColor="@color/surface_card_stroke"
                android:layout_marginEnd="8dp" />

            <Button
                android:id="@+id/btnToggleStatus"
                android:layout_width="wrap_content"
                android:layout_height="36dp"
                android:text="Block"
                android:textSize="12sp"
                android:textColor="#FFFFFF"
                android:backgroundTint="@color/btn_danger" />
        </LinearLayout>

    </LinearLayout>
</androidx.cardview.widget.CardView>
`
  },

  // drawables
  {
    path: 'app/src/main/res/drawable/bg_floating_panel.xml',
    name: 'bg_floating_panel.xml',
    category: 'xml',
    language: 'xml',
    description: 'Floating window background with deep slate fill, rounded corners, and subtle cyber border',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#0F172A" />
    <stroke android:width="2dp" android:color="#00D2FF" />
    <corners android:radius="16dp" />
</shape>
`
  },
  {
    path: 'app/src/main/res/drawable/bg_bubble_circle.xml',
    name: 'bg_bubble_circle.xml',
    category: 'xml',
    language: 'xml',
    description: 'Circular floating bubble background when minimized',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="oval">
    <solid android:color="#0F172A" />
    <stroke android:width="2dp" android:color="#00D2FF" />
</shape>
`
  },
  {
    path: 'app/src/main/res/drawable/bg_pill_dark.xml',
    name: 'bg_pill_dark.xml',
    category: 'xml',
    language: 'xml',
    description: 'Rounded pill shape for dark input fields',
    content: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#090D16" />
    <stroke android:width="1dp" android:color="#1E293B" />
    <corners android:radius="8dp" />
</shape>
`
  },
  {
    path: 'app/src/main/res/drawable/ic_radar.xml',
    name: 'ic_radar.xml',
    category: 'xml',
    language: 'xml',
    description: 'Vector asset for radar/scanner icon',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:fillColor="#00D2FF"
      android:pathData="M12,2A10,10 0,0 0,2 12A10,10 0,0 0,12 22A10,10 0,0 0,22 12A10,10 0,0 0,12 2M12,4A8,8 0,0 1,20 12C20,13.5 19.6,14.9 18.9,16.1L12,12V4M12,6A6,6 0,0 0,6 12A6,6 0,0 0,12 18A6,6 0,0 0,18 12H12V6Z" />
</vector>
`
  },
  {
    path: 'app/src/main/res/drawable/ic_close.xml',
    name: 'ic_close.xml',
    category: 'xml',
    language: 'xml',
    description: 'Vector asset for close icon',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
      android:fillColor="#FF0055"
      android:pathData="M19,6.41L17.59,5 12,10.59 6.41,5 5,6.41 10.59,12 5,17.59 6.41,19 12,13.41 17.59,19 19,17.59 13.41,12Z" />
</vector>
`
  },
  {
    path: 'app/proguard-rules.pro',
    name: 'proguard-rules.pro',
    category: 'config',
    language: 'properties',
    description: 'ProGuard obfuscation rules for Coroutines, Firebase, OkHttp, and Accessibility Services',
    content: `# Keep Kotlin Coroutines
-keepnames class kotlinx.coroutines.** { *; }

# Keep Firebase Models & Licenses
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keep class com.google.firebase.** { *; }
-keep class com.example.autoailite.data.** { *; }

# Keep OkHttp & JSON
-keep class okhttp3.** { *; }
-dontwarn okio.**

# Keep Accessibility Service & Views
-keep class com.example.autoailite.service.** { *; }
-keep class com.example.autoailite.ui.view.** { *; }
`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'config',
    language: 'properties',
    description: 'Automated GitHub Actions CI to build and export app-debug.apk directly from GitHub',
    content: `name: Build Android APK

on:
  push:
    branches: [ "main", "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Source Code
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew || true

    - name: Build Debug APK
      run: ./gradlew assembleDebug --stacktrace || gradle assembleDebug

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: AutoAILite-Debug-APK
        path: app/build/outputs/apk/debug/app-debug.apk
`
  }
];
