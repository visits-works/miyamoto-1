# Environment info

- [Google Script](https://script.google.com/a/code4japan.org/d/1nG3ngwnnrHxTmn0uK7VgvJfa9hCO0hV3VFsusGWVoZqyW6Rq6CDA2GTQ/edit)
- [Time sheet](https://docs.google.com/spreadsheets/d/1RUYb4034tz8-HnW9yv1rzMwM3Sq3EXpBLlpMbPEBhqA/edit#gid=0)

# 勤怠管理bot - みやもとさん

- [English README](README_en.md)

Google Apps Scriptで書かれた、Slack上で動く勤怠管理Bot。
Georepublic Japan 内での利用用にカスタマイズしています。

オリジナル版は[こちら](https://github.com/masuidrive/miyamoto)

Slackで下記の様につぶやくと、みやもとさんがGoogle Spreadsheetに勤怠を記録してくれます。

![demo1](https://raw.githubusercontent.com/masuidrive/miyamoto/master/docs/images/demo1.png)

# 動かす/How to use

Slackの#_timesheetチャンネルで「おはよう」と発言すると、先の「Slack Timesheets」にユーザ名のタブが作られて、時間が記録されます。

週の休日は「Day Off」の欄に,(カンマ)区切りで入力します。

### 出勤時コマンド

おはよう、おは、ハロー、グッドモーニング、など

```
['actionSignIn', /(モ[ー〜]+ニン|も[ー〜]+にん|おっは|おは|へろ|はろ|ヘロ|ハロ|hi|hello|morning|ohayo|出勤)/],
```

`おはよう YYYY/MM/DD HH:MM` や 、`おは 09:00` などと入れると、出勤時間を指定できます。（既にレコードがある場合、上書きされます）

### 退勤時コマンド

おつ、バイバイ、おやすみ、お疲れ様、退勤、ごきげんよう、など

```
['actionSignOut', /(バ[ー〜ァ]*イ|ば[ー〜ぁ]*い|おやすみ|お[つっ]ー|おつ|さらば|お先|お疲|帰|乙|bye|night|(c|see)\s*(u|you)|left|退勤|ごきげんよ|グ[ッ]?バイ)/],
```

`bye YYYY/MM/DD HH:MM` や 、`さよなら 09:00` などと入れると、退勤時間を指定できます。（既にレコードがある場合、上書きされます。未出勤の場合エラーになります。）

5時間以上勤務した場合の退勤時に、休憩レコードが存在しない場合60分の休憩時間を自動で付与します。

### 休憩記録コマンド

`休憩 30分`、`break 90min` など。休憩の時間を保存します。当該日の古いレコードは上書きされます。

```
['actionBreak', /(休憩|break)/],
```


## 会話例/Examples

- おはようございます ← 現在時刻で出勤
- おはようございます 12:00 ← 指定時刻で出勤
- おはようございます 10/2 12:00 ← 過去に遡って出勤を記録する
- 12:00に出勤しました ← 指定時刻で出勤
- お疲れ様でした ← 現在時刻で退勤
- お疲れ様でした 20:00 ← 指定時刻で退勤
- 20時に退勤しました ← 指定時刻で退勤
- 明日はお休みです ← 休暇申請
- 10/1はお休みです ← 休暇申請
- 明日のお休みを取り消します ← 休暇申請取り消し
- 明日はやっぱり出勤します ← 休暇申請取り消し

- 誰がいる？ ← 出勤中のリスト
- 誰がお休み？ ← 休暇中のリスト
- 9/21は誰がお休み？ ← 指定日の休暇リスト


## メッセージの変更/Change messages

Spreadsheetの「_メッセージ」シートに各メッセージのテンプレートが書かれています。縦に複数設定すると、ランダムで選択されます。

ココを変更するとみやもとさんのキャラが変わります。ぜひ面白い設定をしてください。


## 仕様/Limitation

- ユーザ名に.(ドット)が入っている場合に、mentionにならないのはSlack Webhookの仕様です。
- Private Groupに設置することはできません
- ユーザは一部屋90人ぐらいまでです。それ以上でお使いの場合は部単位などで部屋を分けて下さい。

# 開発/Development

If you push your code to the master branch, the script will automatically deployed to the Google App Script.

Please see [DEVELOPMENT.md](DEVELOPMENT.md) for the development details.

## Todo

- 出勤日数の管理
- 時間外労働の扱い
- 休憩時間

## テストの実行

みやもとさんはロジックの検証をNodeを使って行う事ができます。Nodeの実行環境を整えたら下記のコマンドを実行してください。

```
npm install
make test
```

## ソースコード/Source codes

- main.js
  - HTTPを受け取る

- timesheets.js
  - 入力内容を解析して、メソッドを呼び出す

- slack.js
  - Slackへの入出力

- gs_template.js
  - Google Spreadsheetを使ったメッセージテンプレート

- gs_properties.js
  - Google Spreadsheetを使った設定key-value store

- gs_timesheets.js
  - timesheetsをGoogle Spreadsheetに保存する処理

- gas_properties.js
  - Google Apps Scriptを使った設定key-value store

- gas_utils.js
  - Google Apps Script用のユーティリティ

- utils.js
  - globalで使うユーティリティ

- date_utils.js
  - 日付関係のユーティリティ

- underscore.js
  - _.で始まるユーティリティ集
  - http://underscorejs.org


# License

- [MIT License](http://opensource.org/licenses/MIT)
- Copyright 2014- Yuichiro MASUI <masui@masuidrive.jp>
- https://github.com/masuidrive/miyamoto
