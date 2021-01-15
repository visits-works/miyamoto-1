import QUnit from 'QUnit';
import { DateUtils } from '../../scripts/date_utils';
import { Timesheets } from '../../scripts/timesheets';
import { UnderscoreStatic } from 'underscore';
const _ = require('../../scripts/lib/underscorejs.js') as UnderscoreStatic;

QUnit.test('Timesheets', function (assert) {
  var responder = {
    messages: [] as any[],

    template: function (label) {
      const message = [label];
      for (var i = 1; i < arguments.length; i++) {
        message.push(arguments[i]);
      }
      this.messages.push(message);
    },

    on: function () {},

    // for testing
    clearMessages: function () {
      this.messages = [];
    },
  };

  var storage = {
    data: {},

    init: function (initData) {
      this.data = _.clone(initData || {});
    },

    get: function (username: string, date: Date) {
      if (!this.data[username]) this.data[username] = {};
      var dateStr = String(DateUtils.toDate(date));
      var row = this.data[username][dateStr];
      return row || { user: username };
    },

    set: function (username: string, date: Date, params: Record<string, any>) {
      var row = this.get(username, date);
      row.user = username;
      _.extend(row, _.pick(params, 'signIn', 'signOut', 'break', 'note'));
      this.data[username][String(DateUtils.toDate(date))] = row;
      return row;
    },

    getUsers: function () {
      return _.keys(this.data);
    },

    getByDate: function (date: Date) {
      return _.map(this.getUsers(), (username) => this.get(username, date));
    },

    getDayOff: function (username: string) {
      if (username === 'test1') {
        return [0, 6];
      } else {
        return [];
      }
    },
  };

  var settings = {
    values: {},
    get: function (key: any) {
      return this.values[key];
    },
    set: function (key: any, val: any) {
      return (this.values[key] = val);
    },
  };

  var msgTest = function (user: string, msg: string, expect_messages: any) {
    responder.clearMessages();
    timesheets.receiveMessage(user, msg);
    // assert.ok(_.isEqual(expect_messages, responder.messages), user + ':' + msg);
    assert.deepEqual(responder.messages, expect_messages, user + ':' + msg);
  };

  var storageTest = function (initData, callback) {
    callback(function (user: string, msg: string, result: any) {
      storage.init(initData);
      msgTest(user, msg, result);
    });
  };

  var mockDate = function (date, func) {
    if (!_.isDate(date)) {
      date = DateUtils.parseDateTime(date);
    }

    var _now = DateUtils.now();
    DateUtils.now(date);
    var result = func();
    DateUtils.now(_now);
    return result;
  };

  var timesheets = new Timesheets(
    storage as any,
    settings as any,
    responder as any
  );

  DateUtils.now(new Date(2014, 0, 2, 12, 34, 0));
  var nowDateStr = function () {
    return String(DateUtils.toDate(DateUtils.now()));
  };

  // 出勤
  storageTest({}, function (msgTest) {
    msgTest('test1', 'おはよう', [['出勤', 'test1', '2014/01/02 12:34']]);
    msgTest('test1', 'おはよう 4:56', [['出勤', 'test1', '2014/01/02 04:56']]);
    msgTest('test1', 'おはよう 4:56 2/3', [
      ['出勤', 'test1', '2014/02/03 04:56'],
    ]);
  });

  // 出勤時間の変更
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
  };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', 'おはよう', []);
    msgTest('test1', 'おはよう 4:56', [
      ['出勤更新', 'test1', '2014/01/02 04:56'],
    ]);
  });

  // 退勤
  storageTest({}, function (msgTest) {
    msgTest('test1', 'おつ', [['退勤', 'test1', '2014/01/02 12:34']]);
    msgTest('test1', 'お疲れさま 14:56', [
      ['退勤', 'test1', '2014/01/02 14:56'],
    ]);
    msgTest('test1', 'お疲れさま 16:23 12/3', [
      ['退勤', 'test1', '2013/12/03 16:23'],
    ]);
  });

  // 退勤時間の変更
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: new Date(2014, 0, 2, 12, 0, 0),
  };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', 'おつ', []);
    msgTest('test1', 'お疲れさま 14:56', [
      ['退勤更新', 'test1', '2014/01/02 14:56'],
    ]);
  });

  // 退勤時間の変更
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: new Date(2014, 0, 2, 12, 0, 0),
  };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', 'おつ', []);
    msgTest('test1', 'お疲れさま 14:56', [
      ['退勤更新', 'test1', '2014/01/02 14:56'],
    ]);
  });

  // 休憩時間(出勤前)
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: new Date(2014, 0, 2, 12, 0, 0),
  };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', '休憩 30分', [['休憩', 'test1', '30分']]);
  });

  // 休憩時間(出勤後)
  test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: new Date(2014, 0, 2, 12, 0, 0),
  };
  storageTest({}, function (msgTest) {
    msgTest('test1', '休憩 30分', [['休憩エラー', 'test1']]);
  });

  // 休暇申請
  storageTest({}, function (msgTest) {
    msgTest('test1', 'お休み', []);
    msgTest('test1', '今日はお休み', [['休暇', 'test1', '2014/01/02']]);
    msgTest('test1', '明日はお休み', [['休暇', 'test1', '2014/01/03']]);
    msgTest('test1', '12/3はお休みでした', [['休暇', 'test1', '2013/12/03']]);
  });

  // 休暇取消
  var test1 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: '-', singOut: '-' };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', 'お休みしません', []);
    msgTest('test1', '今日はお休みしません', [
      ['休暇取消', 'test1', '2014/01/02'],
    ]);
    msgTest('test1', '明日はお休みしません', [
      ['休暇取消', 'test1', '2014/01/03'],
    ]);
  });

  // 出勤確認
  storageTest({}, function (msgTest) {
    msgTest('test1', '誰がいる？', [['出勤なし']]);
  });

  // 出勤確認
  var test1 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: DateUtils.now() };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', '誰がいる？', [['出勤中', 'test1']]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: DateUtils.now() };
  test2[nowDateStr()] = { user: 'test2', signIn: DateUtils.now() };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がいる？', [['出勤中', 'test1, test2']]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: DateUtils.now(),
    signOut: DateUtils.now(),
  };
  test2[nowDateStr()] = { user: 'test2', signIn: DateUtils.now() };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がいる？', [['出勤中', 'test2']]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: DateUtils.now(),
    signOut: DateUtils.now(),
  };
  test2[nowDateStr()] = { user: 'test2', signIn: '-' };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がいる？', [['出勤なし']]);
  });

  // 休暇確認
  storageTest({}, function (msgTest) {
    msgTest('test1', '誰がお休み？', [['休暇なし', '2014/01/02']]);
  });

  // 出勤確認
  var test1 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: '-' };
  storageTest({ test1: test1 }, function (msgTest) {
    msgTest('test1', '誰がお休み？', [['休暇中', '2014/01/02', 'test1']]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: '-' };
  test2[nowDateStr()] = { user: 'test2', signIn: '-' };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がお休み？', [
      ['休暇中', '2014/01/02', 'test1, test2'],
    ]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = { user: 'test1', signIn: undefined };
  test2[nowDateStr()] = { user: 'test2', signIn: '-' };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がお休み？', [['休暇中', '2014/01/02', 'test2']]);
  });

  // 出勤確認
  var test1 = {},
    test2 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: DateUtils.now(),
    signOut: DateUtils.now(),
  };
  test2[nowDateStr()] = { user: 'test2', signIn: undefined };
  storageTest({ test1: test1, test2: test2 }, function (msgTest) {
    msgTest('test1', '誰がお休み？', [['休暇なし', '2014/01/02']]);
  });

  // 出勤確認
  storageTest({ test1: {}, test2: {} }, function (msgTest) {
    msgTest('test1', '__confirmSignIn__', [['出勤確認', ['test1', 'test2']]]);
  });

  // 休日は出勤確認を行わない
  settings.values = { 休日: '2014/01/02' };
  storageTest({ test1: {}, test2: {} }, function (msgTest) {
    msgTest('test1', '__confirmSignIn__', []);
  });
  settings.values = {};

  // 休日は出勤確認を行わない
  mockDate(new Date(2014, 0, 4, 0, 0, 0), function () {
    storageTest({ test1: {}, test2: {} }, function (msgTest) {
      msgTest('test1', '__confirmSignIn__', [['出勤確認', ['test2']]]);
    });
  });

  // 退勤確認
  storageTest({ test1: {}, test2: {} }, function (msgTest) {
    msgTest('test1', '__confirmSignOut__', []);
  });

  // 退勤確認
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: undefined,
  };
  storageTest({ test1: test1, test2: {} }, function (msgTest) {
    msgTest('test1', '__confirmSignOut__', [['退勤確認', ['test1']]]);
  });

  // 退勤確認
  var test1 = {};
  test1[nowDateStr()] = {
    user: 'test1',
    signIn: new Date(2014, 0, 2, 0, 0, 0),
    signOut: new Date(2014, 0, 2, 12, 0, 0),
  };
  storageTest({ test1: test1, test2: {} }, function (msgTest) {
    msgTest('test1', '__confirmSignOut__', []);
  });
});
