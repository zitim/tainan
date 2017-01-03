var restaurants=[];
var all=[];
var focusInfoWindow;
var map;
var markers = [];
var focusList;
var infoWindows=[];
var userPosition = { lat: 23.973875, lng: 120.982024 };
var date=new Date();
var day=date.getDay();
var hour=date.getHours();
var minute=date.getMinutes();
var nowtime=(hour*60)+minute;
// nowtime=60;
//console.log(nowtime);
  


  jQuery(document).ready(function($) {
      // $.get('/getJson').success(function(restaurants){
      //   //console.log(restaurants)
  });
  
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 22.999533, lng: 120.203401}
    });


    $('#filter').append();

    geoFindMe();
    //includeData();
  }

  function geoFindMe() {
    if (!navigator.geolocation) {
        alert("很抱歉，您的瀏覽器不支援定位服務");
        append_select(1);
        return;
    }

    function success(position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        userPosition = {
            lat: userLat,
            lng: userLng
        };
        append_select(1);
    };

    function error() {
        //alert("已取消定位功能");
        append_select(1);
    };
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function append_select(i){
    var i = i.toString();
    document.getElementById('filter').innerHTML = "";
    $('#filter').append(
      '<select id="opening_hours'+i+'">'+
      '<option value="all" >不限</option>'+
      '<option value="opening" selected="selected">現在營業</option>'+
      '</select>'
    );

    includeData();
  }

  function includeData() {
    var selected=[];
    var Opening=[];
      $("#opening_hours1").change(function(){

        $( "#opening_hours1 option:selected" ).filter(function() {
          switch($('#opening_hours1').val()){
            case 'all':
              $('#resraurant_type2').remove();
              $('#filter').append(
                '<select id="resraurant_type1">'+
                '<option value="all" selected="selected">不限</option>'+
                '<option value=11 >主食</option>'+
                '<option value=12 >小吃</option>'+
                '<option value=13 >甜食</option>'+
                '<option value=14 >咖啡</option>'+
                '</select>'
              );

              $("#resraurant_type1").change(function(){

                $( "#resraurant_type1 option:selected" ).filter(function() {
                  switch($('#resraurant_type1').val()){
                    case 'all':
                      //console.log(10);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      $.get( "/list", function( data ) {

                        show_Data(data);
                      });
                      break;

                    case '11':
                    //console.log(11);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      $.get( "/list", function( data ) {
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 1) {
                            selected.push(data[i]);
                          }
                        }
                        show_Data(selected);
                        selected=[];
                      });
                      break; 
                    case '12':
                    //console.log(12);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      $.get( "/list", function( data ) {
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 2) {
                            selected.push(data[i]);
                          }
                        }
                        show_Data(selected);
                        selected=[];
                      });
                      break; 
                    case '13':
                      //console.log(13);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      $.get( "/list", function( data ) {
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 3) {
                            selected.push(data[i]);
                          }
                        }
                        show_Data(selected);
                        selected=[];
                      });
                      break; 
                    case '14':
                    //console.log(14);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      $.get( "/list", function( data ) {
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 4) {
                            selected.push(data[i]);
                          }
                        }
                        show_Data(selected);
                        selected=[];
                      });
                      break; 
                  }
                });

              }).trigger( "change" );
              break;

            case 'opening':

              $('#resraurant_type1').remove();

              $('#filter').append(
                '<select id="resraurant_type2">'+
                '<option value="all" selected="selected">不限</option>'+
                '<option value=21 >主食</option>'+
                '<option value=22 >小吃</option>'+
                '<option value=23 >甜食</option>'+
                '<option value=24 >咖啡</option>'+
                '</select>'
              );
              deleteMarkers();
              document.getElementById('sidebar-left').innerHTML = "";
              Opening=[];
              data=[];

              $.get( "/list", function( data ) {
                
                for(var i=0;i<data.length;i++){
                  if(day!=data[i].WorkingExcp&&data[i].WorkingWeek[1]>=day&&day>=data[i].WorkingWeek[0]){
                      switch(data[i].WorkingTime.length){
                        case 2:
                          if(data[i].WorkingTime[0]<=nowtime&&nowtime<=data[i].WorkingTime[1]){
                           Opening.push(data[i]);
                          }
                          break;

                        case 4:
                          if(data[i].WorkingTime[0]<=nowtime&&nowtime<=data[i].WorkingTime[1]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[2]<=nowtime&&nowtime<=data[i].WorkingTime[3]){
                            Opening.push(data[i]);
                          }
                          break;

                        case 6:
                           if(data[i].WorkingTime[0]<=nowtime&&nowtime<=data[i].WorkingTime[1]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[2]<=nowtime&&nowtime<=data[i].WorkingTime[3]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[4]<=nowtime&&nowtime<=data[i].WorkingTime[5]){
                            Opening.push(data[i]);
                          }
                          break;

                        case 8:
                          if(data[i].WorkingTime[0]<=nowtime&&nowtime<=data[i].WorkingTime[1]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[2]<=nowtime&&nowtime<=data[i].WorkingTime[3]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[4]<=nowtime&&nowtime<=data[i].WorkingTime[5]){
                            Opening.push(data[i]);
                          }else if(data[i].WorkingTime[6]<=nowtime&&nowtime<=data[i].WorkingTime[7]){
                            Opening.push(data[i]);
                          break;
                          }
                      }
                  }
                }
                data=Opening;

                $("#resraurant_type2").change(function(){

                  $( "#resraurant_type2 option:selected" ).filter(function() {
                    switch($('#resraurant_type2').val()){
                      case 'all':
                      //console.log(20);
                        selected=[];
                        deleteMarkers();
                        document.getElementById('sidebar-left').innerHTML = "";
                       
                          show_Data(data);
                        
                        break;

                      case '21':
                      //console.log(21);
                        selected=[];
                        deleteMarkers();
                        document.getElementById('sidebar-left').innerHTML = "";
                        
                          for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 1) {
                              selected.push(data[i]);
                            }
                          }
                          show_Data(selected);
                          //console.log(selected);
                          selected=[];
                        
                        break; 
                      case '22':
                      //console.log(22);
                        selected=[];
                        deleteMarkers();
                        document.getElementById('sidebar-left').innerHTML = "";
                       
                          for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 2) {
                              selected.push(data[i]);
                            }
                          }
                          //console.log(selected);
                          show_Data(selected);
                          selected=[];
                       
                        break; 
                      case '23':
                      //console.log(23);
                        selected=[];
                        deleteMarkers();
                        document.getElementById('sidebar-left').innerHTML = "";
                        
                          for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 3) {
                              selected.push(data[i]);
                            }
                          }
                          //console.log(selected);
                          show_Data(selected);
                          selected=[];
                      
                        break; 
                      case '24':
                      //console.log(24);
                        selected=[];
                        deleteMarkers();
                        document.getElementById('sidebar-left').innerHTML = "";
                        
                          for (var i = 0; i < data.length; i++) {
                            if (data[i].Type == 4) {
                              selected.push(data[i]);
                            }
                          }
                          //console.log(selected);
                          show_Data(selected);
                          cselected=[];
                        
                        break; 
                    }
                  });

                }).trigger( "change" );
                
                //show_Data(data);
              });
                break; 
          }
        });

      }).trigger( "change" );

  }
  //setMarkers(map);

  function show_Data(restaurants) {
    infoWindows=[];
    //console.log(restaurants[0].favorite);
    for (var i = 0 ; i < restaurants.length; i++) {
      var dataLocation = restaurants[i].店家地址;
      // console.log(restaurants[i].店家地址);
      //console.log(restaurants[i].favorite);
      //var fav = restaurants[i].favorite;
      if (restaurants[i].favorite.indexOf(user_id) >=0) {  
          dataFavoriteHtml = '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">';
      } else {
          dataFavoriteHtml = '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">';
      }

      create_Marker(i,restaurants[i].id,restaurants[i].餐飲店家名稱,restaurants[i].X坐標,restaurants[i].Y坐標,restaurants[i].店家地址,restaurants[i].店家電話,restaurants[i].營業時間,dataFavoriteHtml,restaurants[i].Type);
      //setMarkers(restaurants);
      
      $('#sidebar-left' ).append(
          '<li id="fr"><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><div id="fr2"  class="chcolor"><h3>'+restaurants[i].餐飲店家名稱+'</h3>'+
          '<ul><li id="addresicon">'+restaurants[i].店家地址+'</li><br/>'+
          '<li>'+restaurants[i].店家電話+'</li><br/>'+
          '<li>'+restaurants[i].營業時間+'</li><br/></ul>'+
          '<button id="favorite" onclick="change_Favorite(\''+restaurants[i].id+'\',\''+restaurants[i].餐飲店家名稱+'\',\''+restaurants[i].店家地址+'\',\''+restaurants[i].店家電話+'\',\''+restaurants[i].營業時間+'\', true ,$(this),\''+i+'\')">'+dataFavoriteHtml+'</button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + restaurants[i].店家地址 + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
          '</a></div></li>');
      }
    //   console.log(restaurant[2]);
  }

  function create_Marker(dataCount,id,res_name,res_X,res_Y,res_address,res_phone,res_time,favorite,res_type) {
    // Adds markers to the map.
    //console.log(typeof(res_type));
    infowindow = new google.maps.InfoWindow();
    //console.log(restaurants[i].店家地址);
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image
    var dataImageUrl;
    switch (res_type){
      case 1:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/turkey (1).png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
          //dataImageUrl: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/chicken.png';
        break;
      case 2:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/fries.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 32)
        };
        break;
      case 3:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/doughnut.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 32)
        };
        break;
      case 4:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/coffee2.png',
          size: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 32)
        };
        break;
    }

    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };


    var marker = new google.maps.Marker({
        position: {lat: res_Y, lng: res_X},
        map: map,
        icon: image
        //shape: shape,
        //title: restaurant[0],
        //zIndex: restaurant[3]
    });
    markers.push(marker);
    
    // var markerCluster = new MarkerClusterer(map, markers,
    //   {imagePath: 'assets/img/m'});
    //console.log(markerCluster);

    // var markerCluster = new MarkerClusterer(map, markers,
    //         {imagePath: '/public/assets/img'});
      

    // var locations = [
    //     {lat: res_Y, lng: res_X}
        
    //   ];

    var s1 ='<script src="/public/assets/js/markerclusterer.js"></script>';
    var s2 ='<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD0SEsueJfTm1q5k7bnAkt1OLTFv1oO2C0&signed_in=true&callback=initMap"></script>'

    var infowindow = new google.maps.InfoWindow({
        content: 
        '<div class="res_name" ><h3>'+res_name+'</h3></div>'+
        '<ul>'+
        '<li>'+res_address+'</li><br/>'+
        '<li>'+res_phone+'</li><br/>'+
        '<li>'+res_time+'</li><br/>'+
              //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="change_Favorite(\''+id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')">'+dataFavoriteHtml+'</button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
        '</ul>',
              
        maxWidth: 400
    });
    

    marker.addListener('click', function() {
      
      if (focusInfoWindow != null) {
          focusInfoWindow.close();
      }
      infowindow.open(map, marker);
      focusInfoWindow = infowindow;
      map.setZoom(16);
      map.panTo(marker.getPosition());
    });
    infoWindows.push(infowindow);
    //console.log(infowindow);
    
  }

  function focusLocation(dataCount) {
    if (focusInfoWindow != null) {
        focusInfoWindow.close();
    }
    if (focusList != null) {
        focusList.removeClass('selected');
    }
    //console.log(markers);
    var focusMarker = markers[dataCount];
    //console.log(focusMarker);
    focusInfoWindow = infoWindows[dataCount];
    //console.log(focusInfoWindow);
    var listCount = Number(dataCount) + 1;
    focusList = $('#sidebar-left > li:nth-child(' + listCount + ')');

    focusInfoWindow.open(map, focusMarker);
    map.panTo(focusMarker.getPosition());
    map.setZoom(18);

    focusMarker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
        focusMarker.setAnimation(null);
    }, 2250);

    focusList.addClass('selected');

    $('.filter').hide();
  }



  function change_Favorite(res_id,res_name,res_address,res_phone,res_time,islist,dataElemet,dataCount){

    //未收藏
    if(dataElemet.html() == '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">'){
      dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">');
          
      $.post('/collect', {'res_id': res_id,'user_id': user_id}).success(function(data){
                //console.log(res_id);
        if(data=='success'){
                  //window.location.reload(" page.index ");
                  //alert('刪除成功');
        }else{
                  //alert('刪除失敗');
        }
      });

      var listCount = Number(dataCount) + 1;
      if (islist) {//左邊欄位
        var infowindow = infoWindows[dataCount];

        infowindow.setContent('<div class="res_name" ><h3>'+res_name+'</h3></div>'+
        '<ul>'+
        '<li>'+res_address+'</li><br/>'+
        '<li>'+res_phone+'</li><br/>'+
        '<li>'+res_time+'</li><br/>'+
              //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="change_Favorite(\''+res_id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png"></button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
        '</ul>');
      }else{//右邊地圖
        console.log(listCount);
        $('#sidebar-left > li:nth-child(' + listCount + ') button:nth-child(' + 3 + ')').html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">');
      }


    }else { //已收藏
      dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">');

        $.post('/remove', {'res_id': res_id,'user_id': user_id}).success(function(data){
                //console.log(res_id);
          if(data=='success'){
                  //window.location.reload(" page.index ");
                  //alert('刪除成功');
          }else{
                  //alert('刪除失敗');
          }
        });

        var listCount = Number(dataCount) + 1;
        if (islist) {//左邊欄位
          var infowindow = infoWindows[dataCount];

          infowindow.setContent('<div class="res_name" ><h3>'+res_name+'</h3></div>'+
          '<ul>'+
          '<li>'+res_address+'</li><br/>'+
          '<li>'+res_phone+'</li><br/>'+
          '<li>'+res_time+'</li><br/>'+
                //'<li>──────────────</li><br>'+
          '<li><button id="favorite" onclick="change_Favorite(\''+res_id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png"></button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
          '</ul>');
        }else{//右邊地圖
          console.log(listCount);
          $('#sidebar-left > li:nth-child(' + listCount + ') button:nth-child(' + 3 + ')').html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">');
        }
    }
  }
  function show_Favorite(){
    var show_Favorite=[];
    var Opening=[];
    var nearByResult = [];
    var selected=[];

    document.getElementById('filter').innerHTML = "";
    $('#filter').append(
      '<select id="opening_hours2">'+
      '<option value="all" >不限</option>'+
      '<option value="opening" selected="selected">現在營業</option>'+
      '</select>'
    );

    deleteMarkers();
    document.getElementById('sidebar-left').innerHTML = "";


    $("#opening_hours2").change(function(){

      $( "#opening_hours2 option:selected" ).filter(function() {
        switch($('#opening_hours2').val()){
          case 'all':
            $('#resraurant_type1').remove();
            $('#resraurant_type2').remove();
            $('#resraurant_type4').remove();
            $('#filter').append(
              '<select id="resraurant_type3">'+
              '<option value="all" selected="selected">不限</option>'+
              '<option value=11 >主食</option>'+
              '<option value=12 >小吃</option>'+
              '<option value=13 >甜食</option>'+
              '<option value=14 >咖啡</option>'+
              '</select>'
            );
            deleteMarkers();
            document.getElementById('sidebar-left').innerHTML = "";

            $("#resraurant_type3").change(function(){
              show_Favorite=[];
              $( "#resraurant_type3 option:selected" ).filter(function() {
                switch($('#resraurant_type3').val()){
                  case 'all':
                    //console.log(10);
                    selected=[];
                    deleteMarkers();
                    document.getElementById('sidebar-left').innerHTML = "";
    
                    $.get( "/list", function( data ) {
                      for (var i = 0; i < data.length; i++) {
                        if (data[i].favorite.indexOf(user_id)>=0) {
                          show_Favorite.push(data[i]);
                        }
                      } 
                      data=show_Favorite;
                      show_Data(data);
                    });
                    break;

                  case '11':
                  //console.log(11);
                    selected=[];
                    deleteMarkers();
                    document.getElementById('sidebar-left').innerHTML = "";
                    $.get( "/list", function( data ) {
                      for (var i = 0; i < data.length; i++) {
                        if (data[i].favorite.indexOf(user_id)>=0) {
                          show_Favorite.push(data[i]);
                        }
                      } 
                      for (var i = 0; i < show_Favorite.length; i++) {
                        if (show_Favorite[i].Type == 1) {
                          selected.push(show_Favorite[i]);
                        }
                      }
                      show_Data(selected);
                      selected=[];
                    });
                    break; 
                  case '12':
                  //console.log(12);
                    selected=[];
                    deleteMarkers();
                    document.getElementById('sidebar-left').innerHTML = "";
                    $.get( "/list", function( data ) {
                      for (var i = 0; i < data.length; i++) {
                        if (data[i].favorite.indexOf(user_id)>=0) {
                          show_Favorite.push(data[i]);
                        }
                      } 
                      for (var i = 0; i < show_Favorite.length; i++) {
                        if (show_Favorite[i].Type == 2) {
                          selected.push(show_Favorite[i]);
                        }
                      }
                      show_Data(selected);
                      selected=[];
                    });
                    break; 
                  case '13':
                    //console.log(13);
                    selected=[];
                    deleteMarkers();
                    document.getElementById('sidebar-left').innerHTML = "";
                    $.get( "/list", function( data ) {
                      for (var i = 0; i < data.length; i++) {
                        if (data[i].favorite.indexOf(user_id)>=0) {
                          show_Favorite.push(data[i]);
                        }
                      } 
                      for (var i = 0; i < show_Favorite.length; i++) {
                        if (show_Favorite[i].Type == 3) {
                          selected.push(show_Favorite[i]);
                        }
                      }
                      show_Data(selected);
                      selected=[];
                    });
                    break; 
                  case '14':
                  //console.log(14);
                    selected=[];
                    deleteMarkers();
                    document.getElementById('sidebar-left').innerHTML = "";
                    $.get( "/list", function( data ) {
                      for (var i = 0; i < data.length; i++) {
                        if (data[i].favorite.indexOf(user_id)>=0) {
                          show_Favorite.push(data[i]);
                        }
                      } 
                      for (var i = 0; i < show_Favorite.length; i++) {
                        if (show_Favorite[i].Type == 4) {
                          selected.push(show_Favorite[i]);
                        }
                      }
                      show_Data(selected);
                      selected=[];
                    });
                    break; 
                }
              });

            }).trigger( "change" );
            
            break;

          case 'opening':
            $('#resraurant_type1').remove();
            $('#resraurant_type2').remove();
            $('#resraurant_type3').remove();
            $('#filter').append(
              '<select id="resraurant_type4">'+
              '<option value="all" selected="selected">不限</option>'+
              '<option value=21 >主食</option>'+
              '<option value=22 >小吃</option>'+
              '<option value=23 >甜食</option>'+
              '<option value=24 >咖啡</option>'+
              '</select>'
            );

            deleteMarkers();
            document.getElementById('sidebar-left').innerHTML = "";
            Opening=[];
            data=[];

            $.get( "/list", function( data ) {
              show_Favorite=[];
              for (var i = 0; i < data.length; i++) {
                if (data[i].favorite.indexOf(user_id)>=0) {
                  show_Favorite.push(data[i]);
                }
              } 
              
              for(var i=0;i<show_Favorite.length;i++){
                console.log(show_Favorite.length);
                if(day!=show_Favorite[i].WorkingExcp&&show_Favorite[i].WorkingWeek[1]>=day&&day>=show_Favorite[i].WorkingWeek[0]){
                    switch(show_Favorite[i].WorkingTime.length){
                      case 2:
                        if(show_Favorite[i].WorkingTime[0]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[1]){
                         Opening.push(show_Favorite[i]);
                        }
                        break;

                      case 4:
                        if(show_Favorite[i].WorkingTime[0]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[1]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[2]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[3]){
                          Opening.push(show_Favorite[i]);
                        }
                        break;

                      case 6:
                         if(show_Favorite[i].WorkingTime[0]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[1]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[2]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[3]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[4]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[5]){
                          Opening.push(show_Favorite[i]);
                        }
                        break;

                      case 8:
                        if(show_Favorite[i].WorkingTime[0]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[1]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[2]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[3]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[4]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[5]){
                          Opening.push(show_Favorite[i]);
                        }else if(show_Favorite[i].WorkingTime[6]<=nowtime&&nowtime<=show_Favorite[i].WorkingTime[7]){
                          Opening.push(show_Favorite[i]);
                        break;
                        }
                    }
                }
              }
              data=Opening;

              console.log(data);

              $("#resraurant_type4").change(function(){

                $( "#resraurant_type4 option:selected" ).filter(function() {
                  switch($('#resraurant_type4').val()){
                    case 'all':
                    //console.log(20);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                     
                        show_Data(data);
                      
                      break;

                    case '21':
                    //console.log(21);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 1) {
                            selected.push(data[i]);
                          }
                        }
                        show_Data(selected);
                        //console.log(selected);
                        selected=[];
                      
                      break; 
                    case '22':
                    //console.log(22);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                     
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 2) {
                            selected.push(data[i]);
                          }
                        }
                        //console.log(selected);
                        show_Data(selected);
                        selected=[];
                     
                      break; 
                    case '23':
                    //console.log(23);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 3) {
                            selected.push(data[i]);
                          }
                        }
                        //console.log(selected);
                        show_Data(selected);
                        selected=[];
                    
                      break; 
                    case '24':
                    //console.log(24);
                      selected=[];
                      deleteMarkers();
                      document.getElementById('sidebar-left').innerHTML = "";
                      
                        for (var i = 0; i < data.length; i++) {
                          if (data[i].Type == 4) {
                            selected.push(data[i]);
                          }
                        }
                        //console.log(selected);
                        show_Data(selected);
                        cselected=[];
                      
                      break; 
                  }
                });

              }).trigger( "change" );

              //show_Data(data); 
            });
            break; 
      }
    });

    if (focusInfoWindow != null) {
      focusInfoWindow.close();
    }
    var infoWindow = new google.maps.InfoWindow({
      content: '<div class="site"><h2><i class="fa fa-map-marker fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;你的位置</h2></div>'
    });
    var marker = new google.maps.Marker({
      position: userPosition,
      title: "你的位置",
      icon: "https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/girl.png",
    });
    marker.addListener('click', function() {
      if (focusInfoWindow != null) {
        focusInfoWindow.close();
      }
      infoWindow.open(map, marker);
      focusInfoWindow = infoWindow;
    });
    marker.setMap(map);
    infoWindow.open(map, marker);
    focusInfoWindow = infoWindow;
    map.panTo(marker.getPosition());
    map.setZoom(12);

    }).trigger( "change" );

  }
  
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }


  function clearMarkers() {
    setMapOnAll(null);
  }

  function deleteMarkers() {
    //console.log(123);
     clearMarkers();
     markers = [];
  }
