var VirtualKeyboard = {
  generate: function(target, matrix, language, uppercase = false) {
    var owner = this;
    
    for(var i = 0; i < matrix.length; i++) {
      var position = matrix[i];
      
      var vkel = document.createElement('div');
      vkel.setAttribute('class', 'virtual-keyboard-row');
      
      var vkcol = document.createElement('div');
      vkcol.setAttribute('class', 'virtual-keyboard-column');
      
      for (var j = 0; j < position.length; j++) {
        var button = document.createElement('button');
        
        switch(matrix[i][j]) {
          case '+backspace': 
            button.innerHTML = '<i class="fa fa-fw fa-long-arrow-left"></i>';
            button.setAttribute('data-trigger', 'backspace');
            button.setAttribute('title', 'Backspace');
            var mouseTimerHandler = null;
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
          var x = this.getAttribute('data-trigger');
          if (x != null) {
            switch(x) {
              case 'backspace':
                _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                break;
              case 'international':
                var reversed = language === 'en'? 'ru' : 'en';
                target.innerHTML = '';
                owner.generate(target,owner.getMatrix(reversed), reversed);
                break;
              case 'space':
                _lastElementFocused.value = _lastElementFocused.value + ' ';
                break;
              case 'shift':
                var u = uppercase === true ? false : true;
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
    var matrix = {en: [
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
        var owner = this;

        window._lastElementFocused = null;

        var target = document.getElementById(args['targetId']);
        var language = args['defaultLanguage'];
        var elements = document.querySelectorAll(args['inputSelector']);

        _lastElementFocused = elements[0];

        for (var i = 0; i < elements.length; i++) {
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