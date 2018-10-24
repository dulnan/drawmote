const buildKey = (uid, name) => {
  return `vue_${uid}_${name}`
}

/**
 * A single thread. It stores all handlers for the given thread and provides
 * a way to add, remove and run them.
 */
class Thread {
  constructor (name) {
    this.name = name
    this.handlers = []
  }

  /**
   * Add a handler.
   *
   * @param {Function} method The method to be added.
   * @param {String} uid The uid of the Vue component.
   * @param {Object} context The context of the Vue component.
   */
  add (method, uid, context) {
    const key = buildKey(uid, this.name)

    this.handlers.push({
      key: key,
      method: method,
      context: context
    })
  }

  /**
   * Remove a handler.
   *
   * @param {Handler} handler The handler to be removed.
   * @param {String} uid The uid of the Vue component.
   */
  remove (uid) {
    const key = buildKey(uid, this.name)

    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] !== null && this.handlers[i].key === key) {
        this.handlers[i] = null
      }
    }
  }

  /**
   * Run all handlers in this thread.
   *
   * @param {Object} state The state object to be provided for all handlers.
   */
  run (state) {
    // Store the already called handlers.
    let currentRun = {}

    // Loop over all handlers and run them. Also make sure they are
    // not called multiple times.
    for (let i = 0; i < this.handlers.length; i++) {
      if (this.handlers[i] !== null) {
        const handler = this.handlers[i]
        if (!currentRun[handler.key]) {
          this.handlers[i].method.call(handler.context, state)
          currentRun[handler.key] = true
        }
      }
    }
  }
}

export default class Threads {
  constructor () {
    this.threads = {}
    this.queue = {}
  }

  addHandler (method, threadName, uid, context) {
    if (!this.threads[threadName]) {
      this.threads[threadName] = new Thread(threadName)
    }

    this.threads[threadName].add(method, uid, context)
    this.trigger(threadName)
  }

  removeHandler (method, threadName, uid) {
    this.threads[threadName].remove(uid)
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
