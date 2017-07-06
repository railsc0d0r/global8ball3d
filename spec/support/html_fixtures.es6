const HtmlFixtures = class {
  static addCanvas() {
    const fixture = '<div id="fixture">' +
    ' <style>' +
    '   html, body {' +
    '     overflow: hidden;' +
    '     width   : 100%;' +
    '     height  : 100%;' +
    '     margin  : 0;' +
    '     padding : 0;' +
    '   }' +
    '' +
    '   #renderCanvas {' +
    '     width   : 100%;' +
    '     height  : 100%;' +
    '     touch-action: none;' +
    '   }' +
    ' </style>' +
    ' <canvas id="renderCanvas" touch-action="none"></canvas>' +
    ' <canvas id="nonTouchCanvas"></canvas>' +
    '</div>';

    document.body.insertAdjacentHTML(
      'afterbegin',
      fixture);
  }

  static removeFixture() {
    document.body.removeChild(document.getElementById('fixture'));
  }
};

export default HtmlFixtures;
