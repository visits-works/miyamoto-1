// Google Apps Script専用ユーティリティ

import { GASProperties } from './gas_properties';
import { Responder } from './slack';

// GASのログ出力をブラウザ互換にする
if (typeof console === 'undefined' && typeof Logger !== 'undefined') {
  // @ts-ignore
  console = {};
  console.log = function (...args: any[]) {
    Logger.log(args.join(', '));
  };
}

// サーバに新しいバージョンが無いかチェックする
export function checkUpdate(responder: Responder) {
  const current_version = parseFloat(new GASProperties().get('version') || '0');

  const response = UrlFetchApp.fetch(
    'https://raw.githubusercontent.com/georepublic/miyamoto/master/VERSION',
    { muteHttpExceptions: true }
  );

  if (response.getResponseCode() === 200) {
    const latest_version = parseFloat(response.getContentText());
    if (latest_version > 0 && latest_version > current_version) {
      responder.send(
        'Timesheet Script was updated. \nhttps://github.com/georepublic/miyamoto/blob/master/UPDATE.md を読んでください。'
      );

      const response = UrlFetchApp.fetch(
        'https://raw.githubusercontent.com/georepublic/miyamoto/master/HISTORY.md',
        { muteHttpExceptions: true }
      );
      if (response.getResponseCode() === 200) {
        const text = response
          .getContentText()
          .replace(new RegExp('## ' + current_version + '[\\s\\S]*', 'm'), '');
        responder.send(text);
      }
    }
  }
}
