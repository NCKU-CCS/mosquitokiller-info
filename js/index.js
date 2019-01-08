(function() {
  var argv = location.search;
  var args = argv.split('?')[1]
  var COUNT_API = 'https://mosquitokiller.csie.ncku.edu.tw/apis/counts?formatBy=hour&lampHashID=' + args + '&limit=7'
  var INFO_API = 'https://mosquitokiller.csie.ncku.edu.tw/apis/lamps/' + args + '?key=hash'
  var YESTERDAY_API = 'https://mosquitokiller.csie.ncku.edu.tw/apis/counts?formatBy=date&lampHashID=' + args + '&limit=1'
  var LAST_UPDATE = 'https://mosquitokiller.csie.ncku.edu.tw/apis/counts?lampHashID=' + args + '&limit=1'
  var COUNT = $.ajax({
    type: 'get',
    url: COUNT_API,
    crossDomain: true,
    contentType: 'application/json',
    success: function(data) {
      var json = [];
      var date = [];
      var day = 1;
      for(var key in data){
        for(var i = 2; i < 25; i+=2) {
          if(!data[key].hasOwnProperty(i)||!data[key].hasOwnProperty(i-1)) {
            json.push({
              'value': 0,
              'date': key.replace('2017-',''),
              'day': +day,
              'hour': +i
            })
          }
          else {
            json.push({
              'value': +(data[key][i]['sum']+data[key][i]['sum']),
              'date': key.replace('2017-',''),
              'day': +day,
              'hour': +i
            })
          }
        }
        day++;
        date.push(key.replace('2017-',''));
      }
      drawDayLable(date)
      heatmapChart(json)
    },
    error: function(data) {
      console.log(data)
    }
  })
  $.ajax({
    type: 'get',
    url : INFO_API,
    crossDomain: true,
    contentType: 'application/json',
    success: function(data) {
      console.log(data)
      data['id'] = args
      initMap(data)
    },
    fail: function(data) {
      console.log(data)
    }
  })
  $.ajax({
    type: 'get',
    url : YESTERDAY_API,
    crossDomain: true,
    contentType: 'application/json',
    success: function(data) {
      var date = new Date()
      var zeroPad = (date.getMonth() < 9)?'0':''
      date.setDate(date.getDate() - 1)
      $("#yesterdayData").text(data[date.getFullYear() + "-" + zeroPad + (date.getMonth() + 1) + "-" + ("00" + date.getDate()).slice(-2)][args]["sum"])
    },
    fail: function(data) {
      console.log(data)
    }
  })
  $.ajax({
    type: 'get',
    url : LAST_UPDATE,
    crossDomain: true,
    contentType: 'application/json',
    success: function(data) {
      $('#lastDate').text(data[0]['created_at'].replace(/T\S*/g,''))
    },
    fail: function(data) {
      console.log(data)
    }
  })
})();
