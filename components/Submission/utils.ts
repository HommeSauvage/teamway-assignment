export const getTimeElapsedSince = (date: Date): number => {
  return Math.round(((new Date).getTime() - date.getTime()) / 1000)
}