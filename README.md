# Flickity fade

_Fade between Flickity slides_

## Install

Add `flickity-fade.css` to you stylesheets and `flickity-fade.js` to your scripts.

### Download

+ [flickity-fade.css](https://unpkg.com/flickity-fade@1/flickity-fade.css)
+ [flickity-fade.js](https://unpkg.com/flickity-fade@1/flickity-fade.js)

### CDN

``` html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/flickity-fade@1/flickity-fade.css">

<!-- JS -->
<script src="https://unpkg.com/flickity-fade@1/flickity-fade.js"></script>
```

### Package managers

This package is registered as `flickity-fade`.

+ npm: `npm install flickity-fade`
+ Yarn: `yarn add flickity-fade`
+ Bower: `bower install flickity-fade`

## Usage

Enable fade behavior by setting `fade: true` in Flickity options.

``` js
// jQuery
var $carousel = $('.carousel').flickity({
  fade: true,
});
```

``` js
// vanilla JS
var flkty = new Flickity( '.carousel', {
  fade: true,
});
```

``` html
<!-- HTML -->
<div class="carousel" data-flickity='{ "fade": true }'>
  ...
</div>
```

### Webpack & Browserify

``` js
var Flickity = require('flickity-fade');

var flkty = new Flickity( '.carousel', {
  fade: true,
});
```

### RequireJS

``` js
requirejs( [ 'path/to/flickity-fade' ], function( Flickity ) {
  var flkty = new Flickity( '.carousel', {
    fade: true,
  });
});
```

---

This feature spent [four years in feature-request purgatory](https://github.com/metafizzy/flickity/issues/26). _Never give up._

By [Metafizzy](https://metafizzy.co) 🌈🐻
