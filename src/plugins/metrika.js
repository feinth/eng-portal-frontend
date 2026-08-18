const YM_ID = import.meta.env.VITE_YANDEX_METRIKA_ID

/**
 * Инициализация Яндекс Метрики.
 * В dev-режиме не подключается, чтобы не засорять статистику.
 */
export function initMetrika() {
  if (!YM_ID || !import.meta.env.PROD) return
  if (window.ym) return

  /* eslint-disable */
  ;(function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) }
    m[i].l = 1 * new Date()
    k = e.createElement(t), a = e.getElementsByTagName(t)[0]
    k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
  /* eslint-enable */

  window.ym(YM_ID, 'init', {
    clickmap: true,          // карта кликов
    trackLinks: true,        // внешние ссылки
    accurateTrackBounce: false, // точный показатель отказов
    webvisor: false,          // вебвизор (записи экрана)
  })
}

/**
 * Отправка хита о просмотре страницы (для SPA).
 */
export function trackPageView(route) {
  if (!YM_ID || !import.meta.env.PROD || !window.ym) return

  window.ym(YM_ID, 'hit', route.fullPath, {
    title: route.meta.title || document.title,
    referer: route.redirectedFrom?.fullPath || '',
  })
}

/**
 * Отправка цели (события).
 * Пример: trackGoal('exam_finished')
 */
export function trackGoal(name, params = {}) {
  if (!YM_ID || !import.meta.env.PROD || !window.ym) return

  window.ym(YM_ID, 'reachGoal', name, params)
}