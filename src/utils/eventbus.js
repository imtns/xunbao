const events = new Map()

/**
 * 消息订阅
 * key：消息标识
 * target：消息发起者，用来区分相同key不同的消息
 * callback：回调函数
 */
function register(key, target, callback) {
  const eobj = {
    target: target,
    callback: callback
  }
  let value = events.get(key)

  // 如果key已存在，则检查是否有相同的target
  if (Array.isArray(value)) {
    // 检查是否已有相同target的注册信息
    if (value.some((e) => e.target === target)) {
      console.log('Already registered for this key and target.')
      return // 如果找到了，就返回，不再注册
    }
    // 如果没有找到相同的target，添加新的注册信息
    value.push(eobj)
  } else {
    // 如果key不存在，直接注册
    value = [eobj]
  }
  events.set(key, value)
}

/**
 * 消息发布
 * key：消息标识
 * data：回调数据
 */
function post(key, data) {
  // 通过key拿到消息队列
  const value = events.get(key)
  // 如果队列存在则遍历队列，然后调用消息发起者的回调函数，并将data数据进行回调
  if (Array.isArray(value)) {
    value.map(function (e) {
      const target = e.target
      const callback = e.callback
      callback.call(target, data)
    })
  }
}

/**
 * 取消订阅
 * key：消息标识
 * target：消息发起者，用来区分相同key不同的消息
 */
function unregister(key, target) {
  const hasKey = events.has(key)
  // 是否存在此消息队列
  if (hasKey) {
    let value = events.get(key)
    if (Array.isArray(value)) {
      // 如果队列中只有一条数据直接删除
      if (value.length === 1) {
        events.delete(key)
      } else {
        // 如果队列中存在多条数据则过滤出和当前取消订阅target不同的消息然后重新设置到key的消息队列中
        value = value.filter(function (e) {
          return e.target !== target
        })
        events.set(key, value)
      }
    }
  }
}

module.exports = {
  register: register,
  post: post,
  unregister: unregister
}
