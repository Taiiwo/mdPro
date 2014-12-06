<?php
$html = 	$_REQUEST['html'];
$format = 	$_REQUEST['type'];

// if not $format in ['pdf','docx','odt','xml','html','markdown']:
if (!in_array($format, array('pdf','docx','odt','xml','html','markdown'))){
	die("Invalid Format");
}
//Save string into temp file
$file = tempnam(sys_get_temp_dir(), 'POST');
file_put_contents($file, $html);

//set POST variables
$url = 'http://c.docverter.com/convert';
$fields = array('from' => 'html',
    'to' => $format,
    'input_files[]' => '@'.$file
);
if ( $format == "docx" ){
	$fields.append(
		
	);
}
//open connection
$ch = curl_init();
//set options
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //needed so that the $result=curl_exec() output is the file and isn't just true/false
//execute post
$result = curl_exec($ch);
//close connection
curl_close($ch);
//write to file
header("Content-disposition: attachment;filename=export.$format");
echo $result;
?>
