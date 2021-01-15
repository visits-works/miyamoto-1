// KVS

import { DateUtils } from './date_utils';
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

declare var defaultValue: string;

export class GSProperties {
  sheet: GoogleAppsScript.Spreadsheet.Sheet | null;
  constructor(readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    // 初期設定
    this.sheet = spreadsheet.getSheetByName('_設定');
    if (!this.sheet) {
      this.sheet = spreadsheet.insertSheet('_設定');
    }
  }

  get(key: any) {
    if (this.sheet!.getLastRow() < 1) return defaultValue;

    const vals = _.find(
      this.sheet!.getRange('A1:B' + this.sheet!.getLastRow()).getValues(),
      function (v) {
        return v[0] == key;
      }
    );
    if (vals) {
      if (_.isDate(vals[1])) {
        return DateUtils.format('Y-m-d H:M:s', vals[1]);
      } else {
        return String(vals[1]);
      }
    } else {
      return null;
    }
  }

  set(key: any, val: any) {
    if (!this.sheet) {
      throw new Error('this.sheet is falsy');
    }

    if (this.sheet.getLastRow() > 0) {
      var vals = this.sheet
        .getRange('A1:A' + this.sheet.getLastRow())
        .getValues();
      for (var i = 0; i < this.sheet.getLastRow(); ++i) {
        if (vals[i][0] == key) {
          this.sheet.getRange('B' + (i + 1)).setValue(String(val));
          return val;
        }
      }
    }
    this.sheet
      .getRange(
        'A' +
          (this.sheet.getLastRow() + 1) +
          ':B' +
          (this.sheet.getLastRow() + 1)
      )
      .setValues([[key, val]]);
    return val;
  }
  setNote(key: any, note: any) {
    if (!this.sheet) {
      throw new Error('this.sheet is falsy');
    }

    if (this.sheet.getLastRow() > 0) {
      var vals = this.sheet
        .getRange('A1:A' + this.sheet.getLastRow())
        .getValues();
      for (var i = 0; i < this.sheet.getLastRow(); ++i) {
        if (vals[i][0] == key) {
          this.sheet.getRange('D' + (i + 1)).setValue(note);
          return;
        }
      }
    }
    this.sheet
      .getRange(
        'A' +
          (this.sheet.getLastRow() + 1) +
          ':D' +
          (this.sheet.getLastRow() + 1)
      )
      .setValues([[key, '', note]]);
    return;
  }
}
