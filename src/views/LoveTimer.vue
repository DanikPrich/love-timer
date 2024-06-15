<template>
  <div
    class="flex flex-col justify-center items-center max-w-[500px] mx-auto px-[20px] max-h-screen"
  >
    <div class="text-center">
      <p class="text-[20px] relative bottom-[-30px]">Days left:</p>
      <p class="text-[120px]">{{ timeLeft.wholeDays }}</p>
    </div>
    <div class="w-full">
      <div class="flex justify-between">
        <p>0</p>
        <p>{{ `${progressPercentage.toFixed(2)}%` }}</p>
        <p>{{ timeLeft.diffFromStart }}</p>
      </div>
      <div class="w-full border border-gray-200 rounded-md overflow-hidden mb-[20px]">
        <div
          class="relative h-[15px] bg-black"
          :style="{ width: `${progressPercentage.toFixed(2)}%` }"
        >
          <div
            class="absolute text-white right-[50%] z-10 top-1/2 translate-y-[-50%] translate-x-[50%]"
          >
            {{ timeLeft.diffFromStart - timeLeft.wholeDays }}
          </div>
        </div>
      </div>
    </div>
    <div class="timer flex flex-col sm:flex-row items-center gap-[15px] sm:gap-0">
      <div class="flex">
        <div class="time-unit flex flex-col justify-center text-2xl">
          <p>{{ timeLeft.months }}</p>
          <p>Month</p>
        </div>
        <div class="time-unit flex flex-col justify-center text-2xl">
          <p>{{ timeLeft.days }}</p>
          <p>Days</p>
        </div>
      </div>
      <div class="flex">
        <div class="time-unit flex flex-col justify-center text-2xl">
          <p>{{ timeLeft.hours }}</p>
          <p>Hours</p>
        </div>
        <div class="time-unit flex flex-col justify-center text-2xl">
          <p>{{ timeLeft.minutes }}</p>
          <p>Minutes</p>
        </div>
        <div class="time-unit flex flex-col justify-center text-2xl">
          <p>{{ timeLeft.seconds }}</p>
          <p>Seconds</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(duration)
dayjs.extend(isSameOrBefore)

interface TimeLeft {
  wholeDays: number
  diffFromStart: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

const startDate = dayjs('2024-06-03T05:00:00')
const targetDate = dayjs('2024-09-23T09:00:00')

if (targetDate.isBefore(dayjs())) {
  targetDate.add(1, 'year')
}

const calculateTimeLeft = (startDate: dayjs.Dayjs, target: dayjs.Dayjs): TimeLeft => {
  const now = dayjs()
  const diff = target.diff(now)
  const diffFromStart = target.diff(startDate)
  const duration = dayjs.duration(diff)
  const durationFromStart = dayjs.duration(diffFromStart)
  return {
    wholeDays: Math.floor(duration.asDays()),
    diffFromStart: Math.floor(durationFromStart.asDays()),
    months: Math.floor(duration.asMonths()),
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  }
}

const calculateProgressPercentage = (start: dayjs.Dayjs, end: dayjs.Dayjs): number => {
  const now = dayjs()
  const totalDuration = end.diff(start)
  const elapsedDuration = now.diff(start)
  return (elapsedDuration / totalDuration) * 100
}

const timeLeft = ref<TimeLeft>(calculateTimeLeft(startDate, targetDate))
const progressPercentage = ref<number>(calculateProgressPercentage(startDate, targetDate))

const updateTimer = () => {
  timeLeft.value = calculateTimeLeft(startDate, targetDate)
  progressPercentage.value = calculateProgressPercentage(startDate, targetDate)
}

let timerInterval: number | null = null

onMounted(() => {
  timerInterval = window.setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.timer {
  font-size: 2rem;
  color: black;
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}

.time-unit {
  margin: 0 1rem;
  text-align: center;
}
</style>
