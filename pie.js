    window.activeSegment = 99;
    window.redrawGraph = function () { //keep the global space clean
        ///// STEP 0 - setup

        // source data table and canvas tag
        var data_table = document.getElementById('mydata');
        var canvas = document.getElementById('canvas');
        var td_index = 1; // which TD contains the data

        ///// STEP 1 - Get the, get the, get the data!

        // get the data[] from the table
        var tds, data = [],
            color, colors = [],
            value = 0,
            total = 0;
        var trs = data_table.getElementsByTagName('tr'); // all TRs
        var tableHeaderHeight = parseInt(getComputedStyle(trs[0])['height'].replace('px'), 10);
        canvas.style.height = (parseInt(getComputedStyle(data_table)['height'].replace('px'), 10) - tableHeaderHeight) + 'px';
        canvas.style.marginTop = (tableHeaderHeight + 2) + 'px';
        for (var i = 0; i < trs.length; i++) {
            tds = trs[i].getElementsByTagName('td'); // all TDs

            if (tds.length === 0) continue; //  no TDs here, move on

            // get the value, update total
            value = parseFloat(tds[td_index].innerHTML);
            data[data.length] = value;
            total += value;

            // random color
            color = getColor(i);
            trs[i].style.backgroundColor = color; // color this TR
        }


        ///// STEP 2 - Draw pie on canvas


        // exit if canvas is not supported
        if (typeof canvas.getContext === 'undefined') {
            return;
        }

        // get canvas context, determine radius and center
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var canvas_size = [canvas.width, canvas.height];
        var radius = (Math.min(canvas_size[0], canvas_size[1]) / 2) * .95;
        var center = [canvas_size[0] / 2, canvas_size[1] / 2];

        var sofar = 0; // keep track of progress
        // loop the data[]
        for (var i = 0; i < trs.length; i++) { // for (var piece in data) {

            var thisvalue = data[i] / total;

            ctx.lineStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(center[0], center[1]); // center of the pie
            ctx.arc( // draw next arc
            center[0],
            center[1], ((i == window.activeSegment) ? radius : (radius * .75)),
            Math.PI * (-0.5 + 2 * sofar), // -0.5 sets set the start to be top
            Math.PI * (-0.5 + 2 * (sofar + thisvalue)),
            false);

            ctx.lineTo(center[0], center[1]); // line back to the center
            ctx.closePath();
            ctx.fillStyle = getColor(i + 1) // trs[piece].style.backgroundColor // color
            ctx.fill();
            ctx.lineWidth = '1'
            ctx.stroke();

            sofar += thisvalue; // increment progress tracker
        }


        ///// DONE!

        function getColor(i) {
            var pallete = Array(
                '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
                '#f1c40f', '#e67e22', '#e74c3c', '#16a085',
                '#c0392b', '#d35400', '#f39c12');
            return pallete[i];
        }

        data_table.style.transform = 'scale(0.1);';

    };
    redrawGraph();
