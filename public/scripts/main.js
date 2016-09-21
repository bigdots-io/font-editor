import MacroLibrary from 'macro-library';
import DotMatrix from 'dot-matrix';

var macroLibrary = new MacroLibrary();
macroLibrary.registerMacros();


$(function() {
  $('.js-matrix-display').each(function() {
    var config = $(this).data();

    var dotMatrix = new DotMatrix($(this));
    dotMatrix.render(300, {width: config.width, height: config.height});

    macroLibrary.loadMacro(config.macro, {
      config: {color: '#FFF'},
      dimensions: {
        width: config.width,
        height: config.height
      },
      callbacks: {
        onPixelChange: (y, x, hex) => {
          dotMatrix.updateDot(y, x, hex);
        }
      }
    }).start();
  });
});
