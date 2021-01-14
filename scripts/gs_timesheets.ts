// 入力内容を解析して、メソッドを呼び出す
import { GSProperties } from './gs_properties';
import { DateUtils } from './date_utils';
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

type Scheme = {
  columns: { name: string }[];
  properties: { name: string; value: string; comment: string }[];
};

export class GSTimesheets {
  private _sheets: Record<string, GoogleAppsScript.Spreadsheet.Sheet>;
  scheme: Scheme;
  constructor(
    readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    readonly settings: GSProperties
  ) {
    this._sheets = {};

    this.scheme = {
      columns: [
        { name: '日付' },
        { name: '出勤' },
        { name: '退勤' },
        { name: '休憩(分)' },
        { name: 'ノート' },
      ],
      properties: [
        {
          name: 'DayOff',
          value: '土,日',
          comment:
            '← 月,火,水みたいに入力してください。アカウント停止のためには「全部」と入れてください。',
        },
      ],
    };
  }
  private _getSheet(username: string) {
    if (this._sheets[username]) return this._sheets[username];

    const sheet = this.spreadsheet.getSheetByName(username);
    if (sheet) {
      this._sheets[username] = sheet;

      return sheet;
    }

    const newSheet = this.spreadsheet.insertSheet(username);
    if (!sheet) {
      throw new Error(`エラー:  ${username}のシートが作れませんでした`);
    }

    // 中身が無い場合は新規作成
    if (newSheet.getLastRow() == 0) {
      // 設定部の書き出し
      const properties = [
        ['Properties count', this.scheme.properties.length, null],
      ];
      this.scheme.properties.forEach((s) =>
        properties.push([s.name, s.value, s.comment])
      );
      newSheet.getRange(`A1:C${properties.length}`).setValues(properties);

      // ヘッダの書き出し
      const rowNo = properties.length + 2;
      const cols = this.scheme.columns.map((c) => c.name);
      newSheet
        .getRange(
          `A${rowNo}:${String.fromCharCode(65 + cols.length - 1)}${rowNo}`
        )
        .setValues([cols]);
    }
    //this.on("newUser", username);
    this._sheets[username] = sheet;

    return sheet;
  }
  private _getRowNo(username: string, date: Date = DateUtils.now()) {
    let rowNo = this.scheme.properties.length + 4;
    const startAt = DateUtils.parseDate(this.settings.get('開始日')!);
    const s = new Date(startAt![0], startAt![1] - 1, startAt![2], 0, 0, 0);
    rowNo +=
      (date.getTime() - date.getTimezoneOffset() * 60 * 1000) /
        (1000 * 24 * 60 * 60) -
      (s.getTime() - s.getTimezoneOffset() * 60 * 1000) / (1000 * 24 * 60 * 60);
    return rowNo;
  }
  get(username: string, date: Date) {
    const sheet = this._getSheet(username);
    const rowNo = this._getRowNo(username, date);
    const row = sheet
      .getRange(
        `A${rowNo}:${String.fromCharCode(
          65 + this.scheme.columns.length - 1
        )}${rowNo}`
      )
      .getValues()[0]
      .map((v) => (v === '' ? undefined : v));

    return {
      user: username,
      date: row[0],
      signIn: row[1],
      signOut: row[2],
      break: row[3],
      note: row[4],
    };
  }
  set(username: string, date: Date, params: Record<string, any>) {
    const row = this.get(username, date);

    _.extend(row, _.pick(params, 'signIn', 'signOut', 'break', 'note'));

    const sheet = this._getSheet(username);
    const rowNo = this._getRowNo(username, date);

    const data = [
      DateUtils.toDate(date),
      row.signIn,
      row.signOut,
      row.break,
      row.note,
    ].map((v) => v || '');
    sheet
      .getRange(
        `A${rowNo}:${String.fromCharCode(
          65 + this.scheme.columns.length - 1
        )}${rowNo}`
      )
      .setValues([data]);
    sheet.getRange(`B${rowNo}:C${rowNo}`).setNumberFormat('hh:mm');

    return row;
  }
  getUsers() {
    return _.compact(
      _.map(this.spreadsheet.getSheets(), (s) => {
        const name = s.getName();
        return name.substr(0, 1) === '_' ? undefined : name;
      })
    );
  }
  getByDate(date: Date) {
    return _.map(this.getUsers(), (username) => this.get(username, date));
  }
  // 休みの曜日を数字で返す
  getDayOff(username: string) {
    const sheet = this._getSheet(username);
    return DateUtils.parseWday(sheet.getRange('B2').getValue());
  }
}
