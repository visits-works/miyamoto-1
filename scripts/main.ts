// 各モジュールの読み込み
import { DateUtils } from './date_utils';
import { GASProperties } from './gas_properties';
import { GSProperties } from './gs_properties';
import { GSTemplate } from './gs_template';
import { GSTimesheets } from './gs_timesheets';
import { Timesheets } from './timesheets';
import { Slack } from './slack';
import { GSBigQuery } from './gs_bigquery';
import { GSCalendar } from './gs_calendar';

export function init() {
  const global_settings = new GASProperties();

  const spreadsheetId = global_settings.get('spreadsheet');
  if (!spreadsheetId) {
    return null;
  }
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const settings = new GSProperties(spreadsheet);
  const template = new GSTemplate(spreadsheet);
  const slack = new Slack(
    settings.get('Slack Incoming URL')!,
    template,
    settings
  );
  const storage = new GSTimesheets(spreadsheet, settings);
  const timesheets = new Timesheets(storage, settings, slack);

  let bigquery: GSBigQuery | undefined;
  if (
    global_settings.get('bigQueryProjectID') &&
    global_settings.get('bigQueryDatasetID')
  ) {
    bigquery = new GSBigQuery(spreadsheet, {
      projectID: global_settings.get('bigQueryProjectID')!,
      datasetID: global_settings.get('bigQueryDatasetID')!,
    });
  }
  return {
    receiver: slack,
    timesheets: timesheets,
    storage: storage,
    bigquery: bigquery,
  };
}

// SlackのOutgoingから来るメッセージ
export function doPost(e: any) {
  if (e.parameters.user_name == undefined) {
    // data is undefined (Slack Event)
    const postJSON = JSON.parse(e.postData.getDataAsString());
    // verification Slack Event
    if (postJSON.type == 'url_verification') {
      // Mime TypeをJSONに設定、 challenge をreturn（Slackの認証）
      return ContentService.createTextOutput(postJSON.challenge).setMimeType(
        ContentService.MimeType.TEXT
      );
    } else if (postJSON.event.subtype != 'bot_message') {
      const miyamoto = init();
      const userid = String(postJSON.event.user);
      const body = String(postJSON.event.text);
      const token = new GASProperties().get('SLACK_OAUTH_TOKEN');
      const ret = UrlFetchApp.fetch(
        'https://slack.com/api/users.info?token=' + token + '&user=' + userid
      );
      var userdata = JSON.parse(ret.getContentText());
      miyamoto!.receiver.receiveMessage(userdata.user.name, body);
    }
    return;
  } else {
    // data is defined (Outgoing web hook)
    const miyamoto = init();
    const username = String(e.parameters.user_name);
    const body = String(e.parameters['text']);
    miyamoto!.receiver.receiveMessage(username, body);
    return;
  }
}

// Time-based triggerで実行
export function confirmSignIn() {
  const miyamoto = init();
  miyamoto!.timesheets.confirmSignIn();
}

// Time-based triggerで実行
export function confirmSignOut() {
  const miyamoto = init();
  miyamoto!.timesheets.confirmSignOut();
}

export function pushToBigQuery() {
  const miyamoto = init();
  if (miyamoto!.bigquery) {
    miyamoto!.bigquery.pushTables();
  }
}

// 初期化する
export function setUp() {
  // spreadsheetが無かったら初期化
  const global_settings = new GASProperties();
  if (!global_settings.get('spreadsheet')) {
    // タイムシートを作る
    const spreadsheet = SpreadsheetApp.create('Slack Timesheets');
    const sheets = spreadsheet.getSheets();
    if (sheets.length == 1 && sheets[0].getLastRow() == 0) {
      sheets[0].setName('_設定');
    }
    global_settings.set('spreadsheet', spreadsheet.getId());

    const settings = new GSProperties(spreadsheet);
    settings.set('Slack Incoming URL', '');
    settings.setNote(
      'Slack Incoming URL',
      'Slackのincoming URLを入力してください'
    );
    settings.set('開始日', DateUtils.format('Y-m-d', DateUtils.now()));
    settings.setNote('開始日', '変更はしないでください');
    settings.set('無視するユーザ', 'miyamoto,hubot,slackbot,incoming-webhook');
    settings.setNote(
      '無視するユーザ',
      '反応をしないユーザを,区切りで設定する。botは必ず指定してください。'
    );
    settings.set('開始月', 4);
    settings.setNote(
      '開始月',
      '年度の開始月。変更したら updateCalendar 関数を実行してください'
    );

    const calender = new GSCalendar(spreadsheet, settings);
    calender.setupCalendar();

    // メッセージ用のシートを作成
    new GSTemplate(spreadsheet);

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
/** update calendar */
export function updateCalendar() {
  // const miyamoto = init();

  const global_settings = new GASProperties();
  const spreadsheetId = global_settings.get('spreadsheet');
  let spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    settings: GSProperties;
  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    settings = new GSProperties(spreadsheet);
  } else {
    console.error('Spreadsheet is not initialized');
    return;
  }
  const calender = new GSCalendar(spreadsheet, settings);
  calender.setupCalendar();

  let bigquery: GSBigQuery;
  if (
    global_settings.get('bigQueryProjectID') &&
    global_settings.get('bigQueryDatasetID')
  ) {
    bigquery = new GSBigQuery(spreadsheet, {
      projectID: global_settings.get('bigQueryProjectID')!,
      datasetID: global_settings.get('bigQueryDatasetID')!,
    });
    bigquery.pushWorkDays();
  }
}

/* バージョンアップ処理を行う */
export function migrate() {
  const global_settings = new GASProperties();
  global_settings.set('version', '::VERSION::');
  console.log('バージョンアップが完了しました。');
}

/*
function test1(e) {
  var miyamoto = init();
  miyamoto.receiver.receiveMessage({user_name:"masuidrive", text:"hello 8:00"});
}
*/
