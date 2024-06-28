export const timeSince = (date: Date) => {
  let d = new Date(date)
  let now = new Date()

  const total = now.getTime() - (d.getTime())

  const days    = (Math.floor((total / 1000 / 60 / 60 / 24) % 1000000))
  const hours   = (Math.floor((total / 1000 / 60 / 60) % 24))
  const minutes = (Math.floor((total / 1000 / 60) % 60))
  const seconds = (Math.floor((total / 1000) % 60))

  if (days > 0) {
    return days + " day" + (days == 1 ? "" : "s")
  } else if (hours > 0) {
    return hours + " hour" + (hours == 1 ? "" : "s")
  } else if (minutes > 0) {
    return minutes + " minute" + (minutes == 1 ? "" : "s")
  } else {
    return seconds + " second" + (seconds == 1 ? "" : "s")
  }
}
