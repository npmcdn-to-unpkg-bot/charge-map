function piechart(data) {
	var chart = c3.generate({
	    data: {
	        // iris data from R
	        columns: data,
	        type : 'pie',
	        onclick: function (d, i) { console.log("onclick", d, i); },
	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
	    }
	});
}
