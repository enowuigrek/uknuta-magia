module.exports = {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-order'],
  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$', // <- akceptuje camelCase
    'order/properties-order': [
      [
        // 1. Positioning
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',

        // 2. Box Model
        'display',
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'gap',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'overflow',
        'overflow-x',
        'overflow-y',
        'box-sizing',

        // 3. Typography
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'letter-spacing',
        'text-align',
        'text-decoration',
        'text-transform',
        'white-space',
        'color',

        // 4. Background / Border / Visuals
        'background',
        'background-color',
        'background-image',
        'border',
        'border-radius',
        'box-shadow',
        'opacity',

        // 5. Effects / Transitions / Animations
        'transition',
        'transform',
        'animation',

        // 6. Misc
        'cursor',
        'visibility'
      ],
      {
        unspecified: 'bottomAlphabetical'
      }
    ]
  }
};