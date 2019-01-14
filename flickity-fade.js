/* jshint browser: true, undef: true, unused: true */
/* globals Flickity */

var Slide = Flickity.Slide;

var slideUpdateTarget = Slide.prototype.updateTarget;
Slide.prototype.updateTarget = function() {
  slideUpdateTarget.apply( this, arguments );
  if ( !this.parent.options.fade ) {
    return;
  }
  // position cells
  var slideTargetX = this.target - this.x;
  var cellsX = 0;
  var firstCellX = this.cells[0].x;
  this.cells.forEach( function( cell ) {
    cellsX += cell.x - firstCellX;
    var x = cellsX - slideTargetX;
    cell.renderPosition( x );
  });
};

Slide.prototype.setOpacity = function( alpha ) {
  this.cells.forEach( function( cell ) {
    cell.element.style.opacity = alpha;
  });
};

var proto = Flickity.prototype;

Flickity.createMethods.push('_createFade');

proto._createFade = function() {
  this.on( 'activate', this.onActivateFade );
};

proto.onActivateFade = function() {
  this.fadeIndex = this.selectedIndex;
  this.slides.forEach( function( slide, i ) {
    var alpha = i == this.selectedIndex ? 1 : 0;
    slide.setOpacity( alpha );
  }, this );
};

var positionSlider = proto.positionSlider;
Flickity.prototype.positionSlider = function() {
  if ( !this.options.fade ) {
    positionSlider.apply( this, arguments );
    return;
  }

  this.fadeSlides();

  // scroll event
  var firstSlide = this.slides[0];
  if ( firstSlide ) {
    var positionX = -this.x - firstSlide.target;
    var progress = positionX / this.slidesWidth;
    this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
  }
};

var positionSliderAtSelected = proto.positionSliderAtSelected;
proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }

  if ( this.options.fade ) {
    // position fade slider
    var x = this.cursorPosition;
    // reverse if right-to-left and using transform
    x = this.options.rightToLeft ? -x : x;
    var value = this.getPositionValue( x );
    this.slider.style.transform = 'translateX(' + value + ')';
  }

  positionSliderAtSelected.apply( this, arguments );
};

proto.fadeSlides = function() {
  if ( this.slides.length < 2 ) {
    return;
  }

  var fadeIndex = this.getFadeIndex();
  var fadeSlideA = this.slides[fadeIndex];
  var fadeSlideB = this.slides[ fadeIndex + 1 ];
  var distance = fadeSlideB.target - fadeSlideA.target;
  var progress = ( -this.x - fadeSlideA.target ) / distance;

  fadeSlideA.setOpacity( 1 - progress );
  fadeSlideB.setOpacity( progress );

  var fadeOutSlide = progress > 0.5 ? fadeSlideA : fadeSlideB;
  var isNewFadeOutSlide = this.fadeOutSlide &&
    this.fadeOutSlide != fadeOutSlide &&
    this.fadeOutSlide != fadeSlideA &&
    this.fadeOutSlide != fadeSlideB;
  if ( isNewFadeOutSlide ) {
    // new fadeOutSlide set, hide previous
    this.fadeOutSlide.setOpacity( 0 );
  }
  this.fadeOutSlide = fadeOutSlide;
};

proto.getFadeIndex = function() {
  // calculate closest previous slide
  var fadeIndex = 0;
  // HACK, fix for wrapAround
  for ( var i=0; i < this.slides.length - 1; i++ ) {
    var slide = this.slides[i];
    if ( -this.x < slide.target ) {
      break;
    }
    fadeIndex = i;
  }
  return fadeIndex;
};
