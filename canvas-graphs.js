window.CD2 = window.CD2 || {};
window.CD2.utils = window.CD2.utils || {};
window.CD2.utils.getElemsViaCSS = function(selector, elem) {
  return [].slice.call(
    elem.querySelectorAll(selector)
  );
};

(function(){
  let diags = CD2.utils.getElemsViaCSS('table.diagram-enhance', document);
  // process every single table with class="diagram-enhance"
  diags.forEach(function(diag, idx) {
    let getColor = function(i) {
      var pallete = Array(
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6',
        '#f1c40f', '#e67e22', '#e74c3c', '#16a085',
        '#c0392b', '#d35400', '#f39c12');
      return pallete[i];
    };
    
    let tableData = (function() {
      let header = !!diag.querySelector('thead');
      let headers = (
        header ? 
          // use headings under thead if thead exists
          CD2.utils.getElemsViaCSS('thead th', diag) :
          // otherwise we treat the first body row as header row
          CD2.utils.getElemsViaCSS('tbody tr:nth-child(1) > td', diag)
      ).map(function(e){ return e.innerText; }); // re-factor into class method
      let values = (
        header ?
          // get all tbody rows if we have thead
          CD2.utils.getElemsViaCSS('tbody tr', diag) : 
          // skip first tbody row if we don't have thead
          CD2.utils.getElemsViaCSS('tbody tr:not(:nth-child(1))', diag)
      ).map(function(e){
        return {
          "name" : e.querySelector('td:nth-child(1)').innerText,
          "value" : e.querySelector('td:nth-child(2)').innerText
        };
      }); // re-factor into class method
      // console.log(values);
      let total = values.reduce(function(prev, current) {
        return prev + parseFloat(current.value, 10);
      }, 0);
      return {
        "headers": headers,
        "values": values,
        "items": values.length,
        "total": total
      };
    })();
    
    // call to drawTable passing in tableData
    let canvas = document.createElement("canvas");
    canvas.id = (diag.id || "") + "_diag_" + idx;
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas); 
      
    
    (function(tableData, canvas){      
      // exit if canvas is not supported
      if (typeof canvas.getContext === 'undefined') {
        console.error('canvas API unsupported');
        return;
      }
      
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let pie = (function() {
        let radius = (Math.min(canvas.width, canvas.height) / 2) * .95;
        let center = [canvas.width / 2, canvas.height / 2]; 

        let sofar = 0; // keep track of progress

        tableData.values.forEach(function(val, i) {
          let thisvalue = parseFloat(val.value, 10) / tableData.total;
          ctx.lineStyle = 'black';
          ctx.beginPath();
          ctx.moveTo(center[0], center[1]); // center of the pie
          ctx.arc( // draw next arc
            center[0],
            center[1],
            radius,
            Math.PI * (-0.5 + 2 * sofar), // -0.5 sets set the start to be top
            Math.PI * (-0.5 + 2 * (sofar + thisvalue)),
            false
          );

          ctx.lineTo(center[0], center[1]); // line back to the center
          ctx.closePath(); 
          ctx.fillStyle = getColor(i + 1) // trs[piece].style.backgroundColor // color
          ctx.fill();
          ctx.lineWidth = '1'
          ctx.stroke(); 

          sofar += thisvalue; // increment progress tracker
        });
      })();
    })(tableData, canvas);
    // console.log(tableData);
  }); // done processing every table
})();
