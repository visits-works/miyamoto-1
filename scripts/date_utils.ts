// 日付関係の関数
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

export class DateUtils {
  private static _now = new Date();
  // 今を返す
  static now(datetime?: Date) {
    if (typeof datetime !== 'undefined') {
      this._now = datetime;
    }
    return this._now;
  }

  static parseTime(_str: string = ''): [number, number] | null {
    // 大文字を小文字に
    const str = this._toHalfWidth(_str);

    const reg = /((\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|)|(am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|)|(\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm)|(\d{1,2})\s*時)/;
    const matches = str.match(reg);

    if (!matches) {
      return null;
    }

    let hour = 0,
      min = 0;

    const getHourAndMinute = (
      hour: string,
      minute: string = '0',
      isPM: boolean
    ) => ({
      hour: Number.parseInt(hour, 10) + (isPM ? 12 : 0),
      min: Number.parseInt(minute, 10),
    });

    // (\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|) にマッチ
    // 1時20, 2:30, 3:00pm
    if (matches[2]) {
      ({ hour, min } = getHourAndMinute(
        matches[2],
        matches[3],

        _.contains(['pm'], matches[4])
      ));
    }

    // (am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|) にマッチ
    // 午後1 午後2時30 pm3
    if (matches[5]) {
      ({ hour, min } = getHourAndMinute(
        matches[6],
        matches[8],

        _.contains(['pm', '午後'], matches[5])
      ));
    }

    // (\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm) にマッチ
    // 1am 2:30pm
    if (matches[9]) {
      ({ hour, min } = getHourAndMinute(
        matches[9],
        matches[11],

        _.contains(['pm'], matches[12])
      ));
    }

    // (\d{1,2})\s*時 にマッチ
    // 14時
    if (matches[13]) {
      ({ hour, min } = getHourAndMinute(matches[13], '0', false));
    }

    return [hour, min];
  }

  // テキストから休憩時間を抽出
  static parseMinutes(_str: string = ''): [number] | null {
    // 大文字を小文字に
    const str = this._toHalfWidth(_str);

    const reg = /(\d*.\d*\s*(分|minutes?|mins|時間|hour|hours))(\d*(分|minutes?|mins))?/;
    const matches = str.match(reg);

    if (!matches) {
      return null;
    }

    let hour = 0,
      min = 0;

    // 最初のマッチ
    if (matches[1]) {
      if (['時間', 'hour', 'hours'].includes(matches[2])) {
        // 1.5 時間
        hour = Number.parseFloat(matches[1]);
        // 2回めのマッチ
        if (matches[3]) {
          min = Number.parseInt(matches[3], 10);
        }
      } else {
        // 60 分
        min = Number.parseInt(matches[1], 10);
      }
    }

    return [hour * 60 + min];
  }

  static parseDate(_str: string = ''): [number, number, number] | null {
    // 大文字を小文字に
    const str = this._toHalfWidth(_str);

    if (str.match(/(明日|tomorrow)/)) {
      const tomorrow = new Date(
        this.now().getFullYear(),
        this.now().getMonth(),
        this.now().getDate() + 1
      );
      return [
        tomorrow.getFullYear(),
        tomorrow.getMonth() + 1,
        tomorrow.getDate(),
      ];
    }

    if (str.match(/(今日|today)/)) {
      return [
        this.now().getFullYear(),
        this.now().getMonth() + 1,
        this.now().getDate(),
      ];
    }

    if (str.match(/(昨日|yesterday)/)) {
      const yesterday = new Date(
        this.now().getFullYear(),
        this.now().getMonth(),
        this.now().getDate() - 1
      );
      return [
        yesterday.getFullYear(),
        yesterday.getMonth() + 1,
        yesterday.getDate(),
      ];
    }

    const reg = /((\d{4})[-\/年]{1}|)(\d{1,2})[-\/月]{1}(\d{1,2})/;
    const matches = str.match(reg);
    if (!matches) {
      return null;
    }

    let year = parseInt(matches[2], 10);
    const month = parseInt(matches[3], 10);
    const day = parseInt(matches[4], 10);

    if (_.isNaN(year) || year < 1970) {
      //
      if (this.now().getMonth() + 1 >= 11 && month <= 2) {
        year = this.now().getFullYear() + 1;
      } else if (this.now().getMonth() + 1 <= 2 && month >= 11) {
        year = this.now().getFullYear() - 1;
      } else {
        year = this.now().getFullYear();
      }
    }

    return [year, month, day];
  }

  // 日付と時間の配列から、Dateオブジェクトを生成
  static normalizeDateTime(date: number[] | null, time: number[]) {
    // 時間だけの場合は日付を補完する
    if (date) {
      if (!time) date = null;
    } else {
      date = [
        this.now().getFullYear(),
        this.now().getMonth() + 1,
        this.now().getDate(),
      ];
      if (!time) {
        time = [this.now().getHours(), this.now().getMinutes()];
      }
    }

    // 日付を指定したけど、時間を書いてない場合は扱わない
    if (date && time) {
      return new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0);
    } else {
      return null;
    }
  }

  // 日時をいれてparseする
  static parseDateTime(str: string) {
    const date = this.parseDate(str);
    const time = this.parseTime(str);
    if (!date) return null;
    if (time) {
      return new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0);
    } else {
      return new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
    }
  }

  // Dateから日付部分だけを取り出す
  static toDate(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
  }

  // 曜日を解析
  static parseWday(str: string) {
    str = String(str).replace(/曜日/g, '');
    const result = [];
    const wdays = [
      /(sun|日)/i,
      /(mon|月)/i,
      /(tue|火)/i,
      /(wed|水)/i,
      /(thu|木)/i,
      /(fri|金)/i,
      /(sat|土)/i,
    ];
    for (let i = 0; i < wdays.length; ++i) {
      if (str.match(wdays[i])) result.push(i);
    }
    return result;
  }

  static format(format: string, date: GoogleAppsScript.Base.Date) {
    const pad = (str: string) => str.substr(-2, 2);
    const padZero = (str: string) => pad('0' + str);
    const replaceChars = {
      Y: function (this: GoogleAppsScript.Base.Date) {
        return this.getFullYear() + '';
      },
      y: function (this: GoogleAppsScript.Base.Date) {
        return pad(this.getFullYear() + '');
      },
      m: function (this: GoogleAppsScript.Base.Date) {
        return padZero(this.getMonth() + 1 + '');
      },
      d: function (this: GoogleAppsScript.Base.Date) {
        return padZero(this.getDate() + '');
      },
      H: function (this: GoogleAppsScript.Base.Date) {
        return padZero(this.getHours() + '');
      },
      M: function (this: GoogleAppsScript.Base.Date) {
        return padZero(this.getMinutes() + '');
      },
      s: function (this: GoogleAppsScript.Base.Date) {
        return padZero(this.getSeconds() + '');
      },
    };
    let result = '';

    for (let i = 0; i < format.length; i++) {
      const curChar = format.charAt(i);
      if (curChar in replaceChars) {
        result += replaceChars[curChar as keyof typeof replaceChars].call(date);
      } else {
        result += curChar;
      }
    }
    return result;
  }

  private static _toHalfWidth(fullWidth: string) {
    return fullWidth
      .toLowerCase()
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      );
  }
}
