import { ANDROID_PROJECT_FILES, AndroidFile } from './filesData';
import { ANDROID_EXTRA_FILES } from './extraFilesData';

export const ALL_ANDROID_FILES: AndroidFile[] = [
  ...ANDROID_PROJECT_FILES,
  ...ANDROID_EXTRA_FILES
];

export type { AndroidFile };

export function getFileByCategory(category?: string) {
  if (!category || category === 'all') return ALL_ANDROID_FILES;
  return ALL_ANDROID_FILES.filter(f => f.category === category);
}

export function searchFiles(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_ANDROID_FILES;
  return ALL_ANDROID_FILES.filter(
    f =>
      f.name.toLowerCase().includes(q) ||
      f.path.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.content.toLowerCase().includes(q)
  );
}
