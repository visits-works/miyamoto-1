// 日付関係の関数

type EventHandler = (...args: any[]) => void;
export class EventListener {
  private _events: Record<string, EventHandler[]>;
  constructor() {
    this._events = {};
  }
  // イベントを捕捉
  on(eventName: string, func: EventHandler) {
    if (this._events[eventName]) {
      this._events[eventName].push(func);
    } else {
      this._events[eventName] = [func];
    }
  }
  // イベント発行
  fireEvent(eventName: string, ...args: any[]) {
    var funcs = this._events[eventName];
    if (funcs) {
      for (var i = 0; i < funcs.length; ++i) {
        funcs[i].apply(this, args);
      }
    }
  }
}
