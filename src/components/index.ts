import LunaButton from './LunaButton.vue'
import LunaInput from './LunaInput.vue'
import LunaCard from './LunaCard.vue'
import LunaNavBar from './LunaNavBar.vue'
import LunaSwitch from './LunaSwitch.vue'
import ProgressRing from './ProgressRing.vue'
import CalendarHeatmap from './CalendarHeatmap.vue'
import SleepChart from './SleepChart.vue'
import AIMessageBubble from './AIMessageBubble.vue'

export {
  LunaButton,
  LunaInput,
  LunaCard,
  LunaNavBar,
  LunaSwitch,
  ProgressRing,
  CalendarHeatmap,
  SleepChart,
  AIMessageBubble
}

// 全局注册方法
export default {
  install(app: any) {
    app.component('LunaButton', LunaButton)
    app.component('LunaInput', LunaInput)
    app.component('LunaCard', LunaCard)
    app.component('LunaNavBar', LunaNavBar)
    app.component('LunaSwitch', LunaSwitch)
    app.component('ProgressRing', ProgressRing)
    app.component('CalendarHeatmap', CalendarHeatmap)
    app.component('SleepChart', SleepChart)
    app.component('AIMessageBubble', AIMessageBubble)
  }
}
