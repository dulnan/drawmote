const buildKey = (uid, watching) => {
  return `vue_${uid}_${watching.join('_')}`
}

/**
 * A single thread. It stores all handlers for the given thread and provides
 * a way to add, remove and run them.
 */
class Thread {
  constructor () {
    this.handlers = []
  }

  /**
   * Add a handler.
   *
   * @param {Handler} handler The handler to be added.
   * @param {String} uid The uid of the Vue component
   * @param {Object} context The context of the Vue component
   */
  add (handler, uid, context) {
    const key = buildKey(uid, handler.threads)

    this.handlers.push({
      key: key,
      method: handler.handler,
      context: context
    })
  }

  /**
   * Remove a handler.
   *
   * @param {Handler} handler The handler to be removed.
   * @param {String} uid The uid of the Vue component.
   */
  remove (handler, uid) {
    const key = buildKey(uid, handler.threads)

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
