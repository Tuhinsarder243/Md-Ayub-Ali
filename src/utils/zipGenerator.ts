import JSZip from 'jszip';
import { ALL_ANDROID_FILES } from '../androidCode';

export async function downloadAndroidProjectZip(projectName = 'AutoAILite-Android-Project') {
  const zip = new JSZip();

  // Root folder
  const root = zip.folder(projectName) || zip;

  // Add all files
  ALL_ANDROID_FILES.forEach(file => {
    root.file(file.path, file.content);
  });

  // Add a handy README.md inside the ZIP
  root.file(
    'README.md',
    `# Auto AI Lite - Native Android Project (Kotlin & Material 3)

Package: com.example.autoailite
Min SDK: 26
Target SDK: 34
Language: Kotlin
Build System: Gradle KTS (Kotlin DSL)

## Quick Start
1. Open Android Studio (Hedgehog / Iguana / Koala or newer).
2. Choose "Open..." and select this folder.
3. Allow Gradle to sync.
4. If testing Firebase, add your \`google-services.json\` to the \`app/\` folder (downloaded from Firebase Console).
5. Run on your physical device or emulator.
6. Grant 'Display over other apps' (SYSTEM_ALERT_WINDOW) and enable 'Auto AI Lite' under Accessibility Services.

Enjoy automation with Gemini AI!
`
  );

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
