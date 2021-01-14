// Slackのインタフェース

import { EventListener } from './event_listener';
import { GSProperties } from './gs_properties';
import { GSTemplate } from './gs_template';
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

export interface Responder extends EventListener {
  send(message: string, options?: any): string;
  template(...args: any[]): void;
}

export class Slack extends EventListener implements Responder {
  constructor(
    readonly incomingURL: string,
    private readonly _template: GSTemplate,
    readonly settings: GSProperties
  ) {
    super();
  }
  // 受信したメッセージをtimesheetsに投げる
  receiveMessage(username: string, body: string) {
    // 特定のアカウントには反応しない
    const ignore_users = (this.settings.get('無視するユーザ') || '')
      .toLowerCase()
      .replace(/^\s*(.*?)\s*$/, '$1')
      .split(/\s*,\s*/);

    if (_.contains(ignore_users, username.toLowerCase())) return;

    // -で始まるメッセージも無視
    if (body.match(/^-/)) return;

    this.fireEvent('receiveMessage', username, body);
  }
  // メッセージ送信
  send(message: string, options: any = {}) {
    options = _.clone(options);
    options['text'] = message;

    const send_options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      payload: { payload: JSON.stringify(options) },
    };

    if (this.incomingURL) {
      UrlFetchApp.fetch(this.incomingURL, send_options);
    }

    return message;
  }
  // テンプレート付きでメッセージ送信
  template(...args: any[]) {
    this.send(
      this._template.template.apply(this._template, [args.shift(), ...args])
    );
  }
}
