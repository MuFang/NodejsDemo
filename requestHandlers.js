//------------------------------------------------------------------------------
// The requestHandler of this application.
//------------------------------------------------------------------------------

var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var path = require("path");

function start(response, request) {
	//console.log("Request handler 'start' was called.\n");
	
	var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
		'<form action="/upload" enctype="multipart/form-data" method="post">'+
			'<input type="file" name="upload">'+
			'<input type="submit" value="Upload file" />'+
		'</form>'+
    '</body>'+
    '</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
	//console.log("Request handler 'upload' was called.\n");
	
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	//Set the upload dir of the form, save the pic in the 'tmp' folder under the app's dir.
	form.uploadDir = path.join(__dirname, "tmp"); 
	
	// Save the pic to folder 'upload' which is under the app's dir.
	var saveDir = path.join(__dirname, "uploaded");
	var savePath = path.join(saveDir, "test.jpg");
	
	
	form.parse(request, function(error, fields, files) {
		if(error){
			console.log("form parse error.\n");
			console.log(error);
			return;
		}
		
		console.log("parsing done\n");
		
		fs.renameSync(files.upload.path, savePath);
		console.log("renameSync succeed.");
	
		// Another way to copy the file.
		// Read the temp data from the form and wirte it to app's dir.
	/*	var data;
		try{
			data = fs.readFileSync(files.upload.path,"binary");
			console.log("read data from " + files.upload.path + " succeed.");
			fs.writeFileSync(savePath, data, "binary");
			console.log("write data to " + savePath + " succeed.");
		}catch(e){
			console.log(e);
			return;
		}
	*/
		response.writeHead(200, {"Content-Type": "text/html"});
		console.log("Head has been writed after save the pic.\n");
		response.write("received image from "+files.upload.path+" <br/>");
		response.write("image saved in " + saveDir +  " <br/>" );
		response.write("<img src='/show'>");
		response.end();
	});
}

function show(response, request) {
	//console.log("Request handler 'show' was called.");
	
	var readPath = path.join(__dirname, "uploaded", "test.jpg");
	
	fs.readFile(readPath, "binary", function(error, file) {
		if(error) {
			console.log("read file error when show.\n");
			response.writeHead(500, {"Content-Type": "text/plain"});
			console.log("Head has been writed after show failed.\n");
			response.write(error + "\n");
			response.end();
			return;
		} else {
			console.log("Read image: " + readPath);
			response.writeHead(200, {"Content-Type": "image/jpg"});
			console.log("Head has been writed after show succeed.\n");
			response.write(file, "binary");
			response.end();
			return;
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;