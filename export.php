<?php
$html = 	$_REQUEST['html'];
$format = 	$_REQUEST['type'];

// if not $format in ['markdown',rst','html','latex',
//	'context','mediawiki','textile','org','texinfo',
//	'docbook','docx','epub','mobi','asciidoc','rtf']:
if (!in_array($format, array('markdown',rst','html','latex',
      'context','mediawiki','textile','org','texinfo',
      'docbook','docx','epub','mobi','asciidoc','rtf'))){
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
		'other_files[]' => '@css/styles/template.docx',
		'table_of_contents',
		'template' => 'template.docx'
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
