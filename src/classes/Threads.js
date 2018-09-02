const buildKey = (uid, watching) => {
  return `vue_${uid}_${watching.join('_')}`
}

class Thread {
  constructor () {
    this.handlers = []
  }

  add (event, uid, context) {
    const key = buildKey(uid, event.threads)

    this.handlers.push({
      key: key,
      method: event.handler,
      context: context
    })
  }

  remove (event, uid) {
    const key = buildKey(uid, event.threads)

    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] !== null && this.handlers[i].key === key) {
        this.handlers[i] = null
      }
    }
  }

  run (state) {
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] !== null) {
        const handler = this.handlers[i]
        this.handlers[i].method.call(handler.context, state)
      }
    }
  }
}

export default class Threads {
  constructor () {
    this.threads = {}
    this.queue = {}
  }

  addHandler (event, uid, context) {
    event.threads.forEach(thread => {
      if (!this.threads[thread]) {
        this.threads[thread] = new Thread()
      }

      this.threads[thread].add(event, uid, context)
      this.trigger(thread)
    })
  }

  removeHandler (event, uid) {
    event.threads.forEach(thread => {
      if (this.threads[thread]) {
        this.threads[thread].remove(event, uid)
      }
    })
  }

  trigger (thread) {
    this.queue[thread] = true
  }

  step (state, cb) {
    Object.keys(this.threads).forEach(thread => {
      if (this.queue[thread] === true) {
        this.queue[thread] = false
        this.threads[thread].run(state)
      }
    })

    cb()
  }
}
