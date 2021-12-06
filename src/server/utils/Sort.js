//日期排序
module.exports = { sortDownDate, sortUpDate }

// 升序 1 2 3 4 5
function sortUpDate(arr, value) {
  return arr.sort((a, b) => {
    return Date.parse(a[value]) - Date.parse(b[value])
  })
}

// 降序 5 4 3 2 1
function sortDownDate(arr, value) {
  return arr.sort((a, b) => {
    return Date.parse(b[value]) - Date.parse(a[value])
  })
}
