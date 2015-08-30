/**
 * Lanoput.js 0.2.1
 *
 * Change input language of input/textarea automatically to comply with the element lang attribute
 * forked from FarsiType 1.3.6 (http://www.farsitype.ir)d
 *
 *  Copyright 2015 by Mahmoud Mostafa <mah@moud.info>
 *  Copyright 2002-2011 by Kaveh Ahmadi <http://www.kavehahmadi.com>, <email: me@kavehahmadi.com)>
 *
 * This file is part of Lanoput.
 *
 * Lanoput is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Lanoput is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Lanoput.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

// insertAdjacentHTML(), insertAdjacentText() and insertAdjacentElement() for Netscape 6/Mozilla by Thor Larholm me@jscript.dk
if (typeof HTMLElement !== "undefined" && ! HTMLElement.prototype.insertAdjacentElement) {
  HTMLElement.prototype.insertAdjacentElement = function (where,parsedNode) {
    switch (where) {
      case 'beforeBegin':
        this.parentNode.insertBefore(parsedNode, this);
      break;
      case 'afterBegin':
        this.insertBefore(parsedNode, this.firstChild);
      break;
      case 'beforeEnd':
        this.appendChild(parsedNode);
      break;
      case 'afterEnd':
        if (this.nextSibling)
      this.parentNode.insertBefore(parsedNode, this.nextSibling);
      else
        this.parentNode.appendChild(parsedNode);
      break;
    }
  };

  HTMLElement.prototype.insertAdjacentHTML = function (where,htmlStr) {
    var r = this.ownerDocument.createRange();
    r.setStartBefore(this);
    var parsedHTML = r.createContextualFragment(htmlStr);
    this.insertAdjacentElement(where,parsedHTML);
  };

  HTMLElement.prototype.insertAdjacentText = function (where,txtStr) {
    var parsedText = document.createTextNode(txtStr);
    this.insertAdjacentElement(where, parsedText);
  };
}

// make it a global variable (was required for meteor)
window.lanoput = {
  // initialize an empty object to be filled by languages by loading language
  // scripts such as lanoput.ar.js
  languages : {},
  enabled: true,
  counter: 0,
  ShowChangeLangButton: 1,	// 0: Hidden / 1: Visible
  KeyBoardError: 0,		// 0: Disable lanoput / 1: Show Error
  ChangeDir: 2,			// 0: No Action / 1: Do Rtl-Ltr / 2: Rtl-Ltr button
  UnSupportedAction: 0		// 0: Disable lanoput / 1: Low Support
};

lanoput.toggle = function(Dis) {
  var invis, obj;

  if (!Dis.checked)  {
    lanoput.enabled = true;
    disable = false;
    color = 'darkblue';
  } else {
    lanoput.enabled = false;
    disable = true;
    color = '#ECE9D8';
  }

  if (lanoput.ShowChangeLangButton == 1) { 
    for (var i=1; i<= lanoput.counter; i++) {
      obj = document.getElementById('FarsiType_button_' + i);
      obj.disabled = disable;
      obj.style.backgroundColor = color;
    }
  }
};

lanoput.disable = function() {
  lanoput.enabled = false;
  var Dis = document.getElementById('disableFarsiType');
  if (Dis !== null) {
    Dis.checked = true;
  }

  if (lanoput.ShowChangeLangButton == 1) { 
    for (var i=1; i<= lanoput.counter; i++) {
      obj = document.getElementById('FarsiType_button_' + i);
      obj.disabled = true;
      obj.style.backgroundColor = '#ECE9D8';
    }
  }
};

lanoput.init = function() {
  var Inputs = document.getElementsByTagName('INPUT'), i;
  lanoput.counter = 0;
  for (i=0; i<Inputs.length; i++) {
    // TODO enable aliases
    if ((Inputs[i].type.toLowerCase() == 'text') && lanoput.languages[Inputs[i].lang.toLowerCase()]) {
      lanoput.counter++;
      if (typeof Inputs[i].lanoput === "undefined")
        new lanoput.KeyObject(Inputs[i], lanoput.counter);
    }
  }

  var Areas = document.getElementsByTagName('TEXTAREA');
  for (i=0; i<Areas.length; i++) {
    // TODO enable aleases
    if (lanoput.languages[Areas[i].lang.toLowerCase()]) {
      lanoput.counter++;
      if (typeof Areas[i].lanoput === "undefined")
        new lanoput.KeyObject(Areas[i], lanoput.counter);
    }
  }

  var Dis = document.getElementById('disableFarsiType');
  if (Dis !== null) {
    lanoput.toggle(Dis);
    Dis.onclick = function() { lanoput.toggle(this); };
  }
};

lanoput.KeyObject = function(z,x) {
  GenerateStr = "";
  if (lanoput.ShowChangeLangButton == 1) {
    GenerateStr = GenerateStr + "<input type='button' id=FarsiType_button_"+x+" style='border: none; background-color:darkblue; font-size:11; color:white; font-family:tahoma; padding: 1px; margin: 1px; width: auto; height: auto;' value='"+z.lang.toUpperCase()+"' />&nbsp;";
  }
  if (lanoput.ChangeDir == 2) {
    GenerateStr = GenerateStr  + "<input type='button' id=FarsiType_ChangeDir_"+x+" style='border: none; background-color:darkblue; font-size:11; color:white; font-family:tahoma; padding: 1px; margin: 1px; width: auto; height: auto;' value='"+lanoput.languages[z.lang].direction.toUpperCase()+"' />";
  }
  z.insertAdjacentHTML("afterEnd", GenerateStr);

  if (lanoput.ShowChangeLangButton == 1) { 
    z.bottelm = document.getElementById ('FarsiType_button_' + x);
    z.bottelm.title = 'Change lang to english';
  }
  if (lanoput.ChangeDir == 2) {
    z.Direlm = document.getElementById ('FarsiType_ChangeDir_' + x); 
  }

  z.lanoput = true;
  z.dir = lanoput.languages[z.lang].direction;
  z.align = z.dir == "rtl" ? "right" : "left";

  z.style.textAlign = z.align;
  z.style.direction = z.dir;

  setSelectionRange = function(input, selectionStart, selectionEnd) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  };

  ChangeDirection = function() {
    if (z.dir == "rtl") {
      z.dir = "ltr";
      z.align = "left";
      z.Direlm.value = "LTR";
      z.Direlm.title = "Change direction: Right to Left";
    } else {
      z.dir = "rtl";
      z.align = "right";
      z.Direlm.value = "RTL";
      z.Direlm.title = "Change direction: Left to Right";
    }
    z.style.textAlign = z.align;
    z.style.direction = z.dir;
    z.focus();
  };

  ChangeLang = function(e, ze) {
    if(ze)
      z = ze;

    if (lanoput.enabled) {
      if (z.lanoput) {
        z.lanoput = false;
        if (lanoput.ShowChangeLangButton == 1) { 
          z.bottelm.value = "EN";
          z.bottelm.title = 'Change lang to '+lanoput.languages[z.lang].title;
        }
        if (lanoput.ChangeDir == 1) {
          z.style.textAlign = "left";
          z.style.direction = "ltr";
        }
      } else {
        z.lanoput = true;
        if (lanoput.ShowChangeLangButton == 1) { 
          z.bottelm.value = z.lang.toUpperCase();
          z.bottelm.title = 'Change lang to English';
        }
        if (lanoput.ChangeDir == 1 && lanoput.languages[z.lang].direction == "rtl") {
          z.style.textAlign = "right";
          z.style.direction = "rtl";
        }
      }
      z.focus();
    }
    
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
    return false;
  };

  Convert = function(e) {

    if (e === null)
      e = window.event;

    var key = e.which || e.charCode || e.keyCode;
    var eElement = e.target || e.originalTarget || e.srcElement;

    if (e.ctrlKey && e.altKey && key == 32) {
      ChangeLang(e, z);
    }

    if (lanoput.enabled) {
      if (
        (e.charCode !== null && e.charCode != key) ||
        (e.which !== null && e.which != key) ||
      (e.ctrlKey || e.altKey || e.metaKey) ||
    (key == 13 || key == 27 || key == 8)
      ) return true;

      //check windows lang
      if (key > 128) {
        if (lanoput.KeyBoardError === 0) {
          lanoput.disable();
        } else {
          alert("Please change your windows language to English");
          return false;
        }
      }

      // If Farsi
      if (lanoput.enabled && z.lanoput) {

        //check CpasLock
        if ((key >= 65 && key <= 90&& !e.shiftKey) || (key >= 97 && key <= 122 ) && e.shiftKey) {
          alert("Caps Lock is On. To prevent entering farsi incorrectly, you should press Caps Lock to turn it off.");
          return false;
        }

        // SHIFT+SPACE -> ZWNJ (use shift+space for separating words without space for farsi language)
        if (key == 32 && e.shiftKey)
          key = 8204;
        else
          key = lanoput.languages[z.lang].keymap[key-32];

        key = typeof key == 'string' ? key : String.fromCharCode(key);

        // to farsi
        try {

          var docSelection = document.selection;
          var selectionStart = eElement.selectionStart;
          var selectionEnd = eElement.selectionEnd;

          if (typeof selectionStart == 'number') {
            //FOR W3C STANDARD BROWSERS
            var nScrollTop = eElement.scrollTop;
            var nScrollLeft = eElement.scrollLeft;
            var nScrollWidth = eElement.scrollWidth;

            eElement.value = eElement.value.substring(0, selectionStart) + key + eElement.value.substring(selectionEnd);
            setSelectionRange(eElement, selectionStart + key.length, selectionStart + key.length);

            var nW = eElement.scrollWidth - nScrollWidth;
            if (eElement.scrollTop === 0) { eElement.scrollTop = nScrollTop; }
          } else if (docSelection) {
            var nRange = docSelection.createRange();
            nRange.text = key;
            nRange.setEndPoint('StartToEnd', nRange);
            nRange.select();
          }

        } catch(error1) {
          try {
            // IE
            e.keyCode = key;
          } catch(error2) {
            try {
              // OLD GECKO
              e.initKeyEvent("keypress", true, true, document.defaultView, false, false, true, false, 0, key, eElement);
            } catch(error3) {
              //OTHERWISE
              if (lanoput.UnSupportedAction === 0) {
                alert('Sorry! no lanoput support');
                lanoput.disable();
                var Dis = document.getElementById('disableFarsiType');
                if (Dis !== null) {
                  Dis.disabled = true;
                }
                return false;
              } else {
                eElement.value += key;
              }
            }
          }
        }

        if (e.preventDefault)
          e.preventDefault();
        e.returnValue = false;
      }
    }
    return true;
  };

  if (lanoput.ShowChangeLangButton == 1) { z.bottelm.onmouseup = ChangeLang; }
  if (lanoput.ChangeDir == 2) { z.Direlm.onmouseup = ChangeDirection; }
  z.onkeypress = Convert;
};

if (window.attachEvent) {
  window.attachEvent('onload', lanoput.init);
} else if (window.addEventListener) {
  window.addEventListener('load', lanoput.init, false);
}
