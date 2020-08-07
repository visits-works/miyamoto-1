// KVS

loadGSBigQuery = function (exports) {
  var GSBigQuery = function (spreadsheet, prop) {
    // 初期設定
    this.spreadsheet = spreadsheet;
    this.projectID = prop.projectID;
    this.datasetID = prop.datasetID;
  };

  GSBigQuery.prototype.pushTables = function () {
    console.log('push to bigquery ');
    _.map(this.spreadsheet.getSheets(), function (s) {
      var name = s.getName();
      if (String(name).substr(0, 1) != '_') {
        console.log(name);
      }
    })
  };

  GSBigQuery.prototype.pushTable = function (sheet) {
    var table = {
      tableReference: {
        projectId: this.projectId,
        datasetId: this.datasetId,
        tableId: sheet.getName()
      },
      schema: {
        fields: [{
            name: 'work_date',
            type: 'date'
          },
          {
            name: 'start_working',
            type: 'string'
          },
          {
            name: 'end_working',
            type: 'string'
          },
          {
            name: 'break_time',
            type: 'integer'
          },
          {
            name: 'note',
            type: 'string'
          }
        ]
      }
    };
  }

  return GSBigQuery;
};

if (typeof exports !== 'undefined') {
  exports.GSBigQuery = loadGSBigQuery();
}