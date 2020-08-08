// KVS

loadGSBigQuery = function (exports) {
  var GSBigQuery = function (spreadsheet, prop) {
    // initialize
    this.spreadsheet = spreadsheet;
    this.projectID = prop.projectID;
    this.datasetID = prop.datasetID;
  };
  /**
   * push timesheet data to bigqurey table
   */
  GSBigQuery.prototype.pushTables = function () {
    console.log('push to bigquery ');
    _this = this;
    // push all sheets
    _.map(this.spreadsheet.getSheets(), function (s) {
      var name = s.getName();
      if (String(name).substr(0, 1) != '_') {
        _this.pushTable(s);
      }
    })
  };

  /**
   * 
   * @param sheet a sheet of Spreadsheet
   */
  GSBigQuery.prototype.pushTable = function (sheet) {
    var tableID = sheet.getName();
    // table schema
    var table = {
      tableReference: {
        projectId: this.projectID,
        datasetId: this.datasetID,
        tableId: tableID
      },
      schema: {
        fields: [{
            name: 'work_date',
            type: 'date'
          },
          {
            name: 'start_working',
            type: 'datetime'
          },
          {
            name: 'end_working',
            type: 'datetime'
          },
          {
            name: 'break_time',
            type: 'integer'
          },
          {
            name: 'note',
            type: 'string'
          },
          {
            name: 'work_minutes',
            type: 'integer'
          },
          {
            name: 'holiday',
            type: 'boolean'
          },
        ]
      }
    };
    // remove table first
    try {
      BigQuery.Tables.remove(this.projectID, this.datasetID, sheet.getName());
    } catch (e) {}
    table = BigQuery.Tables.insert(table, this.projectID, this.datasetID);

    // load data as CSV format
    var range = sheet.getDataRange();
    var blob = Utilities.newBlob(this.convCsv(range)).setContentType('application/octet-stream');
    // create job
    var job = {
      configuration: {
        load: {
          destinationTable: {
            projectId: this.projectID,
            datasetId: this.datasetID,
            tableId: tableID
          }
        }
      }
    };
    console.log('load data');
    // insert data
    job = BigQuery.Jobs.insert(job, this.projectID, blob);
  };

  GSBigQuery.prototype.convCsv = function (range) {
    try {
      var data = range.getValues();
      var csv = "";
      // read every rows
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          if (data[i][j].toString().indexOf(",") != -1) {
            data[i][j] = "\"" + data[i][j] + "\"";
          }
        }
        // if both of start and end time is set, load data
        if (Object.prototype.toString.call(data[i][0]) == "[object Date]" &&
          Object.prototype.toString.call(data[i][1]) == "[object Date]" &&
          Object.prototype.toString.call(data[i][2]) == "[object Date]"
        ) {
          // format work_date and start/end time
          data[i][0] = Utilities.formatDate(data[i][0], "JST", "yyyy-MM-dd");
          // start/end time. use same date as working time for fixing data
          data[i][1] = data[i][0] + Utilities.formatDate(data[i][1], "JST", " HH:mm:ss");
          data[i][2] = data[i][0] + Utilities.formatDate(data[i][2], "JST", " HH:mm:ss");
          // calculate working minutes
          data[i][5] = (new Date(data[i][2]) - new Date(data[i][1])) / (60 * 1000);
          // if no breaks, it makes 0 mins
          if (!data[i][3]) {
            data[i][3] = 0;
          }
          // not holiday
          data[i][6] = false;
          while (data[i].length > 7) {
            data[i].pop();
          }
          csv += data[i].join(",") + "\r\n";
        } else if (Object.prototype.toString.call(data[i][0]) == "[object Date]" &&
          data[i][1] == '-' &&
          data[i][2] == '-') {
          // log holidays
          // format work_date
          data[i][0] = Utilities.formatDate(data[i][0], "JST", "yyyy-MM-dd");
          data[i][1] = null;
          data[i][2] = null;
          data[i][3] = 0;
          data[i][5] = 0;
          // holiday
          data[i][6] = true;
          while (data[i].length > 7) {
            data[i].pop();
          }
          csv += data[i].join(",") + "\r\n";
        }
      }
      return csv;
    } catch (e) {
      Logger.log(e);
    }
  };

  return GSBigQuery;
};

if (typeof exports !== 'undefined') {
  exports.GSBigQuery = loadGSBigQuery();
}