function mdpro(editor){
	this.previewStyle = "github-markdown";
	this.editorStyle = "idle_fingers";
	this.editor = editor;
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
	this.changePreviewStyle = function(style) {
		$('link[href="css/styles/" + this.previewStyle + ".css"]').remove();
		this.previewStyle = style;
		$('head').append($('<link/>')
			.attr('type','text/css')
			.attr('rel','stylesheet')
			.attr('href','css/styles/' + this.previewStyle + '.css')
		);
	}
	this.changeEditorStyle = function(style) {
		this.editor.setTheme("ace/theme/" + style);
	}
	this.export = function(format){
		var this2 = this;
		$.ajax('./css/styles/' + this.previewStyle + ".css", {
			success: function(style){
				var html = $(this2.converter.makeHtml(this2.getText()));
				html = $('<body/>')
					.attr('class', 'markdown-body')
					.append($('<style/>')
						.append(style)
					)
					.append(html)
					;
				html = html.prop('outerHTML');
				console.log(html);
				var form = $('<form/>')
					.attr('method',	'POST')
					.attr('target',	'_blank')
					.attr('action',	'./export.php')
					.attr('id',	'tempForm')
					;
				form.append($('<input/>')
					.attr('name', 'html')
					.attr('value', html)
				);
				form.append($('<input/>')
					.attr('name', 'type')
					.attr('value', format)
				);
				$('body').append(form);
				$('#tempForm').submit();
				$('#tempForm').remove();
			}
		});
	}
	// init the editor
	this.editor.getSession().setMode("ace/mode/markdown");
	this.changeEditorStyle(this.editorStyle);
	var subThis = this;
	this.editor.on('change', function(e) {
		subThis.update();
	});
}
editor = ace.edit("editor");
var mdpro = new mdpro(editor);
$('.export').click(function(e){
	var format = e.target.getAttribute('format');
	mdpro.export(format);
});
$('.style').click( function(e){
	var theme = e.target.getAttribute('theme');
	mdpro.changeEditorStyle(theme);
});
