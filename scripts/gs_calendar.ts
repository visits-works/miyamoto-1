// カレンダーテンプレート
import { GSProperties } from './gs_properties';
import { DateUtils } from './date_utils';
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

export class GSCalendar {
  sheet: GoogleAppsScript.Spreadsheet.Sheet | null;
  constructor(
    readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    readonly settings: GSProperties
  ) {
    // メッセージテンプレート設定
    this.sheet = this.spreadsheet.getSheetByName('_勤務日数');
    if (this.sheet) {
      return;
    }

    // this.sheet がないとき
    this.sheet = this.spreadsheet.insertSheet('_勤務日数');
    if (!this.sheet) {
      throw 'エラー: メッセージシートを作れませんでした';
    }
  }
  setupCalendar() {
    const settings = this.settings;
    const startDate = this.getStartDate();
    // 休日を設定 (iCal)
    const calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
    const calendar = CalendarApp.getCalendarById(calendarId);
    const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth());

    const holidays = _.map(
      calendar.getEvents(startDate, endDate),
      function (ev) {
        return DateUtils.format('Y-m-d', ev.getAllDayStartDate());
      }
    );
    settings.set('休日', holidays.join(', '));
    settings.setNote(
      '休日',
      '日付を,区切りで。来年までは自動設定されているので、以後は再度 updateCalendar() を実行してください。'
    );
    endDate.setDate(endDate.getDate() - 1);
    settings.set('最終日', DateUtils.format('Y-m-d', endDate));
    settings.setNote('最終日', '年度の最終日。この日以降はエラーが出ます。');
    if (!settings.get('追加休日')) {
      settings.set(
        '追加休日',
        [
          startDate.getFullYear() + '-12-29',
          startDate.getFullYear() + '-12-30',
          startDate.getFullYear() + '-12-31',
          startDate.getFullYear() + 1 + '-01-01',
          startDate.getFullYear() + 1 + '-01-02',
          startDate.getFullYear() + 1 + '-01-03',
        ].join(', ')
      );
    }
    settings.setNote(
      '追加休日',
      '追加の休日です。年末年始などをカンマ区切りで入力してください。変更したら、再度 updateCalendar() を実行してください。'
    );
    this.updateWorkdays();
  }
  /** setup Calendars */
  updateWorkdays() {
    this.spreadsheet.deleteSheet(this.sheet!);
    this.sheet = this.spreadsheet.insertSheet('_勤務日数');
    const startDate = this.getStartDate();
    const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth());
    const holidays =
      this.settings.get('休日') + ',' + this.settings.get('追加休日');
    let workDays = 0;
    const values = [];
    while (startDate < endDate) {
      if (
        startDate.getDay() === 0 ||
        startDate.getDay() === 6 ||
        holidays.indexOf(DateUtils.format('Y-m-d', startDate)) > -1
      ) {
        // holiday
      } else {
        workDays += 1;
      }
      const currentMonth = startDate.getMonth();
      const ym = DateUtils.format('Y-m', startDate);
      startDate.setDate(startDate.getDate() + 1);
      if (startDate.getMonth() != currentMonth) {
        values.push([ym, workDays]);
        workDays = 0;
      }
    }
    this.sheet.getRange(1, 1, values.length, 2).setValues(values);
  }
  /** getStartDate */
  getStartDate() {
    let startMonth = Number(this.settings.get('開始月'));
    if (!startMonth) {
      startMonth = 4;
    }
    let startDate = new Date(DateUtils.now().getFullYear(), startMonth - 1);
    // use last year if the referencing date is future date
    if (startDate > new Date()) {
      startDate = new Date(DateUtils.now().getFullYear() - 1, startMonth - 1);
    }
    return startDate;
  }
}
