export default {
  sleep: (time) => {
    return new Promise(function (resolve, reject) {
      // ... some code
      setTimeout(function () {
        resolve()
      }, time)
    })
  },
  getDate() {
    var date = new Date()
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  },
  // todo 生日转年龄
  birthday2Age(birthday, showMonth) {
    // showMonth = false
    if (birthday == null || birthday == '' || birthday.length <= 0) {
      return '0岁'
    }
    let _dateTime = null
    try {
      _dateTime = new Date(birthday)
    } catch (e) {
      return '0岁'
    }
    if (_dateTime == null) {
      return '0岁'
    }
    // 当前日期
    let _nowDate = new Date()
    // 年份差
    let _ageYear = _nowDate.getFullYear() - _dateTime.getFullYear()
    // 根据月份计算整年年龄
    if (_nowDate.getMonth() < _dateTime.getMonth()) {
      _ageYear = _ageYear - 1
    }
    // 月份差
    let _ageMonth = _nowDate.getMonth() - _dateTime.getMonth()
    if (_nowDate.getMonth() < _dateTime.getMonth()) {
      _ageMonth = 12 - (_dateTime.getMonth() + 1) + (_nowDate.getMonth() + 1)
    }
    let _ageStr = _ageYear + '岁'
    if (showMonth && _ageMonth > 0) {
      if (_ageYear <= 0) {
        _ageStr = ''
      }
      _ageStr = _ageStr + _ageMonth + '月'
    }
    return _ageStr
  },
  // todo 生日转星座
  birtyday2Constellation(birthday) {
    if (birthday == null || birthday == '' || birthday.length <= 0) {
      return '未知'
    }
    let _dateTime = null
    try {
      _dateTime = new Date(birthday)
    } catch (e) {
      return '未知'
    }
    if (_dateTime == null) {
      return '未知'
    }
    const xingZuoMap = {
      1: { start: 20, name: '水瓶座' },
      2: { start: 19, name: '双鱼座' },
      3: { start: 21, name: '白羊座' },
      4: { start: 20, name: '金牛座' },
      5: { start: 21, name: '双子座' },
      6: { start: 22, name: '巨蟹座' },
      7: { start: 23, name: '狮子座' },
      8: { start: 23, name: '处女座' },
      9: { start: 23, name: '天秤座' },
      10: { start: 24, name: '天蝎座' },
      11: { start: 23, name: '射手座' },
      12: { start: 22, name: '摩羯座' },
    }
    let _xMonth = _dateTime.getMonth()
    let data = xingZuoMap[_xMonth + '']
    if (_dateTime.getDate() < data['start']) {
      _xMonth = _xMonth == 1 ? 12 : _xMonth - 1
      data = xingZuoMap[_xMonth + '']
    }
    return data['name']
  },
  // todo 展示时间
  dt2SendTime(dateT, isC) {
    let _showTime = '现在'
    try {
      if (dateT == null || dateT == '' || dateT.length <= 0) {
        return '未知'
      }
      let _dateTime = null
      try {
        _dateTime = new Date(dateT)
      } catch (e) {
        return '未知'
      }
      if (_dateTime == null) {
        return '未知'
      }
      let _nowDate = new Date()

      // 相关时间撮
      let _dateTimeV = _dateTime.getTime()
      let _nowDateV = _nowDate.getTime()

      // 判读时间是否在10分钟内
      if (_dateTimeV > _nowDateV - 600000) {
        _showTime = '刚刚'
        return _showTime
      }

      // 判读时间是否在1小时内
      if (_dateTimeV > _nowDateV - 6000000) {
        let _cha = _nowDateV - _dateTimeV
        _cha = _cha / 60000
        return Math.floor(_cha) + '分钟前'
      }

      let _today = new Date(
        _nowDate.getFullYear() +
          '-' +
          (_nowDate.getMonth() + 1) +
          '-' +
          _nowDate.getDate() +
          ' 00:00:00',
      )
      let _todayV = _today.getTime()
      // 判断发送时间是否在今天
      if (_dateTimeV > _todayV) {
        _showTime =
          '今天 ' +
          (_dateTime.getHours() > 10 ? _dateTime.getHours() : '0' + _dateTime.getHours()) +
          ':' +
          (_dateTime.getMinutes() > 10 ? _dateTime.getMinutes() : '0' + _dateTime.getMinutes())
        return _showTime
      }
      // 判断发送时间是否在昨天
      if (_dateTimeV > _todayV - 86400000) {
        _showTime =
          '昨天 ' +
          (_dateTime.getHours() > 10 ? _dateTime.getHours() : '0' + _dateTime.getHours()) +
          ':' +
          (_dateTime.getMinutes() > 10 ? _dateTime.getMinutes() : '0' + _dateTime.getMinutes())
        return _showTime
      }

      // 判断发送时间是否在前天
      if (_dateTimeV > _todayV - 172800000) {
        _showTime =
          '前天 ' +
          (_dateTime.getHours() > 10 ? _dateTime.getHours() : '0' + _dateTime.getHours()) +
          ':' +
          (_dateTime.getMinutes() > 10 ? _dateTime.getMinutes() : '0' + _dateTime.getMinutes())
        return _showTime
      }

      // 返回日期
      _showTime = !isC
        ? (_dateTime.getMonth() + 1 > 10
            ? _dateTime.getMonth() + 1
            : '0' + (_dateTime.getMonth() + 1)) +
          '-' +
          (_dateTime.getDate() > 10 ? _dateTime.getDate() : '0' + _dateTime.getDate())
        : _dateTime.getMonth() + 1 + '月' + _dateTime.getDate() + '日'
    } catch (e) {
      _showTime = '未知'
      console.log(e)
    }
    return _showTime
  },
}
