// KVS
import { UnderscoreStatic } from 'underscore';
const _ = require('./lib/underscorejs') as UnderscoreStatic;

export class GSBigQuery {
  projectID: string;
  datasetID: string;
  constructor(
    readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    prop: Record<string, string>
  ) {
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
  pushTable(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    const tableID = sheet.getName().replace('.', '_');
    // table schema
    const table: GoogleAppsScript.BigQuery.Schema.Table = {
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
      Bigquery.Tables?.remove(this.projectID, this.datasetID, tableID);
    } catch (e) {}
    /* table = */ Bigquery.Tables?.insert(
      table,
      this.projectID,
      this.datasetID
    );

    // load data as CSV format
    const range = sheet.getDataRange();
    const blob = Utilities.newBlob(this.convCsv(range)!).setContentType(
      'application/octet-stream'
    );
    // create job
    const job: GoogleAppsScript.BigQuery.Schema.Job = {
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
    /* job = */ Bigquery.Jobs?.insert(job, this.projectID, blob);
  }
  convCsv(range: GoogleAppsScript.Spreadsheet.Range) {
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
        if (
          data[i][0] instanceof GoogleAppsScript.Base.Date &&
          data[i][1] instanceof GoogleAppsScript.Base.Date &&
          data[i][2] instanceof GoogleAppsScript.Base.Date
        ) {
          const daycheck = data[i][0] as GoogleAppsScript.Base.Date;
          // format work_date and start/end time
          data[i][0] = Utilities.formatDate(data[i][0], 'JST', 'yyyy-MM-dd');
          // start/end time. use same date as working time for fixing data
          data[i][1] =
            data[i][0] + Utilities.formatDate(data[i][1], 'JST', ' HH:mm:ss');
          daycheck.setDate(daycheck.getDate() + 1);
          // if the end_date is the next day of the working day, it will be an overnight work.
          if (
            Utilities.formatDate(daycheck, 'JST', 'yyyy-MM-dd') ===
            Utilities.formatDate(data[i][2], 'JST', 'yyyy-MM-dd')
          ) {
            data[i][2] = Utilities.formatDate(
              data[i][2],
              'JST',
              'yyyy-MM-dd HH:mm:ss'
            );
          } else {
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
        } else if (
          data[i][0] instanceof GoogleAppsScript.Base.Date &&
          data[i][1] == '-' &&
          data[i][2] == '-'
        ) {
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
    } catch (e) {
      Logger.log(e);
      return;
    }
  }
  /**
   *
   * @param sheet a sheet of Spreadsheet
   */
  pushWorkDays() {
    const tableID = 'workdays';
    // table schema
    const table: GoogleAppsScript.BigQuery.Schema.Table = {
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
      Bigquery.Tables?.remove(this.projectID, this.datasetID, tableID);
    } catch (e) {}
    /* table = */ Bigquery.Tables?.insert(
      table,
      this.projectID,
      this.datasetID
    );

    // load data as CSV format
    const sheet = this.spreadsheet.getSheetByName('_勤務日数');
    const range = sheet!.getDataRange();
    const blob = Utilities.newBlob(this.convWorkDayCsv(range)!).setContentType(
      'application/octet-stream'
    );
    // create job
    const job: GoogleAppsScript.BigQuery.Schema.Job = {
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
    /* job = */ Bigquery.Jobs?.insert(job, this.projectID, blob);
  }
  convWorkDayCsv(range: GoogleAppsScript.Spreadsheet.Range) {
    try {
      const data = range.getValues();
      let csv = '';
      // read every rows
      for (let i = 0; i < data.length; i++) {
        data[i][0] = Utilities.formatDate(data[i][0], 'JST', 'yyyy-MM');
        csv += data[i].join(',') + '\r\n';
      }
      return csv;
    } catch (e) {
      Logger.log(e);
      return;
    }
  }
}
