var baseMap1 = 	L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    			attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
				});
baseMap1.setZIndex(-1);

var baseMap2 = 	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				});

baseMap2.setZIndex(-1);

var currentMap = 1;

$("#login").on('click', function(e) {
  $("#loginForms").find(".error").hide();
  $("#loginForms .msgPopup").hide();
  $("#loginForms #createAccountForm").hide();
  $("#loginForms #initSessionForm").show();
  $.fancybox($("#loginForms"), {
    'width':'640',
    'height': 'auto',
    'padding': '0',
    'autoDimensions':false,
    'autoSize':false,
    'closeBtn' : false,
    'scrolling'   : 'no',
    helpers : {
         overlay: {
           css: {'background-color': 'rgba(0,0,102,0.85)'}
         }
    },
    afterShow: resetForm
  });
  return false;
});

$("#signin_btn").on('click', function(){
  var $form = $('#initSessionForm');
  $form.find("input[type='text']").removeClass('invalid');
  $form.find("input[type='password']").removeClass('invalid');
  var $submit_btn = $form.find('#signin_btn');
  $submit_btn.attr('disabled','disabled');
  $submit_btn.attr('value','Iniciando sesión...');

  var user = $form.find("input.user").val();
  var passw = $form.find("input[type='password']").eq(0).val()
  var name='', email = '', passw_conf = '';
  var $user = $form.find("input.user");


  name = $form.find("input.name").val();
  email = $form.find("input.email").val();
  passw_conf = $form.find("input[type='password']").eq(1).val();

  if(user == ""){
    $form.find("input.user").addClass('invalid');
  }

  if(email == ""){
    $form.find("input.email").addClass('invalid');
  }

  if(name == ""){
    $form.find("input.name").addClass('invalid');
  }

  if( passw == "" || passw != passw_conf ){
    $form.find("input[type='password']").addClass('invalid');
  }

    if(user!='' && passw!=''){
        var now = $.now();
        var passw_sum = md5(passw);
        $.ajax({
            url : "/api/login/",
            headers:{ "username": _.escape(user), "timestamp": now, "hash": md5(user + passw_sum + now)},
            type: "POST",
            success: function(result) {
                $.fancybox.close()
                localStorage.setItem('user', user);
                localStorage.setItem('password', passw_sum);
                localStorage.setItem('admin', result.admin);
                app.isAdmin = result.admin;
                $("#login").hide();
                $("#logout").show();
                app.ajaxSetup();
                $submit_btn.removeAttr('disabled');
                $submit_btn.attr('value','Acceder');
            },
            error: function(){
                localStorage.removeItem('user');
                localStorage.removeItem('password');
                localStorage.removeItem('admin');
                $("#initSessionForm").find(".error").fadeIn();
                $submit_btn.removeAttr('disabled');
                $submit_btn.attr('value','Acceder');
            }
        });
    }
});

$("#logout").on('click', function() {
	localStorage.removeItem('user');
	localStorage.removeItem('password');

	$(".groupLauyerConfig").css({"background-color":""});
	$(".groupLauyerConfig").attr("src","/img/map/ALB_icon_config_toc.svg");
	$("#configPanelMap").fadeOut();


	$("#login").show();
	$("#logout").hide();
  app.router.navigate("",{trigger: true});

	return false;
});

$('#initSessionForm input').keydown(function (e){
  if(e.keyCode == 13){
    $("#signin_btn").trigger("click");
  }
});

$('#loginForms a.loginWindow').click(function(e){
  $('#createAccountForm').slideUp();
  $('#initSessionForm').slideDown();
  $('#createAccountForm').promise().done(function(){
    $('#createAccountForm').addClass('hidden');
    $('#initSessionForm').removeClass('hidden');
    resetForm();
    $(window).trigger('resize');
  });
});

$('#loginForms a.signinWindow').click(function(e){
    $('#initSessionForm').slideUp();
    $('#createAccountForm').slideDown();
    $('#createAccountForm').promise().done(function(){
        $('#initSessionForm').addClass('hidden');
        $('#createAccountForm').removeClass('hidden');
        resetForm();
        $(window).trigger('resize');
    });
});

$('#signinSuccess input').click(function(e){
    $.fancybox.close();
});

$("#loginForms .legal a").on('click',function(e){
    $.fancybox.close();
});

$("#signinConfirmation input").click(function(e){
    $.fancybox.close();
});

$("#signinError input").click(function(e){
    $.fancybox.close();
});

function resetForm() {
    var $form = $('#loginForms .loginForm:not(.hidden)');

    $form.find("input[type='text']").val('');
    $form.find("input[type='password']").val('');
    $form.find(".invalid").removeClass("invalid");
    $form.find("span").remove();
}

function showSigninConfirmation(user, passw) {
  localStorage.setItem('user', user);
  localStorage.setItem('password', passw);
  $("#login").hide();
  $("#logout").show();
  app.ajaxSetup();

  $.fancybox($("#signinConfirmation"), {
    'width':'640',
    'height': 'auto',
    'padding': '0',
    'autoDimensions':false,
    'autoSize':false,
    'closeBtn' : false,
    'scrolling'   : 'no',
    helpers : {
         overlay: {
           css: {'background-color': 'rgba(0,0,102,0.85)'}
         }
    },
    afterShow: function () {
      $("#signinConfirmation").css('display', 'block');
    }
  });
}

function showSigninError() {
  $.fancybox($("#signinError"), {
    'width':'640',
    'height': 'auto',
    'padding': '0',
    'autoDimensions':false,
    'autoSize':false,
    'closeBtn' : false,
    'scrolling'   : 'no',
    helpers : {
         overlay: {
           css: {'background-color': 'rgba(0,0,102,0.85)'}
         }
    },
    afterShow: function () {
      $("#signinError").css('display', 'block');
    }
  });
}

function md5(str) {
  var xl;

  var rotateLeft = function(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function(x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function(x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function(x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function(x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function(str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function(lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = this.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
}


function utf8_encode(argString) {
	  if (argString === null || typeof argString === 'undefined') {
	    return '';
	  }

	  var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	  var utftext = '',
	    start, end, stringl = 0;

	  start = end = 0;
	  stringl = string.length;
	  for (var n = 0; n < stringl; n++) {
	    var c1 = string.charCodeAt(n);
	    var enc = null;

	    if (c1 < 128) {
	      end++;
	    } else if (c1 > 127 && c1 < 2048) {
	      enc = String.fromCharCode(
	        (c1 >> 6) | 192, (c1 & 63) | 128
	      );
	    } else if ((c1 & 0xF800) != 0xD800) {
	      enc = String.fromCharCode(
	        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
	      );
	    } else { // surrogate pairs
	      if ((c1 & 0xFC00) != 0xD800) {
	        throw new RangeError('Unmatched trail surrogate at ' + n);
	      }
	      var c2 = string.charCodeAt(++n);
	      if ((c2 & 0xFC00) != 0xDC00) {
	        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
	      }
	      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
	      enc = String.fromCharCode(
	        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
	      );
	    }
	    if (enc !== null) {
	      if (end > start) {
	        utftext += string.slice(start, end);
	      }
	      utftext += enc;
	      start = end = n + 1;
	    }
	  }

	  if (end > start) {
	    utftext += string.slice(start, stringl);
	  }

	  return utftext;
	}

// Dado un formulario o capa que contenga un formulario, crea un objeto con todos los campos y sus valores
$.fn.serializeObject = function () {
    "use strict";
    var a = {}, b = function (b, c) {
        var d = a[c.name];
        "undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
    };
    return $.each(this.children().serializeArray(), b), a
};


function getTextLang(text){
	if(text == "legend"){
		if(app.lang =="es"){
			return "Mostrar leyenda";
		}else if(app.lang == "en"){
			return "Show legend";
		}else{
			return "Afficher la légende";
		}

	}else if(text == "opacity"){
		if(app.lang =="es"){
			return "Cambiar opacidad";
		}else if(app.lang == "en"){
			return "Change opacity";
		}else{
			return "Changer l'opacité";
		}

	}else if(text == "info"){
		if(app.lang =="es"){
			return "Mostrar información";
		}else if(app.lang == "en"){
			return "Show info";
		}else{
			return "Afficher les informations";
		}
	}else if(text == "remove"){
		if(app.lang =="es"){
			return "Eliminar capa";
		}else if(app.lang == "en"){
			return "Remove layer";
		}else{
			return "Supprimer le calque";
		}
	}
}
