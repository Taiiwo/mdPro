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
		$.post( "export.php", { html: this.converter.makeHtml(this.getText()), type: format } ); function( data ) {
			return data;
		});
	}
}
var mdpro = new mdpro(editor);
editor.on('change', function(e) {mdpro.update();})
$(function() {
	$( "#editor" ).resizable({
		"handles":"e"
	});
});
