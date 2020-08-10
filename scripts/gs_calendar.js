// カレンダーテンプレート
// GSCalendar = loadGSCalendar();

loadGSCalendar = function () {
  var GSCalendar = function (spreadsheet, settings) {
    this.spreadsheet = spreadsheet;
    this.settings = settings;

    // メッセージテンプレート設定 
    this.sheet = this.spreadsheet.getSheetByName('_カレンダー');
    if (!this.sheet) {
      this.sheet = this.spreadsheet.insertSheet('_カレンダー');
      if (!this.sheet) {
        throw "エラー: メッセージシートを作れませんでした";
      }
    }
  };

  GSCalendar.prototype.setupCalendar = function () {
    var settings = this.settings;
    var startDate = this.getStartDate();
    // 休日を設定 (iCal)
    var calendarId = 'ja.japanese#holiday@group.v.calendar.google.com';
    var calendar = CalendarApp.getCalendarById(calendarId);
    console.log(startDate);
    var endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth());
    var holidays = _.map(calendar.getEvents(startDate, endDate), function (ev) {
      return DateUtils.format("Y-m-d", ev.getAllDayStartDate());
    });
    settings.set('休日', holidays.join(', '));
    settings.setNote('休日', '日付を,区切りで。来年までは自動設定されているので、以後は適当に更新してください');
    endDate.setDate(endDate.getDate() - 1);
    settings.set('最終日', DateUtils.format("Y-m-d", endDate))
    settings.setNote('最終日', '年度の最終日。この日以降はエラーが出ます。');
  };
  /** setup Calendars */
  GSCalendar.prototype.updateWorkdays = function () {
    this.spreadsheet.delteSheet(this.sheet);
    this.sheet = this.spreadsheet.insertSheet('_カレンダー');
  };
  /** getStartDate */
  GSCalendar.prototype.getStartDate = function () {
    var startMonth = Number(this.settings.get('開始月'));
    if (!startMonth) {
      startMonth = 4;
    }
    var startDate = new Date(DateUtils.now().getFullYear(), (startMonth - 1));
    // use last year if the referencing date is future date
    if (startDate > new Date()) {
      startDate = new Date(DateUtils.now().getFullYear() - 1, (startMonth - 1));
    }
    return startDate;
  }

  return GSCalendar;
};


if (typeof exports !== 'undefined') {
  exports.GSCalendar = loadGSCalendar();
}