/*!
 * Miyamoto-san https://github.com/masuidrive/miyamoto/
 * (c) masuidrive 2014- License: MIT
 * -------------------
 */
var global = exports = {};
function migrate() {
}
function init() {
}
function doPost() {
}
function confirmSignIn() {
}
function confirmSignOut() {
}
function pushToBigQuery() {
}
function setUp() {
}
function updateCalendar() {
}(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./scripts/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./scripts/date_utils.ts":
/*!*******************************!*\
  !*** ./scripts/date_utils.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class DateUtils {
    // 今を返す
    static now(datetime) {
        if (typeof datetime !== 'undefined') {
            this._now = datetime;
        }
        return this._now;
    }
    static parseTime(_str = '') {
        // 大文字を小文字に
        const str = this._toHalfWidth(_str);
        const reg = /((\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|)|(am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|)|(\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm)|(\d{1,2})\s*時)/;
        const matches = str.match(reg);
        if (!matches) {
            return null;
        }
        let hour = 0, min = 0;
        const getHourAndMinute = (hour, minute = '0', isPM) => ({
            hour: Number.parseInt(hour, 10) + (isPM ? 12 : 0),
            min: Number.parseInt(minute, 10),
        });
        // (\d{1,2})\s*[:時]{1}\s*(\d{1,2})\s*(pm|) にマッチ
        // 1時20, 2:30, 3:00pm
        if (matches[2]) {
            ({ hour, min } = getHourAndMinute(matches[2], matches[3], _.contains(['pm'], matches[4])));
        }
        // (am|pm|午前|午後)\s*(\d{1,2})(\s*[:時]\s*(\d{1,2})|) にマッチ
        // 午後1 午後2時30 pm3
        if (matches[5]) {
            ({ hour, min } = getHourAndMinute(matches[6], matches[8], _.contains(['pm', '午後'], matches[5])));
        }
        // (\d{1,2})(\s*[:時]{1}\s*(\d{1,2})|)(am|pm) にマッチ
        // 1am 2:30pm
        if (matches[9]) {
            ({ hour, min } = getHourAndMinute(matches[9], matches[11], _.contains(['pm'], matches[12])));
        }
        // (\d{1,2})\s*時 にマッチ
        // 14時
        if (matches[13]) {
            ({ hour, min } = getHourAndMinute(matches[13], '0', false));
        }
        return [hour, min];
    }
    // テキストから休憩時間を抽出
    static parseMinutes(_str = '') {
        // 大文字を小文字に
        const str = this._toHalfWidth(_str);
        const reg = /(\d*.\d*\s*(分|minutes?|mins|時間|hour|hours))(\d*(分|minutes?|mins))?/;
        const matches = str.match(reg);
        if (!matches) {
            return null;
        }
        let hour = 0, min = 0;
        // 最初のマッチ
        if (matches[1]) {
            if (['時間', 'hour', 'hours'].includes(matches[2])) {
                // 1.5 時間
                hour = Number.parseFloat(matches[1]);
                // 2回めのマッチ
                if (matches[3]) {
                    min = Number.parseInt(matches[3], 10);
                }
            }
            else {
                // 60 分
                min = Number.parseInt(matches[1], 10);
            }
        }
        return [hour * 60 + min];
    }
    static parseDate(_str = '') {
        // 大文字を小文字に
        const str = this._toHalfWidth(_str);
        if (str.match(/(明日|tomorrow)/)) {
            const tomorrow = new Date(this.now().getFullYear(), this.now().getMonth(), this.now().getDate() + 1);
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
            const yesterday = new Date(this.now().getFullYear(), this.now().getMonth(), this.now().getDate() - 1);
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
            }
            else if (this.now().getMonth() + 1 <= 2 && month >= 11) {
                year = this.now().getFullYear() - 1;
            }
            else {
                year = this.now().getFullYear();
            }
        }
        return [year, month, day];
    }
    // 日付と時間の配列から、Dateオブジェクトを生成
    static normalizeDateTime(date, time) {
        // 時間だけの場合は日付を補完する
        if (date) {
            if (!time)
                date = null;
        }
        else {
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
        }
        else {
            return null;
        }
    }
    // 日時をいれてparseする
    static parseDateTime(str) {
        const date = this.parseDate(str);
        const time = this.parseTime(str);
        if (!date)
            return null;
        if (time) {
            return new Date(date[0], date[1] - 1, date[2], time[0], time[1], 0);
        }
        else {
            return new Date(date[0], date[1] - 1, date[2], 0, 0, 0);
        }
    }
    // Dateから日付部分だけを取り出す
    static toDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    }
    // 曜日を解析
    static parseWday(str) {
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
            if (str.match(wdays[i]))
                result.push(i);
        }
        return result;
    }
    static format(format, date) {
        const pad = (str) => str.substr(-2, 2);
        const padZero = (str) => pad('0' + str);
        const replaceChars = {
            Y: function () {
                return this.getFullYear() + '';
            },
            y: function () {
                return pad(this.getFullYear() + '');
            },
            m: function () {
                return padZero(this.getMonth() + 1 + '');
            },
            d: function () {
                return padZero(this.getDate() + '');
            },
            H: function () {
                return padZero(this.getHours() + '');
            },
            M: function () {
                return padZero(this.getMinutes() + '');
            },
            s: function () {
                return padZero(this.getSeconds() + '');
            },
        };
        let result = '';
        for (let i = 0; i < format.length; i++) {
            const curChar = format.charAt(i);
            if (curChar in replaceChars) {
                result += replaceChars[curChar].call(date);
            }
            else {
                result += curChar;
            }
        }
        return result;
    }
    static _toHalfWidth(fullWidth) {
        return fullWidth
            .toLowerCase()
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
    }
}
exports.DateUtils = DateUtils;
DateUtils._now = new Date();


/***/ }),

/***/ "./scripts/event_listener.ts":
/*!***********************************!*\
  !*** ./scripts/event_listener.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 日付関係の関数
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
class EventListener {
    constructor() {
        this._events = {};
    }
    // イベントを捕捉
    on(eventName, func) {
        if (this._events[eventName]) {
            this._events[eventName].push(func);
        }
        else {
            this._events[eventName] = [func];
        }
    }
    // イベント発行
    fireEvent(eventName, ...args) {
        var funcs = this._events[eventName];
        if (funcs) {
            for (var i = 0; i < funcs.length; ++i) {
                funcs[i].apply(this, args);
            }
        }
    }
}
exports.EventListener = EventListener;


/***/ }),

/***/ "./scripts/gas_properties.ts":
/*!***********************************!*\
  !*** ./scripts/gas_properties.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// KVS
// でも今回は使ってないです
Object.defineProperty(exports, "__esModule", { value: true });
exports.GASProperties = void 0;
class GASProperties {
    constructor() {
        this.properties = PropertiesService.getScriptProperties();
    }
    get(key) {
        return this.properties.getProperty(key);
    }
    set(key, val) {
        this.properties.setProperty(key, val);
        return val;
    }
}
exports.GASProperties = GASProperties;


/***/ }),

/***/ "./scripts/gas_utils.ts":
/*!******************************!*\
  !*** ./scripts/gas_utils.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Google Apps Script専用ユーティリティ
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdate = void 0;
const gas_properties_1 = __webpack_require__(/*! ./gas_properties */ "./scripts/gas_properties.ts");
// GASのログ出力をブラウザ互換にする
if (typeof console === 'undefined' && typeof Logger !== 'undefined') {
    // @ts-ignore
    console = {};
    console.log = function (...args) {
        Logger.log(args.join(', '));
    };
}
// サーバに新しいバージョンが無いかチェックする
function checkUpdate(responder) {
    const current_version = parseFloat(new gas_properties_1.GASProperties().get('version') || '0');
    const response = UrlFetchApp.fetch('https://raw.githubusercontent.com/georepublic/miyamoto/master/VERSION', { muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
        const latest_version = parseFloat(response.getContentText());
        if (latest_version > 0 && latest_version > current_version) {
            responder.send('Timesheet Script was updated. \nhttps://github.com/georepublic/miyamoto/blob/master/UPDATE.md を読んでください。');
            const response = UrlFetchApp.fetch('https://raw.githubusercontent.com/georepublic/miyamoto/master/HISTORY.md', { muteHttpExceptions: true });
            if (response.getResponseCode() === 200) {
                const text = response
                    .getContentText()
                    .replace(new RegExp('## ' + current_version + '[\\s\\S]*', 'm'), '');
                responder.send(text);
            }
        }
    }
}
exports.checkUpdate = checkUpdate;


/***/ }),

/***/ "./scripts/gs_bigquery.ts":
/*!********************************!*\
  !*** ./scripts/gs_bigquery.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GSBigQuery = void 0;
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class GSBigQuery {
    constructor(spreadsheet, prop) {
        this.spreadsheet = spreadsheet;
        // initialize
        this.projectID = prop.projectID;
        this.datasetID = prop.datasetID;
    }
    /**
     * push timesheet data to bigqurey table
     */
    pushTables() {
        console.log('push to bigquery ');
        // push all sheets
        _.map(this.spreadsheet.getSheets(), (s) => {
            const name = s.getName();
            if (name.substr(0, 1) !== '_') {
                this.pushTable(s);
            }
        });
    }
    /**
     *
     * @param sheet a sheet of Spreadsheet
     */
    pushTable(sheet) {
        var _a, _b, _c;
        const tableID = sheet.getName().replace('.', '_');
        // table schema
        const table = {
            tableReference: {
                projectId: this.projectID,
                datasetId: this.datasetID,
                tableId: tableID,
            },
            schema: {
                fields: [
                    {
                        name: 'work_date',
                        type: 'date',
                    },
                    {
                        name: 'start_working',
                        type: 'datetime',
                    },
                    {
                        name: 'end_working',
                        type: 'datetime',
                    },
                    {
                        name: 'break_time',
                        type: 'integer',
                    },
                    {
                        name: 'note',
                        type: 'string',
                    },
                    {
                        name: 'work_minutes',
                        type: 'integer',
                    },
                    {
                        name: 'holiday',
                        type: 'boolean',
                    },
                ],
            },
        };
        // remove table first
        try {
            (_a = Bigquery.Tables) === null || _a === void 0 ? void 0 : _a.remove(this.projectID, this.datasetID, tableID);
        }
        catch (e) { }
        /* table = */ (_b = Bigquery.Tables) === null || _b === void 0 ? void 0 : _b.insert(table, this.projectID, this.datasetID);
        // load data as CSV format
        const range = sheet.getDataRange();
        const blob = Utilities.newBlob(this.convCsv(range)).setContentType('application/octet-stream');
        // create job
        const job = {
            configuration: {
                load: {
                    destinationTable: {
                        projectId: this.projectID,
                        datasetId: this.datasetID,
                        tableId: tableID,
                    },
                },
            },
        };
        console.log('load data');
        // insert data
        /* job = */ (_c = Bigquery.Jobs) === null || _c === void 0 ? void 0 : _c.insert(job, this.projectID, blob);
    }
    convCsv(range) {
        try {
            const data = range.getValues();
            let csv = '';
            // read every rows
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    if (data[i][j].toString().indexOf(',') !== -1) {
                        data[i][j] = `"${data[i][j]}"`;
                    }
                }
                // if both of start and end time is set, load data
                if (data[i][0] instanceof GoogleAppsScript.Base.Date &&
                    data[i][1] instanceof GoogleAppsScript.Base.Date &&
                    data[i][2] instanceof GoogleAppsScript.Base.Date) {
                    const daycheck = data[i][0];
                    // format work_date and start/end time
                    data[i][0] = Utilities.formatDate(data[i][0], 'JST', 'yyyy-MM-dd');
                    // start/end time. use same date as working time for fixing data
                    data[i][1] =
                        data[i][0] + Utilities.formatDate(data[i][1], 'JST', ' HH:mm:ss');
                    daycheck.setDate(daycheck.getDate() + 1);
                    // if the end_date is the next day of the working day, it will be an overnight work.
                    if (Utilities.formatDate(daycheck, 'JST', 'yyyy-MM-dd') ===
                        Utilities.formatDate(data[i][2], 'JST', 'yyyy-MM-dd')) {
                        data[i][2] = Utilities.formatDate(data[i][2], 'JST', 'yyyy-MM-dd HH:mm:ss');
                    }
                    else {
                        data[i][2] =
                            data[i][0] + Utilities.formatDate(data[i][2], 'JST', ' HH:mm:ss');
                    }
                    // if no breaks, it makes 0 mins
                    if (!data[i][3]) {
                        data[i][3] = 0;
                    }
                    // calculate working minutes
                    data[i][5] =
                        (new Date(data[i][2]).getTime() - new Date(data[i][1]).getTime()) /
                            (60 * 1000) -
                            data[i][3];
                    // not holiday
                    data[i][6] = false;
                    while (data[i].length > 7) {
                        data[i].pop();
                    }
                    csv += data[i].join(',') + '\r\n';
                }
                else if (data[i][0] instanceof GoogleAppsScript.Base.Date &&
                    data[i][1] == '-' &&
                    data[i][2] == '-') {
                    // log holidays
                    // format work_date
                    data[i][0] = Utilities.formatDate(data[i][0], 'JST', 'yyyy-MM-dd');
                    data[i][1] = null;
                    data[i][2] = null;
                    data[i][3] = 0;
                    data[i][5] = 0;
                    // holiday
                    data[i][6] = true;
                    while (data[i].length > 7) {
                        data[i].pop();
                    }
                    csv += data[i].join(',') + '\r\n';
                }
            }
            return csv;
        }
        catch (e) {
            Logger.log(e);
            return;
        }
    }
    /**
     *
     * @param sheet a sheet of Spreadsheet
     */
    pushWorkDays() {
        var _a, _b, _c;
        const tableID = 'workdays';
        // table schema
        const table = {
            tableReference: {
                projectId: this.projectID,
                datasetId: this.datasetID,
                tableId: tableID,
            },
            schema: {
                fields: [
                    {
                        name: 'work_month',
                        type: 'string',
                    },
                    {
                        name: 'work_days',
                        type: 'integer',
                    },
                ],
            },
        };
        // remove table first
        try {
            (_a = Bigquery.Tables) === null || _a === void 0 ? void 0 : _a.remove(this.projectID, this.datasetID, tableID);
        }
        catch (e) { }
        /* table = */ (_b = Bigquery.Tables) === null || _b === void 0 ? void 0 : _b.insert(table, this.projectID, this.datasetID);
        // load data as CSV format
        const sheet = this.spreadsheet.getSheetByName('_勤務日数');
        const range = sheet.getDataRange();
        const blob = Utilities.newBlob(this.convWorkDayCsv(range)).setContentType('application/octet-stream');
        // create job
        const job = {
            configuration: {
                load: {
                    destinationTable: {
                        projectId: this.projectID,
                        datasetId: this.datasetID,
                        tableId: tableID,
                    },
                },
            },
        };
        console.log('load data');
        // insert data
        /* job = */ (_c = Bigquery.Jobs) === null || _c === void 0 ? void 0 : _c.insert(job, this.projectID, blob);
    }
    convWorkDayCsv(range) {
        try {
            const data = range.getValues();
            let csv = '';
            // read every rows
            for (let i = 0; i < data.length; i++) {
                data[i][0] = Utilities.formatDate(data[i][0], 'JST', 'yyyy-MM');
                csv += data[i].join(',') + '\r\n';
            }
            return csv;
        }
        catch (e) {
            Logger.log(e);
            return;
        }
    }
}
exports.GSBigQuery = GSBigQuery;


/***/ }),

/***/ "./scripts/gs_calendar.ts":
/*!********************************!*\
  !*** ./scripts/gs_calendar.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GSCalendar = void 0;
const date_utils_1 = __webpack_require__(/*! ./date_utils */ "./scripts/date_utils.ts");
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class GSCalendar {
    constructor(spreadsheet, settings) {
        this.spreadsheet = spreadsheet;
        this.settings = settings;
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
        const holidays = _.map(calendar.getEvents(startDate, endDate), function (ev) {
            return date_utils_1.DateUtils.format('Y-m-d', ev.getAllDayStartDate());
        });
        settings.set('休日', holidays.join(', '));
        settings.setNote('休日', '日付を,区切りで。来年までは自動設定されているので、以後は再度 updateCalendar() を実行してください。');
        endDate.setDate(endDate.getDate() - 1);
        settings.set('最終日', date_utils_1.DateUtils.format('Y-m-d', endDate));
        settings.setNote('最終日', '年度の最終日。この日以降はエラーが出ます。');
        if (!settings.get('追加休日')) {
            settings.set('追加休日', [
                startDate.getFullYear() + '-12-29',
                startDate.getFullYear() + '-12-30',
                startDate.getFullYear() + '-12-31',
                startDate.getFullYear() + 1 + '-01-01',
                startDate.getFullYear() + 1 + '-01-02',
                startDate.getFullYear() + 1 + '-01-03',
            ].join(', '));
        }
        settings.setNote('追加休日', '追加の休日です。年末年始などをカンマ区切りで入力してください。変更したら、再度 updateCalendar() を実行してください。');
        this.updateWorkdays();
    }
    /** setup Calendars */
    updateWorkdays() {
        this.spreadsheet.deleteSheet(this.sheet);
        this.sheet = this.spreadsheet.insertSheet('_勤務日数');
        const startDate = this.getStartDate();
        const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth());
        const holidays = this.settings.get('休日') + ',' + this.settings.get('追加休日');
        let workDays = 0;
        const values = [];
        while (startDate < endDate) {
            if (startDate.getDay() === 0 ||
                startDate.getDay() === 6 ||
                holidays.indexOf(date_utils_1.DateUtils.format('Y-m-d', startDate)) > -1) {
                // holiday
            }
            else {
                workDays += 1;
            }
            const currentMonth = startDate.getMonth();
            const ym = date_utils_1.DateUtils.format('Y-m', startDate);
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
        let startDate = new Date(date_utils_1.DateUtils.now().getFullYear(), startMonth - 1);
        // use last year if the referencing date is future date
        if (startDate > new Date()) {
            startDate = new Date(date_utils_1.DateUtils.now().getFullYear() - 1, startMonth - 1);
        }
        return startDate;
    }
}
exports.GSCalendar = GSCalendar;


/***/ }),

/***/ "./scripts/gs_properties.ts":
/*!**********************************!*\
  !*** ./scripts/gs_properties.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// KVS
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSProperties = void 0;
const date_utils_1 = __webpack_require__(/*! ./date_utils */ "./scripts/date_utils.ts");
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class GSProperties {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        // 初期設定
        this.sheet = spreadsheet.getSheetByName('_設定');
        if (!this.sheet) {
            this.sheet = spreadsheet.insertSheet('_設定');
        }
    }
    get(key) {
        if (this.sheet.getLastRow() < 1)
            return defaultValue;
        const vals = _.find(this.sheet.getRange('A1:B' + this.sheet.getLastRow()).getValues(), function (v) {
            return v[0] == key;
        });
        if (vals) {
            if (_.isDate(vals[1])) {
                return date_utils_1.DateUtils.format('Y-m-d H:M:s', vals[1]);
            }
            else {
                return String(vals[1]);
            }
        }
        else {
            return null;
        }
    }
    set(key, val) {
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
            .getRange('A' +
            (this.sheet.getLastRow() + 1) +
            ':B' +
            (this.sheet.getLastRow() + 1))
            .setValues([[key, val]]);
        return val;
    }
    setNote(key, note) {
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
            .getRange('A' +
            (this.sheet.getLastRow() + 1) +
            ':D' +
            (this.sheet.getLastRow() + 1))
            .setValues([[key, '', note]]);
        return;
    }
}
exports.GSProperties = GSProperties;


/***/ }),

/***/ "./scripts/gs_template.ts":
/*!********************************!*\
  !*** ./scripts/gs_template.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GSTemplate = void 0;
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class GSTemplate {
    constructor(spreadsheet) {
        this.spreadsheet = spreadsheet;
        // メッセージテンプレート設定
        this.sheet = this.spreadsheet.getSheetByName('_メッセージ');
        if (this.sheet) {
            return;
        }
        // sheet がないとき
        this.sheet = this.spreadsheet.insertSheet('_メッセージ');
        if (!this.sheet) {
            throw new Error('エラー: メッセージシートを作れませんでした');
        }
        // const now = DateUtils.now();
        this.sheet.getRange('A1:P2').setValues([
            [
                '出勤',
                '出勤更新',
                '退勤',
                '退勤更新',
                '休憩',
                '休暇',
                '休暇取消',
                '出勤中',
                '出勤なし',
                '休暇中',
                '休暇なし',
                '出勤確認',
                '退勤確認',
                '休憩エラー',
                '退勤と休憩',
                '退勤更新と休憩',
            ],
            [
                '<@#1> Good morning (#2)!',
                '<@#1> I changed starting time to #2',
                '<@#1> Great work! (#2)',
                '<@#1> I changed leaving time to #2',
                '<@#1> I changed break time to #2',
                '<@#1> I registered a holiday for #2',
                '<@#1> I canceled holiday #2',
                '#1 is working',
                'All staffs are working',
                '#2 is having a holiday at #1',
                'No one is having a holiday at #1',
                'Is today holiday? #1',
                'Did you finish working today? #1',
                '[Error] You have not started working today!',
                '<@#1> Great work! I added 60 mins break for you (#2)',
                '<@#1> I changed leaving time to #2 and added 6 mins break for you',
            ],
        ]);
    }
    // テンプレートからメッセージを生成
    template(label, ...args) {
        const labels = this.sheet.getRange('A1:Z1').getValues()[0];
        for (var i = 0; i < labels.length; ++i) {
            if (labels[i] == label) {
                const template = _.sample(_.filter(_.map(this.sheet.getRange(String.fromCharCode(i + 65) + '2:' + String.fromCharCode(i + 65)).getValues(), function (v) {
                    return v[0];
                }), function (v) {
                    return !!v;
                }));
                let message = template;
                for (let i = 0; i < args.length; i++) {
                    let arg = args[i];
                    if (_.isArray(arg)) {
                        arg = _.map(arg, function (u) {
                            return '<@' + u + '>';
                        }).join(', ');
                    }
                    message = message.replace('#' + i + 1, arg);
                }
                return message;
            }
        }
        return Array.from(arguments).join(', ');
    }
}
exports.GSTemplate = GSTemplate;


/***/ }),

/***/ "./scripts/gs_timesheets.ts":
/*!**********************************!*\
  !*** ./scripts/gs_timesheets.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GSTimesheets = void 0;
const date_utils_1 = __webpack_require__(/*! ./date_utils */ "./scripts/date_utils.ts");
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class GSTimesheets {
    constructor(spreadsheet, settings) {
        this.spreadsheet = spreadsheet;
        this.settings = settings;
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
                    comment: '← 月,火,水みたいに入力してください。アカウント停止のためには「全部」と入れてください。',
                },
            ],
        };
    }
    _getSheet(username) {
        if (this._sheets[username])
            return this._sheets[username];
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
            this.scheme.properties.forEach((s) => properties.push([s.name, s.value, s.comment]));
            newSheet.getRange(`A1:C${properties.length}`).setValues(properties);
            // ヘッダの書き出し
            const rowNo = properties.length + 2;
            const cols = this.scheme.columns.map((c) => c.name);
            newSheet
                .getRange(`A${rowNo}:${String.fromCharCode(65 + cols.length - 1)}${rowNo}`)
                .setValues([cols]);
        }
        //this.on("newUser", username);
        this._sheets[username] = sheet;
        return sheet;
    }
    _getRowNo(username, date = date_utils_1.DateUtils.now()) {
        let rowNo = this.scheme.properties.length + 4;
        const startAt = date_utils_1.DateUtils.parseDate(this.settings.get('開始日'));
        const s = new Date(startAt[0], startAt[1] - 1, startAt[2], 0, 0, 0);
        rowNo +=
            (date.getTime() - date.getTimezoneOffset() * 60 * 1000) /
                (1000 * 24 * 60 * 60) -
                (s.getTime() - s.getTimezoneOffset() * 60 * 1000) / (1000 * 24 * 60 * 60);
        return rowNo;
    }
    get(username, date) {
        const sheet = this._getSheet(username);
        const rowNo = this._getRowNo(username, date);
        const row = sheet
            .getRange(`A${rowNo}:${String.fromCharCode(65 + this.scheme.columns.length - 1)}${rowNo}`)
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
    set(username, date, params) {
        const row = this.get(username, date);
        _.extend(row, _.pick(params, 'signIn', 'signOut', 'break', 'note'));
        const sheet = this._getSheet(username);
        const rowNo = this._getRowNo(username, date);
        const data = [
            date_utils_1.DateUtils.toDate(date),
            row.signIn,
            row.signOut,
            row.break,
            row.note,
        ].map((v) => v || '');
        sheet
            .getRange(`A${rowNo}:${String.fromCharCode(65 + this.scheme.columns.length - 1)}${rowNo}`)
            .setValues([data]);
        sheet.getRange(`B${rowNo}:C${rowNo}`).setNumberFormat('hh:mm');
        return row;
    }
    getUsers() {
        return _.compact(_.map(this.spreadsheet.getSheets(), (s) => {
            const name = s.getName();
            return name.substr(0, 1) === '_' ? undefined : name;
        }));
    }
    getByDate(date) {
        return _.map(this.getUsers(), (username) => this.get(username, date));
    }
    // 休みの曜日を数字で返す
    getDayOff(username) {
        const sheet = this._getSheet(username);
        return date_utils_1.DateUtils.parseWday(sheet.getRange('B2').getValue());
    }
}
exports.GSTimesheets = GSTimesheets;


/***/ }),

/***/ "./scripts/lib/underscorejs.js":
/*!*************************************!*\
  !*** ./scripts/lib/underscorejs.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r=Array.prototype,e=Object.prototype,u=Function.prototype,i=r.push,a=r.slice,o=r.concat,l=e.toString,c=e.hasOwnProperty,f=Array.isArray,s=Object.keys,p=u.bind,h=function(n){return n instanceof h?n:this instanceof h?void(this._wrapped=n):new h(n)}; true?( true&&module.exports&&(exports=module.exports=h),exports._=h):undefined,h.VERSION="1.7.0";var g=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}};h.iteratee=function(n,t,r){return null==n?h.identity:h.isFunction(n)?g(n,t,r):h.isObject(n)?h.matches(n):h.property(n)},h.each=h.forEach=function(n,t,r){if(null==n)return n;t=g(t,r);var e,u=n.length;if(u===+u)for(e=0;u>e;e++)t(n[e],e,n);else{var i=h.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},h.map=h.collect=function(n,t,r){if(null==n)return[];t=h.iteratee(t,r);for(var e,u=n.length!==+n.length&&h.keys(n),i=(u||n).length,a=Array(i),o=0;i>o;o++)e=u?u[o]:o,a[o]=t(n[e],e,n);return a};var v="Reduce of empty array with no initial value";h.reduce=h.foldl=h.inject=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length,o=0;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[o++]:o++]}for(;a>o;o++)u=i?i[o]:o,r=t(r,n[u],u,n);return r},h.reduceRight=h.foldr=function(n,t,r,e){null==n&&(n=[]),t=g(t,e,4);var u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;if(arguments.length<3){if(!a)throw new TypeError(v);r=n[i?i[--a]:--a]}for(;a--;)u=i?i[a]:a,r=t(r,n[u],u,n);return r},h.find=h.detect=function(n,t,r){var e;return t=h.iteratee(t,r),h.some(n,function(n,r,u){return t(n,r,u)?(e=n,!0):void 0}),e},h.filter=h.select=function(n,t,r){var e=[];return null==n?e:(t=h.iteratee(t,r),h.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e)},h.reject=function(n,t,r){return h.filter(n,h.negate(h.iteratee(t)),r)},h.every=h.all=function(n,t,r){if(null==n)return!0;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,!t(n[u],u,n))return!1;return!0},h.some=h.any=function(n,t,r){if(null==n)return!1;t=h.iteratee(t,r);var e,u,i=n.length!==+n.length&&h.keys(n),a=(i||n).length;for(e=0;a>e;e++)if(u=i?i[e]:e,t(n[u],u,n))return!0;return!1},h.contains=h.include=function(n,t){return null==n?!1:(n.length!==+n.length&&(n=h.values(n)),h.indexOf(n,t)>=0)},h.invoke=function(n,t){var r=a.call(arguments,2),e=h.isFunction(t);return h.map(n,function(n){return(e?t:n[t]).apply(n,r)})},h.pluck=function(n,t){return h.map(n,h.property(t))},h.where=function(n,t){return h.filter(n,h.matches(t))},h.findWhere=function(n,t){return h.find(n,h.matches(t))},h.max=function(n,t,r){var e,u,i=-1/0,a=-1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],e>i&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(u>a||u===-1/0&&i===-1/0)&&(i=n,a=u)});return i},h.min=function(n,t,r){var e,u,i=1/0,a=1/0;if(null==t&&null!=n){n=n.length===+n.length?n:h.values(n);for(var o=0,l=n.length;l>o;o++)e=n[o],i>e&&(i=e)}else t=h.iteratee(t,r),h.each(n,function(n,r,e){u=t(n,r,e),(a>u||1/0===u&&1/0===i)&&(i=n,a=u)});return i},h.shuffle=function(n){for(var t,r=n&&n.length===+n.length?n:h.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=h.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},h.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=h.values(n)),n[h.random(n.length-1)]):h.shuffle(n).slice(0,Math.max(0,t))},h.sortBy=function(n,t,r){return t=h.iteratee(t,r),h.pluck(h.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var m=function(n){return function(t,r,e){var u={};return r=h.iteratee(r,e),h.each(t,function(e,i){var a=r(e,i,t);n(u,e,a)}),u}};h.groupBy=m(function(n,t,r){h.has(n,r)?n[r].push(t):n[r]=[t]}),h.indexBy=m(function(n,t,r){n[r]=t}),h.countBy=m(function(n,t,r){h.has(n,r)?n[r]++:n[r]=1}),h.sortedIndex=function(n,t,r,e){r=h.iteratee(r,e,1);for(var u=r(t),i=0,a=n.length;a>i;){var o=i+a>>>1;r(n[o])<u?i=o+1:a=o}return i},h.toArray=function(n){return n?h.isArray(n)?a.call(n):n.length===+n.length?h.map(n,h.identity):h.values(n):[]},h.size=function(n){return null==n?0:n.length===+n.length?n.length:h.keys(n).length},h.partition=function(n,t,r){t=h.iteratee(t,r);var e=[],u=[];return h.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},h.first=h.head=h.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:a.call(n,0,t)},h.initial=function(n,t,r){return a.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},h.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:a.call(n,Math.max(n.length-t,0))},h.rest=h.tail=h.drop=function(n,t,r){return a.call(n,null==t||r?1:t)},h.compact=function(n){return h.filter(n,h.identity)};var y=function(n,t,r,e){if(t&&h.every(n,h.isArray))return o.apply(e,n);for(var u=0,a=n.length;a>u;u++){var l=n[u];h.isArray(l)||h.isArguments(l)?t?i.apply(e,l):y(l,t,r,e):r||e.push(l)}return e};h.flatten=function(n,t){return y(n,t,!1,[])},h.without=function(n){return h.difference(n,a.call(arguments,1))},h.uniq=h.unique=function(n,t,r,e){if(null==n)return[];h.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=h.iteratee(r,e));for(var u=[],i=[],a=0,o=n.length;o>a;a++){var l=n[a];if(t)a&&i===l||u.push(l),i=l;else if(r){var c=r(l,a,n);h.indexOf(i,c)<0&&(i.push(c),u.push(l))}else h.indexOf(u,l)<0&&u.push(l)}return u},h.union=function(){return h.uniq(y(arguments,!0,!0,[]))},h.intersection=function(n){if(null==n)return[];for(var t=[],r=arguments.length,e=0,u=n.length;u>e;e++){var i=n[e];if(!h.contains(t,i)){for(var a=1;r>a&&h.contains(arguments[a],i);a++);a===r&&t.push(i)}}return t},h.difference=function(n){var t=y(a.call(arguments,1),!0,!0,[]);return h.filter(n,function(n){return!h.contains(t,n)})},h.zip=function(n){if(null==n)return[];for(var t=h.max(arguments,"length").length,r=Array(t),e=0;t>e;e++)r[e]=h.pluck(arguments,e);return r},h.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},h.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=h.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}for(;u>e;e++)if(n[e]===t)return e;return-1},h.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=n.length;for("number"==typeof r&&(e=0>r?e+r+1:Math.min(e,r+1));--e>=0;)if(n[e]===t)return e;return-1},h.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var d=function(){};h.bind=function(n,t){var r,e;if(p&&n.bind===p)return p.apply(n,a.call(arguments,1));if(!h.isFunction(n))throw new TypeError("Bind must be called on a function");return r=a.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(a.call(arguments)));d.prototype=n.prototype;var u=new d;d.prototype=null;var i=n.apply(u,r.concat(a.call(arguments)));return h.isObject(i)?i:u}},h.partial=function(n){var t=a.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===h&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},h.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=h.bind(n[r],n);return n},h.memoize=function(n,t){var r=function(e){var u=r.cache,i=t?t.apply(this,arguments):e;return h.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},h.delay=function(n,t){var r=a.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},h.defer=function(n){return h.delay.apply(h,[n,1].concat(a.call(arguments,1)))},h.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var l=function(){o=r.leading===!1?0:h.now(),a=null,i=n.apply(e,u),a||(e=u=null)};return function(){var c=h.now();o||r.leading!==!1||(o=c);var f=t-(c-o);return e=this,u=arguments,0>=f||f>t?(clearTimeout(a),a=null,o=c,i=n.apply(e,u),a||(e=u=null)):a||r.trailing===!1||(a=setTimeout(l,f)),i}},h.debounce=function(n,t,r){var e,u,i,a,o,l=function(){var c=h.now()-a;t>c&&c>0?e=setTimeout(l,t-c):(e=null,r||(o=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,a=h.now();var c=r&&!e;return e||(e=setTimeout(l,t)),c&&(o=n.apply(i,u),i=u=null),o}},h.wrap=function(n,t){return h.partial(t,n)},h.negate=function(n){return function(){return!n.apply(this,arguments)}},h.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},h.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},h.before=function(n,t){var r;return function(){return--n>0?r=t.apply(this,arguments):t=null,r}},h.once=h.partial(h.before,2),h.keys=function(n){if(!h.isObject(n))return[];if(s)return s(n);var t=[];for(var r in n)h.has(n,r)&&t.push(r);return t},h.values=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},h.pairs=function(n){for(var t=h.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},h.invert=function(n){for(var t={},r=h.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},h.functions=h.methods=function(n){var t=[];for(var r in n)h.isFunction(n[r])&&t.push(r);return t.sort()},h.extend=function(n){if(!h.isObject(n))return n;for(var t,r,e=1,u=arguments.length;u>e;e++){t=arguments[e];for(r in t)c.call(t,r)&&(n[r]=t[r])}return n},h.pick=function(n,t,r){var e,u={};if(null==n)return u;if(h.isFunction(t)){t=g(t,r);for(e in n){var i=n[e];t(i,e,n)&&(u[e]=i)}}else{var l=o.apply([],a.call(arguments,1));n=new Object(n);for(var c=0,f=l.length;f>c;c++)e=l[c],e in n&&(u[e]=n[e])}return u},h.omit=function(n,t,r){if(h.isFunction(t))t=h.negate(t);else{var e=h.map(o.apply([],a.call(arguments,1)),String);t=function(n,t){return!h.contains(e,t)}}return h.pick(n,t,r)},h.defaults=function(n){if(!h.isObject(n))return n;for(var t=1,r=arguments.length;r>t;t++){var e=arguments[t];for(var u in e)n[u]===void 0&&(n[u]=e[u])}return n},h.clone=function(n){return h.isObject(n)?h.isArray(n)?n.slice():h.extend({},n):n},h.tap=function(n,t){return t(n),n};var b=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof h&&(n=n._wrapped),t instanceof h&&(t=t._wrapped);var u=l.call(n);if(u!==l.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]===n)return e[i]===t;var a=n.constructor,o=t.constructor;if(a!==o&&"constructor"in n&&"constructor"in t&&!(h.isFunction(a)&&a instanceof a&&h.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c,f;if("[object Array]"===u){if(c=n.length,f=c===t.length)for(;c--&&(f=b(n[c],t[c],r,e)););}else{var s,p=h.keys(n);if(c=p.length,f=h.keys(t).length===c)for(;c--&&(s=p[c],f=h.has(t,s)&&b(n[s],t[s],r,e)););}return r.pop(),e.pop(),f};h.isEqual=function(n,t){return b(n,t,[],[])},h.isEmpty=function(n){if(null==n)return!0;if(h.isArray(n)||h.isString(n)||h.isArguments(n))return 0===n.length;for(var t in n)if(h.has(n,t))return!1;return!0},h.isElement=function(n){return!(!n||1!==n.nodeType)},h.isArray=f||function(n){return"[object Array]"===l.call(n)},h.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},h.each(["Arguments","Function","String","Number","Date","RegExp"],function(n){h["is"+n]=function(t){return l.call(t)==="[object "+n+"]"}}),h.isArguments(arguments)||(h.isArguments=function(n){return h.has(n,"callee")}), true&&(h.isFunction=function(n){return"function"==typeof n||!1}),h.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},h.isNaN=function(n){return h.isNumber(n)&&n!==+n},h.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===l.call(n)},h.isNull=function(n){return null===n},h.isUndefined=function(n){return n===void 0},h.has=function(n,t){return null!=n&&c.call(n,t)},h.noConflict=function(){return n._=t,this},h.identity=function(n){return n},h.constant=function(n){return function(){return n}},h.noop=function(){},h.property=function(n){return function(t){return t[n]}},h.matches=function(n){var t=h.pairs(n),r=t.length;return function(n){if(null==n)return!r;n=new Object(n);for(var e=0;r>e;e++){var u=t[e],i=u[0];if(u[1]!==n[i]||!(i in n))return!1}return!0}},h.times=function(n,t,r){var e=Array(Math.max(0,n));t=g(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},h.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},h.now=Date.now||function(){return(new Date).getTime()};var _={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},w=h.invert(_),j=function(n){var t=function(t){return n[t]},r="(?:"+h.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};h.escape=j(_),h.unescape=j(w),h.result=function(n,t){if(null==n)return void 0;var r=n[t];return h.isFunction(r)?n[t]():r};var x=0;h.uniqueId=function(n){var t=++x+"";return n?n+t:t},h.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var A=/(.)^/,k={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},O=/\\|'|\r|\n|\u2028|\u2029/g,F=function(n){return"\\"+k[n]};h.template=function(n,t,r){!t&&r&&(t=r),t=h.defaults({},t,h.templateSettings);var e=RegExp([(t.escape||A).source,(t.interpolate||A).source,(t.evaluate||A).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,a,o){return i+=n.slice(u,o).replace(O,F),u=o+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":a&&(i+="';\n"+a+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var a=new Function(t.variable||"obj","_",i)}catch(o){throw o.source=i,o}var l=function(n){return a.call(this,n,h)},c=t.variable||"obj";return l.source="function("+c+"){\n"+i+"}",l},h.chain=function(n){var t=h(n);return t._chain=!0,t};var E=function(n){return this._chain?h(n).chain():n};h.mixin=function(n){h.each(h.functions(n),function(t){var r=h[t]=n[t];h.prototype[t]=function(){var n=[this._wrapped];return i.apply(n,arguments),E.call(this,r.apply(h,n))}})},h.mixin(h),h.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=r[n];h.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],E.call(this,r)}}),h.each(["concat","join","slice"],function(n){var t=r[n];h.prototype[n]=function(){return E.call(this,t.apply(this._wrapped,arguments))}}),h.prototype.value=function(){return this._wrapped}, true&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function(){return h}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}).call(this);
//# sourceMappingURL=underscore-min.map

/***/ }),

/***/ "./scripts/main.ts":
/*!*************************!*\
  !*** ./scripts/main.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = exports.updateCalendar = exports.setUp = exports.pushToBigQuery = exports.confirmSignOut = exports.confirmSignIn = exports.doPost = exports.init = void 0;
// 各モジュールの読み込み
const date_utils_1 = __webpack_require__(/*! ./date_utils */ "./scripts/date_utils.ts");
const gas_properties_1 = __webpack_require__(/*! ./gas_properties */ "./scripts/gas_properties.ts");
const gs_properties_1 = __webpack_require__(/*! ./gs_properties */ "./scripts/gs_properties.ts");
const gs_template_1 = __webpack_require__(/*! ./gs_template */ "./scripts/gs_template.ts");
const gs_timesheets_1 = __webpack_require__(/*! ./gs_timesheets */ "./scripts/gs_timesheets.ts");
const timesheets_1 = __webpack_require__(/*! ./timesheets */ "./scripts/timesheets.ts");
const slack_1 = __webpack_require__(/*! ./slack */ "./scripts/slack.ts");
const gs_bigquery_1 = __webpack_require__(/*! ./gs_bigquery */ "./scripts/gs_bigquery.ts");
const gs_calendar_1 = __webpack_require__(/*! ./gs_calendar */ "./scripts/gs_calendar.ts");
function init() {
    const global_settings = new gas_properties_1.GASProperties();
    const spreadsheetId = global_settings.get('spreadsheet');
    if (!spreadsheetId) {
        return null;
    }
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const settings = new gs_properties_1.GSProperties(spreadsheet);
    const template = new gs_template_1.GSTemplate(spreadsheet);
    const slack = new slack_1.Slack(settings.get('Slack Incoming URL'), template, settings);
    const storage = new gs_timesheets_1.GSTimesheets(spreadsheet, settings);
    const timesheets = new timesheets_1.Timesheets(storage, settings, slack);
    let bigquery;
    if (global_settings.get('bigQueryProjectID') &&
        global_settings.get('bigQueryDatasetID')) {
        bigquery = new gs_bigquery_1.GSBigQuery(spreadsheet, {
            projectID: global_settings.get('bigQueryProjectID'),
            datasetID: global_settings.get('bigQueryDatasetID'),
        });
    }
    return {
        receiver: slack,
        timesheets: timesheets,
        storage: storage,
        bigquery: bigquery,
    };
}
exports.init = init;
// SlackのOutgoingから来るメッセージ
function doPost(e) {
    if (e.parameters.user_name == undefined) {
        // data is undefined (Slack Event)
        const postJSON = JSON.parse(e.postData.getDataAsString());
        // verification Slack Event
        if (postJSON.type == 'url_verification') {
            let out = ContentService.createTextOutput();
            //Mime TypeをJSONに設定
            out.setMimeType(ContentService.MimeType.TEXT);
            //JSONテキストをセットする
            out.setContent(postJSON.challenge);
            return out;
        }
        else if (postJSON.event.subtype != 'bot_message') {
            const miyamoto = init();
            const userid = String(postJSON.event.user);
            const body = String(postJSON.event.text);
            const token = new gas_properties_1.GASProperties().get('SLACK_OAUTH_TOKEN');
            const ret = UrlFetchApp.fetch('https://slack.com/api/users.info?token=' + token + '&user=' + userid);
            var userdata = JSON.parse(ret.getContentText());
            miyamoto.receiver.receiveMessage(userdata.user.name, body);
        }
        return;
    }
    else {
        // data is defined (Outgoing web hook)
        const miyamoto = init();
        const username = String(e.parameters.user_name);
        const body = String(e.parameters['text']);
        miyamoto.receiver.receiveMessage(username, body);
        return;
    }
}
exports.doPost = doPost;
// Time-based triggerで実行
function confirmSignIn() {
    const miyamoto = init();
    miyamoto.timesheets.confirmSignIn();
}
exports.confirmSignIn = confirmSignIn;
// Time-based triggerで実行
function confirmSignOut() {
    const miyamoto = init();
    miyamoto.timesheets.confirmSignOut();
}
exports.confirmSignOut = confirmSignOut;
function pushToBigQuery() {
    const miyamoto = init();
    if (miyamoto.bigquery) {
        miyamoto.bigquery.pushTables();
    }
}
exports.pushToBigQuery = pushToBigQuery;
// 初期化する
function setUp() {
    // spreadsheetが無かったら初期化
    const global_settings = new gas_properties_1.GASProperties();
    if (!global_settings.get('spreadsheet')) {
        // タイムシートを作る
        const spreadsheet = SpreadsheetApp.create('Slack Timesheets');
        const sheets = spreadsheet.getSheets();
        if (sheets.length == 1 && sheets[0].getLastRow() == 0) {
            sheets[0].setName('_設定');
        }
        global_settings.set('spreadsheet', spreadsheet.getId());
        const settings = new gs_properties_1.GSProperties(spreadsheet);
        settings.set('Slack Incoming URL', '');
        settings.setNote('Slack Incoming URL', 'Slackのincoming URLを入力してください');
        settings.set('開始日', date_utils_1.DateUtils.format('Y-m-d', date_utils_1.DateUtils.now()));
        settings.setNote('開始日', '変更はしないでください');
        settings.set('無視するユーザ', 'miyamoto,hubot,slackbot,incoming-webhook');
        settings.setNote('無視するユーザ', '反応をしないユーザを,区切りで設定する。botは必ず指定してください。');
        settings.set('開始月', 4);
        settings.setNote('開始月', '年度の開始月。変更したら updateCalendar 関数を実行してください');
        const calender = new gs_calendar_1.GSCalendar(spreadsheet, settings);
        calender.setupCalendar();
        // メッセージ用のシートを作成
        new gs_template_1.GSTemplate(spreadsheet);
        // 毎日11時頃に出勤してるかチェックする
        ScriptApp.newTrigger('confirmSignIn')
            .timeBased()
            .everyDays(1)
            .atHour(11)
            .create();
        // 毎日22時頃に退勤してるかチェックする
        ScriptApp.newTrigger('confirmSignOut')
            .timeBased()
            .everyDays(1)
            .atHour(22)
            .create();
        // 毎日深夜5時頃に BigQuery テーブルを更新する
        ScriptApp.newTrigger('pushToBigQuery')
            .timeBased()
            .everyDays(1)
            .atHour(5)
            .create();
    }
}
exports.setUp = setUp;
/** update calendar */
function updateCalendar() {
    // const miyamoto = init();
    const global_settings = new gas_properties_1.GASProperties();
    const spreadsheetId = global_settings.get('spreadsheet');
    let spreadsheet, settings;
    if (spreadsheetId) {
        spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        settings = new gs_properties_1.GSProperties(spreadsheet);
    }
    else {
        console.error('Spreadsheet is not initialized');
        return;
    }
    const calender = new gs_calendar_1.GSCalendar(spreadsheet, settings);
    calender.setupCalendar();
    let bigquery;
    if (global_settings.get('bigQueryProjectID') &&
        global_settings.get('bigQueryDatasetID')) {
        bigquery = new gs_bigquery_1.GSBigQuery(spreadsheet, {
            projectID: global_settings.get('bigQueryProjectID'),
            datasetID: global_settings.get('bigQueryDatasetID'),
        });
        bigquery.pushWorkDays();
    }
}
exports.updateCalendar = updateCalendar;
/* バージョンアップ処理を行う */
function migrate() {
    const global_settings = new gas_properties_1.GASProperties();
    global_settings.set('version', '::VERSION::');
    console.log('バージョンアップが完了しました。');
}
exports.migrate = migrate;
/*
function test1(e) {
  var miyamoto = init();
  miyamoto.receiver.receiveMessage({user_name:"masuidrive", text:"hello 8:00"});
}
*/
global.migrate = exports.migrate;
global.init = exports.init;
global.doPost = exports.doPost;
global.confirmSignIn = exports.confirmSignIn;
global.confirmSignOut = exports.confirmSignOut;
global.pushToBigQuery = exports.pushToBigQuery;
global.setUp = exports.setUp;
global.updateCalendar = exports.updateCalendar;

/***/ }),

/***/ "./scripts/slack.ts":
/*!**************************!*\
  !*** ./scripts/slack.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Slackのインタフェース
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slack = void 0;
const event_listener_1 = __webpack_require__(/*! ./event_listener */ "./scripts/event_listener.ts");
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class Slack extends event_listener_1.EventListener {
    constructor(incomingURL, _template, settings) {
        super();
        this.incomingURL = incomingURL;
        this._template = _template;
        this.settings = settings;
    }
    // 受信したメッセージをtimesheetsに投げる
    receiveMessage(username, body) {
        // 特定のアカウントには反応しない
        const ignore_users = (this.settings.get('無視するユーザ') || '')
            .toLowerCase()
            .replace(/^\s*(.*?)\s*$/, '$1')
            .split(/\s*,\s*/);
        if (_.contains(ignore_users, username.toLowerCase()))
            return;
        // -で始まるメッセージも無視
        if (body.match(/^-/))
            return;
        this.fireEvent('receiveMessage', username, body);
    }
    // メッセージ送信
    send(message, options = {}) {
        options = _.clone(options);
        options['text'] = message;
        const send_options = {
            method: 'post',
            payload: { payload: JSON.stringify(options) },
        };
        if (this.incomingURL) {
            UrlFetchApp.fetch(this.incomingURL, send_options);
        }
        return message;
    }
    // テンプレート付きでメッセージ送信
    template(...args) {
        this.send(this._template.template.apply(this._template, [args.shift(), ...args]));
    }
}
exports.Slack = Slack;


/***/ }),

/***/ "./scripts/timesheets.ts":
/*!*******************************!*\
  !*** ./scripts/timesheets.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Timesheets = void 0;
const date_utils_1 = __webpack_require__(/*! ./date_utils */ "./scripts/date_utils.ts");
const gas_utils_1 = __webpack_require__(/*! ./gas_utils */ "./scripts/gas_utils.ts");
const _ = __webpack_require__(/*! ./lib/underscorejs */ "./scripts/lib/underscorejs.js");
class Timesheets {
    constructor(storage, settings, responder) {
        this.storage = storage;
        this.settings = settings;
        this.responder = responder;
        this.date = null;
        this.time = null;
        this.minutes = null;
        this.datetime = null;
        this.dateStr = '';
        this.datetimeStr = '';
        var self = this;
        this.responder.on('receiveMessage', function (username, message) {
            self.receiveMessage(username, message);
        });
    }
    // メッセージを受信する
    receiveMessage(username, message) {
        // 日付は先に処理しておく
        this.date = date_utils_1.DateUtils.parseDate(message);
        this.time = date_utils_1.DateUtils.parseTime(message);
        this.minutes = date_utils_1.DateUtils.parseMinutes(message);
        this.datetime = date_utils_1.DateUtils.normalizeDateTime(this.date, this.time);
        if (this.datetime !== null) {
            this.dateStr = date_utils_1.DateUtils.format('Y/m/d', this.datetime);
            this.datetimeStr = date_utils_1.DateUtils.format('Y/m/d H:M', this.datetime);
        }
        // コマンド集
        const commands = [
            [
                'actionSignOut',
                /(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|bye|night|(c|see)\s*(u|you)|left|退勤|ごきげんよ|グ[ッ]?バイ)/,
            ],
            ['actionWhoIsOff', /(だれ|誰|who\s*is).*(休|やす(ま|み|む))/],
            ['actionWhoIsIn', /(だれ|誰|who\s*is)/],
            ['actionBreak', /(休憩|break)/],
            [
                'actionCancelOff',
                /(休|やす(ま|み|む)|休暇).*(キャンセル|消|止|やめ|ません)/,
            ],
            ['actionOff', /(休|やす(ま|み|む)|休暇)/],
            [
                'actionSignIn',
                /(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|hi|hello|morning|ohayo|出勤)/,
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
    actionSignIn(username, _message) {
        if (!this.datetime) {
            return;
        }
        const data = this.storage.get(username, this.datetime);
        if (!data.signIn || data.signIn === '-') {
            this.storage.set(username, this.datetime, {
                signIn: this.datetime,
            });
            this.responder.template('出勤', username, this.datetimeStr);
        }
        else {
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
    actionSignOut(username, _message) {
        if (!this.datetime) {
            return;
        }
        const data = this.storage.get(username, this.datetime);
        if (!data.signIn || data.signIn === '-') {
            // まだ出勤前である
            this.responder.template('休憩エラー', username, '');
        }
        else if (!data.signOut || data.signOut === '-') {
            this.storage.set(username, this.datetime, {
                signOut: this.datetime,
            });
            // 5時間以上働いていて、休憩が入っていなければ休憩を更新する
            if (!data.break &&
                this.datetime.getTime() - data.signIn > 5 * 60 * 60 * 1000) {
                // break 入力
                this.storage.set(username, this.datetime, {
                    break: 60,
                });
                this.responder.template('退勤と休憩', username, this.datetimeStr);
            }
            else {
                this.responder.template('退勤', username, this.datetimeStr);
            }
        }
        else {
            // 更新の場合は時間を明示する必要がある
            if (!!this.time) {
                this.storage.set(username, this.datetime, {
                    signOut: this.datetime,
                });
                // 5時間以上働いていて、休憩が入っていなければ休憩を更新する
                if (!data.break &&
                    this.datetime.getTime() - data.signIn > 5 * 60 * 60 * 1000) {
                    // break 入力
                    this.storage.set(username, this.datetime, {
                        break: 60,
                    });
                    this.responder.template('退勤更新と休憩', username, this.datetimeStr);
                }
                else {
                    this.responder.template('退勤更新', username, this.datetimeStr);
                }
            }
        }
    }
    // 休憩
    actionBreak(username, _time) {
        if (!this.minutes) {
            return;
        }
        const data = this.storage.get(username, this.datetime);
        if (!data.signIn || data.signIn === '-') {
            // まだ出勤前である
            this.responder.template('休憩エラー', username, '');
        }
        else {
            // break 入力
            this.storage.set(username, this.datetime, {
                break: this.minutes,
            });
            this.responder.template('休憩', username, this.minutes + '分');
        }
    }
    // 休暇申請
    actionOff(username, message) {
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
            this.responder.template('休暇', username, date_utils_1.DateUtils.format('Y/m/d', dateObj));
        }
    }
    // 休暇取消
    actionCancelOff(username, message) {
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
            this.responder.template('休暇取消', username, date_utils_1.DateUtils.format('Y/m/d', dateObj));
        }
    }
    // 出勤中
    actionWhoIsIn(_username, _message) {
        const dateObj = date_utils_1.DateUtils.toDate(date_utils_1.DateUtils.now());
        const result = _.compact(_.map(this.storage.getByDate(dateObj), function (row) {
            return _.isDate(row.signIn) && !_.isDate(row.signOut)
                ? row.user
                : undefined;
        }));
        if (_.isEmpty(result)) {
            this.responder.template('出勤なし');
        }
        else {
            this.responder.template('出勤中', result.sort().join(', '));
        }
    }
    // 休暇中
    actionWhoIsOff(_username, _message) {
        const dateObj = date_utils_1.DateUtils.toDate(date_utils_1.DateUtils.now());
        const dateStr = date_utils_1.DateUtils.format('Y/m/d', dateObj);
        let result = _.compact(_.map(this.storage.getByDate(dateObj), function (row) {
            return row.signIn === '-' ? row.user : undefined;
        }));
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
        }
        else {
            this.responder.template('休暇中', dateStr, result.sort().join(', '));
        }
    }
    // 出勤していない人にメッセージを送る
    confirmSignIn(_username, _message) {
        const holidays = _.compact(_.map((this.settings.get('休日') || '').split(','), function (s) {
            var date = date_utils_1.DateUtils.parseDateTime(s);
            return date ? date_utils_1.DateUtils.format('Y/m/d', date) : undefined;
        }));
        const today = date_utils_1.DateUtils.toDate(date_utils_1.DateUtils.now());
        // 休日ならチェックしない
        if (_.contains(holidays, date_utils_1.DateUtils.format('Y/m/d', today)))
            return;
        const wday = date_utils_1.DateUtils.now().getDay();
        const signedInUsers = _.compact(_.map(this.storage.getByDate(today), (row) => {
            const signedIn = _.isDate(row.signIn);
            const off = row.signIn === '-' ||
                _.contains(this.storage.getDayOff(row.user), wday);
            return signedIn || off ? row.user : undefined;
        }));
        const users = _.difference(this.storage.getUsers(), signedInUsers);
        if (!_.isEmpty(users)) {
            this.responder.template('出勤確認', users.sort());
        }
        // バージョンチェックを行う
        gas_utils_1.checkUpdate(this.responder);
    }
    // 退勤していない人にメッセージを送る
    confirmSignOut(_username, _message) {
        const dateObj = date_utils_1.DateUtils.toDate(date_utils_1.DateUtils.now());
        const users = _.compact(_.map(this.storage.getByDate(dateObj), (row) => {
            _.isDate(row.signIn) && !_.isDate(row.signOut) ? row.user : undefined;
        }));
        if (!_.isEmpty(users)) {
            this.responder.template('退勤確認', users.sort());
        }
    }
}
exports.Timesheets = Timesheets;


/***/ })

/******/ })));