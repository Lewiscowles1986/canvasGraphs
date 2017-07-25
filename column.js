window.CD2 = window.CD2 || {};
window.CD2.UI = window.CD2.UI || {};
window.CD2.UI.chart = window.CD2.UI.chart || {};
window.CD2.UI.charts = window.CD2.UI.charts || {};
window.CD2.UI.charts.barChart = function(elem, options) {
    options = ((typeof options == 'object') ? options : {});
    var _elem = elem;
    var tds, data = [],
        color, colors = [],
        value = 0, total = 0,
        activeSegment = 99,
        maxBarHeight = 0,
        depth = ( options.depth || ( ( options.threeD || false ) ? 10 : 0 ) ),
        ctx,
        border = ( options.border || false ),
        pallette = {
            'light': [
                '#1abc9c',
                '#2ecc71',
                '#3498db',
                '#9b59b6',
                '#f1c40f',
                '#e67e22',
                '#e74c3c',
                'rgb(216, 123, 209)',
                '#999999'
            ],
            'dark': [
                'rgb(22, 154, 128)',
                'rgb(39, 172, 95)',
                'rgb(44, 128, 184)',
                'rgb(130, 78, 151)',
                'rgb(224, 183, 16)',
                'rgb(201, 110, 29)',
                'rgb(197, 66, 52)',
                'rgb(167, 95, 161)',
                '#666666'
            ]
        };
    var canvas = document.createElement('canvas');
    
    var getColor = function(i) {
        return pallette.light[i];
    };
    var getDarkColor = function(i) {
        return pallette.dark[i];
    };
    var getHeight = function( elem ) {
        return parseInt( getComputedStyle( elem )['height'].replace('px'), 10);
    };
    var getWidth = function( elem ) {
        isCanvasFW = ( (elem.nodeName.toLowerCase() == 'canvas') && (elem.style.width == '100%') );
        isParentBody = ( elem.parentNode.nodeName.toLowerCase() == 'body' );
        return (isCanvasFW ? ( isParentBody ? window.innerWidth : elem.parentNode.width ) : elem.width );
    };
    var init = function() {
        var tableHeaderHeight = getHeight( _elem.getElementsByTagName('tr')[0] ),
            canvasHeight = ( getHeight( _elem ) - tableHeaderHeight ) - 4;
        
        canvas.style.height =  canvasHeight + 'px';
        canvas.style.width = options.width || '100%';
        _elem.parentNode.insertBefore( canvas, _elem );
        canvas.width = getWidth(canvas);
        ctx = canvas.getContext('2d');
    };
    var getTableRows = function() {
        return _elem.getElementsByTagName('tr');
    };
    var getData = function() {
        var trs = getTableRows();
        for (var i = 0; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName('td'); // get all cols
            if (tds.length < 2) continue; // skip header or blank rows

            // get the value, update total
            value = parseFloat(tds[tds.length-1].innerHTML);
            data[data.length] = value;
            maxBarHeight = Math.max( maxBarHeight, value );
            total += value;
        }
        return data;
    }
    this.setTableVisibility = function(vis) {
        _elem.style.display = vis ? '' : 'none';
    }
    this.redraw = function(data) {
        if (typeof canvas.getContext === 'undefined') {
            return;
        }
        
        var canvas_size = [getWidth(canvas), canvas.height],
            sofar = 0, // keep track of progress
            elemWidth = (((canvas_size[0]-1)-depth) / (data.length) ),
            spacing = 0,
            yScale = 1,
            trs = getTableRows();
        console.log(canvas_size);
        ctx.clearRect(0, 0, canvas_size[0], canvas_size[1]);
        if(((maxBarHeight/total)*canvas.height) >= canvas.height) {
            while( ( (((maxBarHeight/total)*canvas.height) >= canvas.height) * yScale ) >= canvas.height) {
                yScale -= 0.025;
            }
        } else {
            yScale = Math.max( ( ( ( ( ( canvas.height * (maxBarHeight / total) ) - depth) ) / 100 ) +1 ), 1);
        }
        
        for (var i = 0; i < data.length; i++) { // for (var piece in data) {

            var thisvalue = data[i] / total;
            
            var xMin = ((i)*elemWidth);
            if(depth > 0) { // 3D Rendering
                for(n=depth;n>0;n--) {
                    ctx.fillStyle = getDarkColor(i);
                    ctx.fillRect(xMin+n,(canvas.height)-n,(elemWidth-spacing),-((thisvalue*canvas.height)*yScale) );
                }
            }
            ctx.fillStyle = getColor(i);
            ctx.fillRect(xMin,(canvas.height),(elemWidth-spacing),-((thisvalue*canvas.height)*yScale) );
            if(depth <= 0 && border) {
                ctx.strokeStyle = border.color || border;
                ctx.lineWidth = border.width || '1';
                ctx.strokeRect(xMin,(canvas.height),(elemWidth-spacing),-(thisvalue*canvas.height)*yScale );
            }

            sofar += thisvalue; // increment progress tracker
            
            // random color
            color = getColor(i);
            trs[ i+1 ].style.backgroundColor = color; // color this TR
        }
    }
    init();
    this.redraw(getData());
};

new window.CD2.UI.charts.barChart( document.getElementById('data1'), {} ).setTableVisibility(false);
new window.CD2.UI.charts.barChart( document.getElementById('data1'), {border:1} );
new window.CD2.UI.charts.barChart( document.getElementById('data1'), {border:{color:'#ff0000',width:5}} );
new window.CD2.UI.charts.barChart( document.getElementById('data1'), {depth:5,border:{color:'#ff0000',width:5}} );
new window.CD2.UI.charts.barChart( document.getElementById('data1'), {threeD:true,border:{color:'#ff0000',width:5}} );
// {depth:5,border:{color:'#ff0000',width:5}}
