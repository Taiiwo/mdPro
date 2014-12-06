// object of a markdown document instance
// pass it an ace editor instance
function mdpro(editor){
	// default preview style
	this.previewStyle = "github-markdown";
	// default editor style
	this.editorStyle = "idle_fingers";
	// rename for continuity
	this.editor = editor;
	// open a showdown instance
	this.converter = new Showdown.converter({extensions:['table']});
	this.getText = function(){// get text from the editor
		return this.editor.getValue();
	}
	this.update = function(){// render the markdown in the editor to #preview div.
		// put html in preview div
		var html = this.converter.makeHtml(this.getText());
		var regex = new RegExp("<(/)?(s|S)(c|C)(r|R)(i|I)(p|P)(t|T)>", "g")
		html = html.replace(regex, "<sorry />");
		$('#preview').html(html);
	}
	this.changePreviewStyle = function(style) {// changes css relating to markdown preview
		$('link[href="css/styles/" + this.previewStyle + ".css"]').remove();
		this.previewStyle = style;
		$('head').append($('<link/>')
			.attr('type','text/css')
			.attr('rel','stylesheet')
			.attr('href','css/styles/' + this.previewStyle + '.css')
		);
	}
	this.changeEditorStyle = function(style) {// change ace theme
		this.editor.setTheme("ace/theme/" + style);
	}
	this.export = function(format){// exports the current document to the given format - formats: see export.php
		var subThis = this;
		$.ajax('./css/styles/' + this.previewStyle + ".css", {
			success: function(style){
				var html = $(subThis.converter.makeHtml(subThis.getText()));
				html = $('<body/>')
					.attr('class', 'markdown-body')
					.append($('<style/>')
						.append(style)
					)
					.append(html)
					;
				html = html.prop('outerHTML');
				var form = $('<form/>')
					.attr('method',		'POST'		)
					.attr('target',		'tempIFrame'	)
					.attr('action',		'./export.php'	)
					.attr('id',		'tempForm'	)
					;
				form.append($('<input/>'	)
					.attr('name', 'html'	)
					.attr('value', html	)
				);
				form.append($('<input/>')
					.attr('name', 'type'	)
					.attr('value', format	)
				);
				if ($('iframe[name="tempIFrame"]').length < 1) {
					var iframe = $('<iframe/>')
						.attr('name', 'tempIFrame')
					;
				}
				$('body').append(form	);
				$('body').append(iframe	);
				$('#tempForm').submit(	);
				$('#tempForm').remove(	);
			}
		});
	}
	// set the editor to highlight markdown
	this.editor.getSession().setMode("ace/mode/markdown");
	// set default ace theme
	this.changeEditorStyle(this.editorStyle);
	var subThis = this;
	this.editor.on('change', function(e) {// update preview on change to the editor
		subThis.update();
	});
}
// init ace editor
editor = ace.edit("editor");
// make a markdown document object instance
var mdpro = new mdpro(editor);
$('.export').click(function(e){// set export option click event
	var format = e.target.getAttribute('format');
	mdpro.export(format);
});
$('.style').click( function(e){// set style option click event
	var theme = e.target.getAttribute('theme');
	mdpro.changeEditorStyle(theme);
});
