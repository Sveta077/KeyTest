let body = document.querySelector('body');
aHtmlText = "<div style='text-align: center;'>"+
"<h1>Virtual keyboard</h1>"+
"<p>Use for Windows. Supported languages: english, russian (click to \"planet\")</p>"+
"</div>"+
"<table border='0' style='width: 100%;'>"+
"<tr>"+
  "<td>"+
    "<form class=\"form-horizontal\" style='text-align: center;'>"+
    "<div class=\"form-group\">"+
      "<label for=\"inputEmail3\" class='control-label frace'>Add your text:</label>"+
        "<input data-virtual-element type=\"text\" class=\"form-control resize\" id=\"inputEmail3\">"+
    "</div>"+
  "</form>"+
  "</td>"+
  "<td>"+
    "<div id='tabular-virtual-keyboard'></div>"+
  "</td>"+
"</tr>"+
"</table>"
body.insertAdjacentHTML('beforeend', aHtmlText)
let VirtualKeyboard = {
  generate: function(target, matrix, language, uppercase = false) {
    let owner = this;
    
    for(let i = 0; i < matrix.length; i++) {
      let position = matrix[i];
      
      let vkel = document.createElement('div');
      vkel.setAttribute('class', 'virtual-keyboard-row');
      
      let vkcol = document.createElement('div');
      vkcol.setAttribute('class', 'virtual-keyboard-column');
      
      for (let j = 0; j < position.length; j++) {
        let button = document.createElement('button');
        
        switch(matrix[i][j]) {
          case '+backspace': 
            button.innerHTML = '<i class="fa fa-fw fa-long-arrow-left"></i>';
            button.setAttribute('data-trigger', 'backspace');
            button.setAttribute('title', 'Backspace');
            let mouseTimerHandler = null;
            button.addEventListener("mousedown", function(event) {

              mouseTimerHandler = setInterval(function(){
                if (event.which == 1) {
                  _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                }
              }, 200);
            }, false);
            button.addEventListener("mouseup", function() {
              clearTimeout(mouseTimerHandler);
            });
            break;
          case '+international':
            button.innerHTML = '<i class="fa fa-fw fa-globe"></i>';
            button.setAttribute('data-trigger', 'international');
            button.setAttribute('title', 'International');
            break;
          case '+shift':
            button.innerHTML = '<i class="fa fa-fw fa-arrow-up"></i>';
            button.setAttribute('data-trigger', 'shift');
            button.setAttribute('title', 'Shift');
            break;
          case '+space':
            button.innerHTML = '&nbsp;';
            button.setAttribute('data-trigger', 'space');
            button.setAttribute('title', 'Space');
            button.style.width = '75%';
            break;
            
          default: 
            button.innerText = uppercase ? (matrix[i][j]).toUpperCase() : matrix[i][j]; 
            break;
        }
        
        button.setAttribute('class', 'virtual-keyboard-button');
        button.addEventListener('click', function () {
          _lastElementFocused.focus();
          x = this.getAttribute('data-trigger');
          if (x != null) {
            switch(x) {
              case 'backspace':
                _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                break;
              case 'international':
                let reversed = language === 'en'? 'ru' : 'en';
                target.innerHTML = '';
                owner.generate(target,owner.getMatrix(reversed), reversed);
                break;
              case 'space':
                _lastElementFocused.value = _lastElementFocused.value + ' ';
                break;
              case 'shift':
                let u = uppercase === true ? false : true;
                target.innerHTML = '';
                owner.generate(target,owner.getMatrix(language), language, u);
                break;
                    }
          }
          else {
            _lastElementFocused.value = _lastElementFocused.value + this.innerText;
          }
        });
        vkcol.appendChild(button);

        vkel.appendChild(vkcol);
        target.appendChild(vkel);
      }
    }
  },
  getMatrix: function(language) {
    let matrix = {en: [
      ['1','2','3','4','5','6','7','8','9','0','+backspace'],
      ['q','w','e','r','t','y','u','i','o','p','-'],
      ['a','s','d','f','g','h','j','k','l','+'],
      ['@','z','x','c','v','b','n','m','.','_'],
      ['+shift','+space','+international']
    ],
                  ru: [
                    ['1','2','3','4','5','6','7','8','9','0','+backspace'],
                    ['й','ц','у','к','е','н','г','ш','щ','з','х','ъ','-'],
                    ['ф','ы','в','а','п','р','о','л','д','ж','э','+'],
                    ['@','я','ч','с','м','и','т','ь','б','ю','ё','.','_'],
                    ['+shift','+space','+international']
                  ]};
    return matrix[language];
  },
  init: function(args) {
    if (args != undefined && args != null) {
      if (Object.keys(args).length > 0) {
        let owner = this;

        window._lastElementFocused = null;

        let target = document.getElementById(args['targetId']);
        let language = args['defaultLanguage'];
        let elements = document.querySelectorAll(args['inputSelector']);

        _lastElementFocused = elements[0];

        for (let i = 0; i < elements.length; i++) {
          elements[i].addEventListener('focus', function () {
            _lastElementFocused = this;
          });
        }
        owner.generate(target,owner.getMatrix(language), language);
      }
    }
  }
}

VirtualKeyboard.init({targetId: 'tabular-virtual-keyboard', defaultLanguage: 'en', inputSelector: '[data-virtual-element]'});