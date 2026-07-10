/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date to YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${formatDate(date)} ${hours}:${minutes}:${seconds}`
}

/**
 * Show toast message
 */
export function showToast(title: string, icon: 'success' | 'loading' | 'error' | 'none' = 'none', duration = 2000) {
  uni.showToast({
    title,
    icon,
    duration
  })
}

/**
 * Navigate to page
 */
export function navigateTo(url: string) {
  uni.navigateTo({ url })
}

/**
 * Redirect to page
 */
export function redirectTo(url: string) {
  uni.redirectTo({ url })
}

/**
 * Switch tab page
 */
export function switchTab(url: string) {
  uni.switchTab({ url })
}

/**
 * Navigate back
 */
export function navigateBack(delta = 1) {
  uni.navigateBack({ delta })
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
