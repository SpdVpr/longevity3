// Re-export from next/navigation
export { useRouter, usePathname } from 'next/navigation';

// Re-export Link from next/link
export { default as Link } from 'next/link';

// Simple redirect function
export function redirect(path: string) {
  return path;
}
