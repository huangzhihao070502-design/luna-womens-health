import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  phone?: string
  nickname?: string
  avatar?: string
  isGuest?: boolean
  createdAt?: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<UserInfo>({})

  const isLoggedIn = computed(() => !!token.value && !userInfo.value.isGuest)
  const isGuest = computed(() => !!token.value && userInfo.value.isGuest === true)

  function setToken(t: string) {
    token.value = t
    uni.setStorageSync('token', t)
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = { ...userInfo.value, ...info }
    uni.setStorageSync('user_info', JSON.stringify(userInfo.value))
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    uni.removeStorageSync('token')
    uni.removeStorageSync('user_info')
    uni.reLaunch({ url: '/pages/login/login' })
  }

  function init() {
    const savedToken = uni.getStorageSync('token')
    if (savedToken) token.value = savedToken
    const savedInfo = uni.getStorageSync('user_info')
    if (savedInfo) {
      try { userInfo.value = JSON.parse(savedInfo) } catch (e) { console.error(e) }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    isGuest,
    setToken,
    setUserInfo,
    logout,
    init
  }
})

export interface DiaryEntry {
  id: string
  date: string
  title: string
  content: string
  mood: string
  moodIcon: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MoodRecord {
  id: string
  date: string
  mood: string
  moodIcon: string
  note: string
  factors: string[]
}

export interface PeriodRecord {
  id: string
  startDate: string
  endDate: string
  flow: number
  pain: number
  mood: number
  hasMedicine: boolean
  hasSex: boolean
  note: string
}

export interface SleepRecord {
  date: string
  hours: number
  quality: number
  bedTime: string
  wakeTime: string
}

export const useDiaryStore = defineStore('diary', () => {
  const entries = ref<DiaryEntry[]>([])

  function addEntry(entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const newEntry: DiaryEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    }
    entries.value.unshift(newEntry)
    saveToStorage()
    return newEntry
  }

  function updateEntry(id: string, updates: Partial<DiaryEntry>) {
    const index = entries.value.findIndex(e => e.id === id)
    if (index !== -1) {
      entries.value[index] = {
        ...entries.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveToStorage()
    }
  }

  function deleteEntry(id: string) {
    entries.value = entries.value.filter(e => e.id !== id)
    saveToStorage()
  }

  function getEntry(id: string) {
    return entries.value.find(e => e.id === id)
  }

  function getEntriesByDate(date: string) {
    return entries.value.filter(e => e.date === date)
  }

  function saveToStorage() {
    uni.setStorageSync('diary_entries', JSON.stringify(entries.value))
  }

  function init() {
    const saved = uni.getStorageSync('diary_entries')
    if (saved) {
      try {
        entries.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse diary entries', e)
      }
    }
    // Add some sample entries if empty
    if (entries.value.length === 0) {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const formatD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      entries.value = [
        {
          id: '1',
          date: formatD(today),
          title: '今天心情不错',
          content: '阳光很好，和朋友一起去了公园散步。看到了很多漂亮的花，心情特别愉快。晚上吃了一顿美味的火锅，满足的一天。',
          mood: '开心',
          moodIcon: '😊',
          tags: ['朋友', '美食', '散步'],
          createdAt: today.toISOString(),
          updatedAt: today.toISOString()
        },
        {
          id: '2',
          date: formatD(yesterday),
          title: '工作有点累',
          content: '今天加班到很晚，项目deadline快到了。虽然很累，但是完成了一个重要的模块，还是很有成就感的。',
          mood: '疲惫',
          moodIcon: '😫',
          tags: ['工作', '加班'],
          createdAt: yesterday.toISOString(),
          updatedAt: yesterday.toISOString()
        }
      ]
    }
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    getEntriesByDate,
    init
  }
})

export const useMoodStore = defineStore('mood', () => {
  const records = ref<MoodRecord[]>([])

  function addRecord(record: Omit<MoodRecord, 'id'>) {
    const newRecord: MoodRecord = {
      ...record,
      id: Date.now().toString()
    }
    records.value.unshift(newRecord)
    saveToStorage()
    return newRecord
  }

  function saveToStorage() {
    uni.setStorageSync('mood_records', JSON.stringify(records.value))
  }

  function init() {
    const saved = uni.getStorageSync('mood_records')
    if (saved) {
      try {
        records.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse mood records', e)
      }
    }
  }

  const todayMood = computed(() => {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return records.value.find(r => r.date === dateStr)
  })

  return {
    records,
    todayMood,
    addRecord,
    init
  }
})

export const usePeriodStore = defineStore('period', () => {
  const records = ref<PeriodRecord[]>([])
  const cycleLength = ref(28)
  const periodLength = ref(5)
  const lastPeriodStart = ref('')

  const nextPeriodDate = computed(() => {
    if (!lastPeriodStart.value) return null
    const start = new Date(lastPeriodStart.value)
    const next = new Date(start)
    next.setDate(next.getDate() + cycleLength.value)
    return next
  })

  const daysUntilNextPeriod = computed(() => {
    if (!nextPeriodDate.value) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next = new Date(nextPeriodDate.value)
    next.setHours(0, 0, 0, 0)
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  })

  const currentDayOfPeriod = computed(() => {
    if (!lastPeriodStart.value) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(lastPeriodStart.value)
    start.setHours(0, 0, 0, 0)
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    if (diff >= 1 && diff <= periodLength.value) {
      return diff
    }
    return null
  })

  function addRecord(record: Omit<PeriodRecord, 'id'>) {
    const newRecord: PeriodRecord = {
      ...record,
      id: Date.now().toString()
    }
    records.value.unshift(newRecord)
    if (!lastPeriodStart.value || new Date(record.startDate) > new Date(lastPeriodStart.value)) {
      lastPeriodStart.value = record.startDate
    }
    saveToStorage()
    return newRecord
  }

  function saveToStorage() {
    uni.setStorageSync('period_records', JSON.stringify(records.value))
    uni.setStorageSync('period_cycleLength', cycleLength.value.toString())
    uni.setStorageSync('period_periodLength', periodLength.value.toString())
    uni.setStorageSync('period_lastStart', lastPeriodStart.value)
  }

  function init() {
    const saved = uni.getStorageSync('period_records')
    if (saved) {
      try { records.value = JSON.parse(saved) } catch (e) { console.error(e) }
    }
    const savedCycle = uni.getStorageSync('period_cycleLength')
    if (savedCycle) cycleLength.value = parseInt(savedCycle)
    const savedPeriodLen = uni.getStorageSync('period_periodLength')
    if (savedPeriodLen) periodLength.value = parseInt(savedPeriodLen)
    const savedLastStart = uni.getStorageSync('period_lastStart')
    if (savedLastStart) {
      lastPeriodStart.value = savedLastStart
    } else {
      // Default: last period started 3 days ago
      const d = new Date()
      d.setDate(d.getDate() - 3)
      lastPeriodStart.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }
  }

  return {
    records,
    cycleLength,
    periodLength,
    lastPeriodStart,
    nextPeriodDate,
    daysUntilNextPeriod,
    currentDayOfPeriod,
    addRecord,
    init
  }
})

export const useSleepStore = defineStore('sleep', () => {
  const records = ref<SleepRecord[]>([])

  function addRecord(record: SleepRecord) {
    const existing = records.value.findIndex(r => r.date === record.date)
    if (existing !== -1) {
      records.value[existing] = record
    } else {
      records.value.push(record)
    }
    records.value.sort((a, b) => a.date.localeCompare(b.date))
    saveToStorage()
  }

  function saveToStorage() {
    uni.setStorageSync('sleep_records', JSON.stringify(records.value))
  }

  function init() {
    const saved = uni.getStorageSync('sleep_records')
    if (saved) {
      try { records.value = JSON.parse(saved) } catch (e) { console.error(e) }
    }
    // Sample data
    if (records.value.length === 0) {
      const days = ['一', '二', '三', '四', '五', '六', '日']
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const dayIdx = d.getDay()
        records.value.push({
          date: dateStr,
          hours: 6 + Math.random() * 3,
          quality: 70 + Math.floor(Math.random() * 25),
          bedTime: '23:' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
          wakeTime: '07:' + String(Math.floor(Math.random() * 60)).padStart(2, '0')
        })
      }
    }
  }

  const weekData = computed(() => {
    const sorted = [...records.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7).reverse()
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return sorted.map(r => {
      const d = new Date(r.date)
      return {
        label: days[d.getDay()],
        value: Math.round(r.hours * 10) / 10,
        date: r.date
      }
    })
  })

  const avgSleepHours = computed(() => {
    if (records.value.length === 0) return 0
    const sum = records.value.slice(-7).reduce((acc, r) => acc + r.hours, 0)
    return Math.round((sum / Math.min(records.value.length, 7)) * 10) / 10
  })

  return {
    records,
    weekData,
    avgSleepHours,
    addRecord,
    init
  }
})
