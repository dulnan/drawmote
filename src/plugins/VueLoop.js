import Threads from '@/classes/Threads'

const PROPERTY = 'loop'

class Loop {
  constructor (data, state, mutations, actions) {
    this.data = data
    this.mutations = {}
    this.actions = {}

    this._getState = state
    this._threads = new Threads()

    this.addMutations(mutations)
    this.addActions(actions)

    this.loop()
  }

  addMutations (mutations) {
    Object.keys(mutations).forEach(name => {
      this.mutations[name] = mutations[name]
    })
  }

  addActions (actions) {
    Object.keys(actions).forEach(name => {
      this.actions[name] = actions[name]
    })
  }

  getContext () {
    return {
      data: this.data,
      trigger: this.trigger.bind(this),
      mutate: this.mutate.bind(this),
      action: this.action.bind(this)
    }
  }

  mutate (name, value) {
    const context = this.getContext()
    this.mutations[name].call(this, context, value)
  }

  action (name, value) {
    const context = this.getContext()
    this.actions[name].call(this, context, value)
  }

  trigger (threadName) {
    this._threads.trigger(threadName)
  }

  getState () {
    return this._getState(this.data)
  }

  loop () {
    const state = this.getState()
    this._threads.step(state, () => {
      window.requestAnimationFrame(() => this.loop())
    })
  }

  forComponent (component, action) {
    const definitions = component.$options[PROPERTY]

    Object.keys(definitions).forEach(methodName => {
      const threads = definitions[methodName]

      threads.forEach(thread => {
        const method = component[methodName]
        const uid = component._uid

        const functionName = action === 'add' ? 'addHandler' : 'removeHandler'
        this._threads[functionName](method, thread, uid, component)
      })
    })
  }

  addComponent (component) {
    this.forComponent(component, 'add')
  }

  removeComponent (component) {
    this.forComponent(component, 'remove')
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$loop = new Loop(options.data(), options.state, options.mutations, options.actions)

    Vue.mixin({
      mounted () {
        let definitions = this.$options[PROPERTY]

        if (definitions && typeof definitions === 'object') {
          this.$loop.addComponent(this)
        }
      },

      beforeDestroy () {
        let definitions = this.$options[PROPERTY]

        if (definitions && typeof definitions === 'object') {
          this.$loop.removeComponent(this)
        }
      }
    })
  }
}
