/**
 * Created by wangjian on 3/1/2017.
 */
export const dateformat = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  const week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d'
  }
  let tFmt = fmt
  if (/(Y+)/.test(tFmt)) {
    tFmt = tFmt.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(tFmt)) {
    tFmt = tFmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay().toString()])
  }
  for (const [k, v] of Object.entries(o)) {
    if (new RegExp(`(${k})`).test(tFmt)) {
      tFmt = tFmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (v) : ((`00${v}`).substr(v.length.toString())))
    }
  }
  return tFmt
}
/*
 date为string或者object类型
 formatTime为字符串格式
 */
export const dateFormat = (date, formatTime) => {
  if (typeof date === 'string') {
    return date.substr(0, formatTime.length)
  } else if (typeof date === 'object') {
    return dateformat(date, formatTime)
  }
  return false
}
