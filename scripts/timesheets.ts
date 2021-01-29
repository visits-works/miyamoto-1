// 入力内容を解析して、メソッドを呼び出す
import { GSTimesheets } from './gs_timesheets';
import { GSProperties } from './gs_properties';
import { Responder } from './slack';
import { DateUtils } from './date_utils';
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

export class Timesheets {
  date: [number, number, number] | null = null;
  time: [number, number] | null = null;
  minutes: [number] | null = null;
  datetime: Date | null = null;
  dateStr = '';
  datetimeStr = '';
  constructor(
    readonly storage: GSTimesheets,
    readonly settings: GSProperties,
    readonly responder: Responder
  ) {
    var self = this;
    this.responder.on('receiveMessage', function (username, message) {
      self.receiveMessage(username, message);
    });
  }
  // メッセージを受信する
  receiveMessage(username: string, message: string) {
    // 日付は先に処理しておく
    this.date = DateUtils.parseDate(message);
    this.time = DateUtils.parseTime(message);
    this.minutes = DateUtils.parseMinutes(message);
    this.datetime = DateUtils.normalizeDateTime(this.date, this.time!);
    if (this.datetime !== null) {
      this.dateStr = DateUtils.format('Y/m/d', this.datetime);
      this.datetimeStr = DateUtils.format('Y/m/d H:M', this.datetime);
    }

    type CommandName =
      | 'actionSignOut'
      | 'actionWhoIsOff'
      | 'actionWhoIsIn'
      | 'actionCancelOff'
      | 'actionOff'
      | 'actionSignIn'
      | 'confirmSignIn'
      | 'confirmSignOut';
    // コマンド集
    const commands: [CommandName, RegExp][] = [
      [
        'actionSignOut',
        /(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|bye|night|(c|see)\s*(u|you)|left|退勤|ごきげんよ|グ[ッ]?バイ|終了|終わり|おわり)/,
      ],
      ['actionWhoIsOff', /(だれ|誰|who\s*is).*(休|やす(ま|み|む))/],
      ['actionWhoIsIn', /(だれ|誰|who\s*is)/],
      [
        'actionCancelOff',
        /(休|やす(ま|み|む)|休暇).*(キャンセル|消|止|やめ|ません)/,
      ],
      ['actionOff', /(休|やす(ま|み|む)|休暇)/],
      [
        'actionSignIn',
        /(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|hi|hello|morning|ohayo|出勤|開始|始め|はじめ)/,
      ],
      ['confirmSignIn', /__confirmSignIn__/],
      ['confirmSignOut', /__confirmSignOut__/],
    ];

    // メッセージを元にメソッドを探す

    const command = _.find(commands, (ary) => ary && !!message.match(ary[1]));

    // メッセージを実行
    if (command && this[command[0]]) {
      return this[command[0]](username, message);
    }
  }
  // 出勤
  actionSignIn(username: string, _message: unknown) {
    if (!this.datetime) {
      return;
    }
    const data = this.storage.get(username, this.datetime);
    if (!data.signIn || data.signIn === '-') {
      this.storage.set(username, this.datetime, {
        signIn: this.datetime,
      });
      this.responder.template('出勤', username, this.datetimeStr);
    } else {
      // 更新の場合は時間を明示する必要がある
      if (!!this.time) {
        this.storage.set(username, this.datetime, {
          signIn: this.datetime,
        });
        this.responder.template('出勤更新', username, this.datetimeStr);
      }
    }
  }
  // 退勤
  actionSignOut(username: string, _message: unknown) {
    if (!this.datetime) {
      return;
    }
    const data = this.storage.get(username, this.datetime);
    if (!data.signIn || data.signIn === '-') {
      // まだ出勤前である
      this.responder.template('休憩エラー', username, '');
    } else if (!data.signOut || data.signOut === '-') {
      this.storage.set(username, this.datetime, {
        signOut: this.datetime,
      });

      this.responder.template('退勤', username, this.datetimeStr);
    } else {
      // 更新の場合は時間を明示する必要がある
      if (!!this.time) {
        this.storage.set(username, this.datetime, {
          signOut: this.datetime,
        });

        this.responder.template('退勤更新', username, this.datetimeStr);
      }
    }
  }
  // 休憩
  actionBreak(username: string, _time: unknown) {
    if (!this.minutes) {
      return;
    }
    const data = this.storage.get(username, this.datetime!);
    if (!data.signIn || data.signIn === '-') {
      // まだ出勤前である
      this.responder.template('休憩エラー', username, '');
    } else {
      // break 入力
      this.storage.set(username, this.datetime!, {
        break: this.minutes,
      });
      this.responder.template('休憩', username, this.minutes + '分');
    }
  }
  // 休暇申請
  actionOff(username: string, message: unknown) {
    if (!this.date) {
      return;
    }

    const dateObj = new Date(this.date[0], this.date[1] - 1, this.date[2]);
    const data = this.storage.get(username, dateObj);
    if (!data.signOut || data.signOut === '-') {
      this.storage.set(username, dateObj, {
        signIn: '-',
        signOut: '-',
        note: message,
      });
      this.responder.template(
        '休暇',
        username,
        DateUtils.format('Y/m/d', dateObj)
      );
    }
  }
  // 休暇取消
  actionCancelOff(username: string, message: unknown) {
    if (!this.date) {
      return;
    }

    const dateObj = new Date(this.date[0], this.date[1] - 1, this.date[2]);
    const data = this.storage.get(username, dateObj);
    if (!data.signOut || data.signOut === '-') {
      this.storage.set(username, dateObj, {
        signIn: null,
        signOut: null,
        note: message,
      });
      this.responder.template(
        '休暇取消',
        username,
        DateUtils.format('Y/m/d', dateObj)
      );
    }
  }
  // 出勤中
  actionWhoIsIn(_username: string, _message: unknown) {
    const dateObj = DateUtils.toDate(DateUtils.now());
    const result = _.compact(
      _.map(this.storage.getByDate(dateObj), function (row) {
        return _.isDate(row.signIn) && !_.isDate(row.signOut)
          ? row.user
          : undefined;
      })
    );

    if (_.isEmpty(result)) {
      this.responder.template('出勤なし');
    } else {
      this.responder.template('出勤中', result.sort().join(', '));
    }
  }
  // 休暇中
  actionWhoIsOff(_username: string, _message: unknown) {
    const dateObj = DateUtils.toDate(DateUtils.now());
    const dateStr = DateUtils.format('Y/m/d', dateObj);
    let result = _.compact(
      _.map(this.storage.getByDate(dateObj), function (row) {
        return row.signIn === '-' ? row.user : undefined;
      })
    );

    // 定休の処理
    const wday = dateObj.getDay();
    _.each(this.storage.getUsers(), (username) => {
      if (_.contains(this.storage.getDayOff(username), wday)) {
        result.push(username);
      }
    });
    result = _.uniq(result);

    if (_.isEmpty(result)) {
      this.responder.template('休暇なし', dateStr);
    } else {
      this.responder.template('休暇中', dateStr, result.sort().join(', '));
    }
  }
  // 出勤していない人にメッセージを送る
  confirmSignIn(_username?: string, _message?: unknown) {
    const holidays = _.compact(
      _.map((this.settings.get('休日') || '').split(','), function (s) {
        var date = DateUtils.parseDateTime(s);
        return date ? DateUtils.format('Y/m/d', date) : undefined;
      })
    );
    const today = DateUtils.toDate(DateUtils.now());

    // 休日ならチェックしない
    if (_.contains(holidays, DateUtils.format('Y/m/d', today))) return;

    const wday = DateUtils.now().getDay();
    const signedInUsers = _.compact(
      _.map(this.storage.getByDate(today), (row) => {
        const signedIn = _.isDate(row.signIn);
        const off =
          row.signIn === '-' ||
          _.contains(this.storage.getDayOff(row.user), wday);
        return signedIn || off ? row.user : undefined;
      })
    );
    const users = _.difference(this.storage.getUsers(), signedInUsers);

    if (!_.isEmpty(users)) {
      this.responder.template('出勤確認', users.sort());
    }
  }
  // 退勤していない人にメッセージを送る
  confirmSignOut(_username?: string, _message?: unknown) {
    const dateObj = DateUtils.toDate(DateUtils.now());
    const users = _.compact(
      _.map(this.storage.getByDate(dateObj), (row) => {
        _.isDate(row.signIn) && !_.isDate(row.signOut) ? row.user : undefined;
      })
    );

    if (!_.isEmpty(users)) {
      this.responder.template('退勤確認', users.sort());
    }
  }
}
