var restaurants=[];
var all=[];
var favorite=[];

  jQuery(document).ready(function($) {
      // $.get('/getJson').success(function(restaurants){
      //   //console.log(restaurants)
  });
  
  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 22.999533, lng: 120.203401}
    });


    setMarkers(map);
    //show_Data();
  }

  function setMarkers(map) {
    // Adds markers to the map.


    infowindow = new google.maps.InfoWindow();
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image = {
      url: 'assets/img/bitnami.ico',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(20, 32),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };

    $.getJSON('https://ccw850228.github.io/git666/all.json', function(data) {

      //var data=JSON.parse(restaurants);
      for(var i=0;i<data.length;i++){
        //var json=[i][data[i].餐飲店家名稱,(data[i].Y坐標)+','+(data[i].X坐標),data[i].店家地址];
        restaurants[i]=[];
        restaurants[i][0]=data[i].id;
        restaurants[i][1]=data[i].餐飲店家名稱;
        restaurants[i][2]=data[i].Y坐標;
        restaurants[i][3]=data[i].X坐標;
        restaurants[i][4]=data[i].店家地址;
        restaurants[i][5]=data[i].店家電話;
        restaurants[i][6]=data[i].營業時間;
        // console.log(i+1);
      }
      var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
      };

      $.get( "/list", function( data ) {

          //console.log(data[0]);

            for (var i = 0; i < restaurants.length; i++) {
              var restaurant = restaurants[i];
              //console.log(123);
              //console.log(restaurant[0]);
              var marker = new google.maps.Marker({
                position: {lat: restaurant[2], lng: restaurant[3]},
                map: map,
                //icon: image,
                //shape: shape,
                //title: restaurant[0],
                //zIndex: restaurant[3]
              });
              info(marker, restaurants[i],'false');
              for (var j = 0; j < data.length; j++) {
                //console.log(data.length);
                //console.log(data[j].res_id);
                //favorite.push(data[j].res_id);
                if (data[j].res_id==restaurant[0]) {
                  info(marker, restaurants[i],'true');
                  //break;
                  continue;
                  //return;
                }
              }
              
            }
      });
      //console.log(favorite);

      
    });

    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
  }

  function info(marker, res_info,favorite) {
    //console.log(res_info[0]);
    //console.log(res_info);
    if (favorite == 'true') {
      var infowindow = new google.maps.InfoWindow({
        content: 
        '<div class="res_name" ><h3>'+res_info[1]+'</h3></div>'+
        '<ul>'+
        '<li>'+res_info[4]+'</li><br/>'+
        '<li>'+res_info[5]+'</li><br/>'+
        '<li>'+res_info[6]+'</li><br/>'+
        //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="res_Favorite(\''+res_info[0]+'\',\''+res_info[1]+'\',\''+res_info[4]+'\',\''+res_info[5]+'\',\''+res_info[6]+'\', $(this))"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png"></button></li>'+
        '</ul>',
        
        maxWidth: 400
      });
    }else{
      var infowindow = new google.maps.InfoWindow({
        content: 
        '<div class="res_name" ><h3>'+res_info[1]+'</h3></div>'+
        '<ul>'+
        '<li>'+res_info[4]+'</li><br/>'+
        '<li>'+res_info[5]+'</li><br/>'+
        '<li>'+res_info[6]+'</li><br/>'+
        //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="res_Favorite(\''+res_info[0]+'\',\''+res_info[1]+'\',\''+res_info[4]+'\',\''+res_info[5]+'\',\''+res_info[6]+'\', $(this))"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png"></button></li>'+
        '</ul>',
        
        maxWidth: 400
      });
    }
    

    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
  }

  
  function res_Favorite(res_id,res_name,res_address,res_phone,res_time,dataElemet){

      

      if(dataElemet.html() == '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">'){
        dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">');
        
        $.post('/collect', {'res_id': res_id,'res_name': res_name,'res_address': res_address,'res_phone': res_phone,'res_time': res_time}).success(function(data){
              //console.log(res_id);
              if(data=='success'){
                //window.location.reload(" page.index ");
                //alert('刪除成功');
              }else{
                //alert('刪除失敗');
              }
          });
        
        add_Data(res_id,res_name,res_address,res_phone,res_time);
        
      }else if(dataElemet.html() == '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">'){
        dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">');

      }
 
  }
  function show_Favorite(){
    show_Data();
  }

  
  function show_Data() {
    $.get( "/list", function( data ) {
        //console.log(data[0]);
        for (var i = 0; i < data.length; i++) {
          //all.push(data[i]);
          $('#sidebar-left' ).append(
            '<div class="res_name" ><h3>'+data[i].res_name+'</h3></div>'+
            '<ul>'+
            '<li>'+data[i].res_address+'</li><br/>'+
            '<li>'+data[i].res_phone+'</li><br/>'+
            '<li>'+data[i].res_time+'</li><br/>'+
            '<li><button id="favorite" onclick="res_Favorite(\''+data[i].id+'\',\''+data[i].res_name+'\',\''+data[i].res_address+'\',\''+data[i].res_phone+'\',\''+data[i].res_time+'\', $(this))"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png"></button></li>'+
            '</ul>');
        }
    });
 
  }
  function add_Data(res_id,res_name,res_address,res_phone,res_time){
    $('#sidebar-left' ).append(
            '<div class="res_name" ><h3>'+res_name+'</h3></div>'+
            '<ul>'+
            '<li>'+res_address+'</li><br/>'+
            '<li>'+res_phone+'</li><br/>'+
            '<li>'+res_time+'</li><br/></ul>');
  }

