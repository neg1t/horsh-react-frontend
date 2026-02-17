import { createEvent, createStore } from 'effector'

const online = createEvent()
const offline = createEvent()

const $isOnline = createStore(navigator.onLine)
  .on(online, () => true)
  .on(offline, () => false)

window.addEventListener('online', () => online())
window.addEventListener('offline', () => offline())

export const networkModel = {
  stores: { $isOnline },
  events: { online, offline },
}
