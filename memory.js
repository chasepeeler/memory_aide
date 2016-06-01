$(function(){

	$('#clear_practice').click(function(){
		initInputs();
		return false;
	});

	$('#input_form').submit(function(event){
		event.stopPropagation();

		var text = $('#full_text').val().trim();
		setCookie('pageText',text);
		text = text.replace(/[^\s\w]/g,'');
		var words = text.split(/\s+/);

		$('#practice_inputs').html("");

		$.each(words,function(key,word){
			
			var formGroup = $("<div></div>");
			formGroup.addClass('form-group');
			
			var row = $("<div></div>");
			row.addClass("row");
			
			formGroup.append(row);
			
			var colOne = $("<div></div>");
			colOne.addClass('col-md-9');
			
			var colTwo = $("<div></div>");
			colTwo.addClass('col-md-3');
			
			row.append(colOne);
			row.append(colTwo);
			
			var inputId = 'practice_input_' + (key);
			
			var label = $("<label></label>");
			label.html('Word #'+(key+1));
			label.attr("for",inputId);
			label.addClass('control-label');
			label.addClass('sr-only');
			colOne.append(label);
			
			var inputGroup = $('<div></div>');
			inputGroup.addClass('input-group');
			
			colOne.append(inputGroup);
			
			var span = $('<span></span>');
			span.addClass('input-group-addon');
			
			var cb = $("<input></input>");
			cb.attr('type','checkbox');
			span.append(cb);
			
			inputGroup.append(span);
			
			
			var input = $("<input></input>");
			input.attr('type','text');
			input.attr('rel',word);
			input.attr('next','practice_input_'+(key+1));
			input.attr('id', inputId);
			input.attr('name', inputId);
			input.addClass('word');
			input.addClass('form-control');
			input.attr('tabindex',key+1);
			input.attr('aria-describedby',inputId+"_status");
			input.attr('autocomplete','off');
			input.keyup(checkInput);
			inputGroup.append(input);
			
			span = $("<span></span>");
			span.addClass('glyphicon');
			span.addClass('form-control-feedback');
			span.attr('aria-hidden',"true");
			
			colOne.append(span);
			
			span = $("<span></span>");
			span.addClass('sr-only');
			span.attr('id',inputId+"_status");
			
			colOne.append(span);
			
			
			var btnGrp = $('<div></div>');
			btnGrp.addClass('btn-group');
			
			colTwo.append(btnGrp);
			
			var button = $("<button></button>");
			button.attr('type','button');
			button.addClass('btn');
			button.addClass('btn-default');
			button.html("Hint");
			button.click(showHint);
			btnGrp.append(button);
			
			
			button = $("<button></button>");
			button.attr('type','button');
			button.addClass('btn');
			button.addClass('btn-default');
			button.html("Reveal");
			button.click(showAll);
			btnGrp.append(button);
			
			
			
			
			$('#practice_inputs').append(formGroup);

		});
		initInputs();
		$('#practice_form').show('slide',{direction:'up'});
		$('practice_input_0').focus();
		return false;
	});
	var cookieText = getCookie('pageText');
	if(cookieText.trim() != ""){
		$('#full_text').val(cookieText);
		$('#input_form').submit();
	}
	
});


updateStatus = function(input,status){
	var glyph = {
		"error": "glyphicon-remove",
		"success": "glyphicon-ok",
		"warning": "glyphicon-warning-sign"
	};
	
	input.closest('.form-group').addClass('has-feedback');
	input.closest('.form-group').removeClass('has-error');
	input.closest('.form-group').removeClass('has-success');
	input.closest('.form-group').removeClass('has-warning');
	input.closest('.form-group').find('.glyphicon').removeClass('glyphicon-ok');
	input.closest('.form-group').find('.glyphicon').removeClass('glyphicon-remove');
	input.closest('.form-group').find('.glyphicon').removeClass('glyphicon-warning-sign');
	
	if(status != ""){
		input.closest('.form-group').addClass('has-'+status);
		input.closest('.form-group').find('.glyphicon').addClass(glyph[status]);
	}
	
}

showHint = function(event){
	var input = $(event.target).closest('.form-group').find('.word');
	var val = input.val();
	var next = input.attr('rel').substring(val.length,val.length+1);
	input.val(val+next);
	if(checkComplete(input)){
		updateStatus(input,'error');
	} else {
		updateStatus(input,'warning');
	}
	var cb = $(event.target).closest('.form-group').find('input[type="checkbox"]');
	if(cb.prop('checked') == false) {
		cb.prop('checked', true);
		cb.addClass('autocheck');
	}

	return false;
};

showAll = function(event){
	var input = $(event.target).closest('.form-group').find('.word');
	input.val(input.attr('rel'));
	checkComplete(input);
	updateStatus(input,'error');
	var cb = $(event.target).closest('.form-group').find('input[type="checkbox"]');
	if(cb.prop('checked') == false) {
		cb.prop('checked', true);
		cb.addClass('autocheck');
	}
	return false;
};

initInputs = function(){
	var inputs = $('.word');
	$.each(inputs,function(key,value){
		value = $(value);
		value.val(value.attr('rel').substring(0,1));
		updateStatus(value,"");
	});
};

checkInput = function(event){

		var input = $(event.target);
		var text = input.val();
		var expected = input.attr('rel');
		var first_letter = expected.substring(0, 1);
		if(event.keyCode != 13 && text.length == 1 && first_letter.toLowerCase() != text.toLowerCase()) {
			input.val(first_letter);
			return false;
		} else if(event.keyCode !=13 && text.length == 2){
			var second_letter = expected.substring(1,1);
			if(first_letter.toLowerCase() !== second_letter.toLowerCase() && text.toLowerCase() == (first_letter+first_letter).toLowerCase()){
				input.val(first_letter);
				return false;
			}
		}

	if(event.keyCode == 13) {
		return checkComplete(input);
	}



};

checkComplete = function(input){
	var text = input.val();
	var expected = input.attr('rel');

	if(text.toLowerCase() == expected.toLowerCase()) {
		var next = input.attr('next');
		updateStatus(input,'success');
		if($('#' + next)) {
			$('#' + next).focus();
		} else {
			$('#clear_practice').focus();
		}
		return true;
	} else {
		input.focus();
		return false;
	}
};


setCookie = function(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (10*365*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; " + expires;
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' '){
			c = c.substring(1);
		}
        if (c.indexOf(name) == 0){
			var val = decodeURIComponent(c.substring(name.length, c.length));
			setCookie(cname,val);
			return val;
		}
    }
    return "";
};


