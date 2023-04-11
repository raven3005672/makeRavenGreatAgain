// 发布订阅
class EventEmitter {
  constructor() {
    this.events = [];
  }
  on(evt, callback, ctx) {
    if (!this.events[evt]) {
      this.events[evt] = [];
    }
    this.events[evt].push(callback);
    return this;
  }
  emit(evt, ...payload) {
    const callbacks = this.events[evt];
    if (callbacks) {
      callbacks.forEach((cb) => cb.apply(this, payload));
    }
    return this;
  }
  off(evt, callback) {
    if (typeof evt === 'undefined') {
      delete this.events;
    } else if (typeof evt === 'string') {
      this.events[evt] = this.events[evt].filter((cb) => cb !== callback);
    } else {
      delete this.events[evt];
    }
  }
  once(evt, callback, ctx) {
    const proxyCallback = (...payload) => {
      callback.apply(ctx, payload);
      // 回调执行完成之后就删除事件订阅
      this.off(evt, proxyCallback);
    }
    this.on(evt, proxyCallback, ctx);
  }
}