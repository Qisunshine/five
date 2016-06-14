$(function(){
  var canvasS = 600;
  var row = 15;
  var blocks = canvasS/row;
  var ctx = $('#canvas').get(0).getContext('2d');
  $('#canvas').get(0).width = canvasS;
  $('#canvas').get(0).height = canvasS;

  var draw = function(){
    var off = blocks/2+0.5;
    var lineWidth = canvasS - blocks;
    var starRadius = 3;

    ctx.save();
    ctx.beginPath();
    for( var i=0;i<row;i++ ){
      if(i===0){
        ctx.translate(off,off)
        ctx.moveTo(0,0);
        ctx.lineTo(lineWidth,0);
      }else{
        ctx.translate(0,blocks)
        ctx.moveTo(0,0);
        ctx.lineTo(lineWidth,0);
      }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();



    ctx.save();
    ctx.beginPath();
    for( var i=0;i<row;i++ ){
      if(i===0){
        ctx.translate(off,off)
        ctx.moveTo(0,0);
        ctx.lineTo(0,lineWidth);
      }else{
        ctx.translate(blocks,0)
        ctx.moveTo(0,0);
        ctx.lineTo(0,lineWidth);
      }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    var points = [3.5*blocks+0.5,11.5*blocks+0.5];
    for(var i=0;i<2;i++){
      for(var j=0;j<2;j++){
        var x = points[i];
        var y = points[j];
        ctx.save();
        ctx.beginPath();
        ctx.translate(x,y);
        ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
        ctx.fill();
        ctx.closePath();
        ctx.restore()
      }
    }

    // 中间点
    ctx.save();
    ctx.beginPath();
    ctx.translate(7.5*blocks+0.5,7.5*blocks+0.5);
    ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }
  draw();

  drop = function(qizi){
    var bl_qizi = blocks/2*0.8;
    ctx.save();
    ctx.translate((qizi.x+0.5)*blocks,(qizi.y+0.5)*blocks)
    ctx.beginPath();
    ctx.arc(0,0,bl_qizi,0,(Math.PI/180)*360);
    var gradient= ctx.createRadialGradient(0,-8,1,0,0,15);
    if(qizi.color ==1){
      gradient.addColorStop(0,"#6C6C6C");
      gradient.addColorStop(1,"#010101");
      $('#bl_play').get(0).play()
    }else{
      gradient.addColorStop(0,"#FDFDFD");
      gradient.addColorStop(1,"#C1C1C1");
      $('#wt_play').get(0).play()
    }
    ctx.fillStyle=gradient;
    ctx.fill()
    ctx.closePath();
    ctx.restore();
  }

  var kaiguan = true;
  var step = 0;
  var ALL = {};

  panduan = function(qizi){
    var shuju={};
    $.each(ALL,function(k,v){
      if(v.color ===qizi.color){
        shuju[k]=v;
      }
    })
    var su=1,hang=1,zuoxie=1,youxie=1;
    var tx,ty;

    /*竖*/
    tx=qizi.x;ty=qizi.y;
    while (shuju[tx+'-'+(ty+1)]){
      su++;ty++;
    }
    tx=qizi.x;ty=qizi.y;
    while (shuju[tx+'-'+(ty-1)]){
      su++;ty--;
    }

    /*横*/
    tx=qizi.x;ty=qizi.y;
    while (shuju[(tx+1)+'-'+ty]) {
      hang++;tx++;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+ty]){
      hang++;tx--;
    }

    /*左斜*/
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx+1)+'-'+(ty+1)]){
      zuoxie++;tx++;ty++;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+(ty-1)]){
      zuoxie++;tx--;ty--;
    }
    /*右斜*/
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx+1)+'-'+(ty-1)]){
      youxie++;tx++;ty--;
    }
    tx=qizi.x;ty=qizi.y;
    while(shuju[(tx-1)+'-'+(ty+1)]){
      youxie++;tx--;ty++;
    }
    if(su>=5 || hang>=5 || zuoxie>=5 || youxie>=5 ){
      return true;
    }
  }


  $('#canvas').on('click',function(e){
   var x = Math.floor(e.offsetX/blocks);
   var y = Math.floor(e.offsetY/blocks);

   if( ALL[ x + '-' + y ]){
     return;
   }

   var qizi;

   if(kaiguan){
     qizi = {x:x,y:y,color:1,step:step};
     drop(qizi);
     if( panduan(qizi) ){
       $('.cartel').show().find('#tishi').text('黑棋赢');
     };
   }else{
     qizi = {x:x,y:y,color:0,step:step};
     drop(qizi);
     if( panduan(qizi) ){
       $('.cartel').show().find('#tishi').text('白棋赢');
     };
   }
   step += 1;
   kaiguan = !kaiguan;
   ALL[ x + '-' + y ] = qizi;

 });

 $("#restart").on('click',function(){
   $('.cartel').hide();
   ctx.clearRect(0,0,600,600);
   draw();
   kaiguan = true;
   ALL = {};
   step = 1;
 })

 $('#qipu').on('click',function(){
   $('.cartel').hide();
   $('#save').show();
   ctx.save();
   ctx.font = "20px consolas";
   for( var i in ALL){
     if( ALL[i].color === 1){
         ctx.fillStyle = '#fff';
     }else{
       ctx.fillStyle = 'black';
     }
     ctx.textAlign = 'center';
     ctx.textBaseline = 'middle';

     ctx.fillText(ALL[i].step,
       (ALL[i].x+0.5)*blocks,
       (ALL[i].y+0.5)*blocks);
   }
   ctx.restore();
   var image = $('#canvas').get(0).toDataURL('image/jpg',1);
   $('#save').attr('href',image);
   $('#save').attr('download','qipu.png');
 })

 $('.tips').on('click',false);
 $('#close').on('click',function(){
     $('.cartel').hide();
 })
 $('.cartel').on('click',function(){
   $(this).hide();
 })

})
