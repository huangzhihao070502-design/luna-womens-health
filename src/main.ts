import { createApp as vueCreateApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import GlobalComponents from './components'
import { useUserStore, useDiaryStore, useMoodStore, usePeriodStore, useSleepStore } from './store'

export function createVueApp() {
  const app = vueCreateApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(GlobalComponents)

  // Initialize stores
  const userStore = useUserStore()
  const diaryStore = useDiaryStore()
  const moodStore = useMoodStore()
  const periodStore = usePeriodStore()
  const sleepStore = useSleepStore()

  userStore.init()
  diaryStore.init()
  moodStore.init()
  periodStore.init()
  sleepStore.init()

  return {
    app,
    pinia
  }
}
