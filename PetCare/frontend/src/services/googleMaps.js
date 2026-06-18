let loadPromise = null

export function cargarGoogleMaps() {
  if (loadPromise) return loadPromise

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.warn('VITE_GOOGLE_MAPS_API_KEY no está configurada en .env')
    return Promise.reject(new Error('API key no configurada'))
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  loadPromise = new Promise((resolve) => {
    window.initGoogleMaps = () => resolve(window.google.maps)
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })

  return loadPromise
}
