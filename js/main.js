function mdpro(editor){
	this.getText = function(){
		return editor.getValue();
	}
	this.converter = new Showdown.converter({extensions:['table']});
	this.update = function(){
		// put html in preview div
		var html = this.converter.makeHtml(this.getText());
		var regex = new RegExp("<(/)?(s|S)(c|C)(r|R)(i|I)(p|P)(t|T)>", "g")
		html = html.replace(regex, "<sorry />");
		$('#preview').html(html);
	}
	this.export = function(format){
		var form = $('<form/>')
			.attr('method',	'POST')
			.attr('target',	'_blank')
			.attr('action',	'./export.php')
			.attr('id',	'tempForm')
			;
		form.append($('<input/>')
			.attr('name', 'html')
			.attr('value', this.converter.makeHtml(this.getText()))
		);
		form.append($('<input/>')
			.attr('name', 'type')
			.attr('value', format)
		);
		$('body').append(form);
		$('#tempForm').submit();
		$('#tempForm').remove();
	}
}
var mdpro = new mdpro(editor);
editor.on('change', function(e) {mdpro.update();})
$(function() {
	$( "#editor" ).resizable({
		"handles":"e"
	});
});
$('.export').click(function(e){
	var format = e.target.getAttribute('format');
	mdpro.export(format);
});
