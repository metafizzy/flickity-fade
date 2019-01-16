/* jshint browser: true, undef: true, unused: true */
/* globals Flickity */

var utils = fizzyUIUtils;

// ---- Slide ---- //

var Slide = Flickity.Slide;

var slideUpdateTarget = Slide.prototype.updateTarget;
Slide.prototype.updateTarget = function() {
  slideUpdateTarget.apply( this, arguments );
  if ( !this.parent.options.fade ) {
    return;
  }
  // position cells at selected target
  var slideTargetX = this.target - this.x;
  var firstCellX = this.cells[0].x;
  this.cells.forEach( function( cell ) {
    var targetX = cell.x - firstCellX - slideTargetX;
    cell.renderPosition( targetX );
  });
};

Slide.prototype.setOpacity = function( alpha ) {
  this.cells.forEach( function( cell ) {
    cell.element.style.opacity = alpha;
  });
};

// ---- Flickity ---- //

var proto = Flickity.prototype;

Flickity.createMethods.push('_createFade');

proto._createFade = function() {
  this.fadeIndex = this.selectedIndex;
  this.prevSelectedIndex = this.selectedIndex;
  this.on( 'select', this.onSelectFade );
  this.on( 'settle', this.onSettleFade );
};

var updateSlides = proto.updateSlides;
proto.updateSlides = function() {
  updateSlides.apply( this, arguments );
  if ( !this.options.fade ) {
    return;
  }
  // set initial opacity
  this.slides.forEach( function( slide, i ) {
    var alpha = i == this.selectedIndex ? 1 : 0;
    slide.setOpacity( alpha );
  }, this );
};

proto.onSelectFade = function() {
  this.fadeIndex = this.prevSelectedIndex;
  this.prevSelectedIndex = this.selectedIndex;
};

proto.onSettleFade = function() {
  if ( this.options.fade ) {
    this.selectedSlide.setOpacity( 1 );
  }
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
  // get slides to fade-in & fade-out
  var indexA, indexB;
  if ( this.isDragging ) {
    var fadeIndexes = this.getFadeDragIndexes();
    indexA = fadeIndexes.a;
    indexB = fadeIndexes.b;
  } else {
    indexA = this.fadeIndex;
    indexB = this.selectedIndex;
  }

  var fadeSlideA = this.slides[ indexA ];
  var fadeSlideB = this.slides[ indexB ];
  var distance = this.wrapDifference( fadeSlideA.target, fadeSlideB.target ); 
  var progress = this.wrapDifference( fadeSlideA.target, -this.x );
  progress = progress / distance;

  fadeSlideA.setOpacity( 1 - progress );
  fadeSlideB.setOpacity( progress );

  // hide previous slide
  var fadeHideIndex = indexA;
  if ( this.isDragging ) {
    fadeHideIndex = progress > 0.5 ? indexA : indexB;
  }
  var isNewHideIndex = this.fadeHideIndex != undefined &&
    this.fadeHideIndex != fadeHideIndex &&
    this.fadeHideIndex != indexA &&
    this.fadeHideIndex != indexB;
  if ( isNewHideIndex ) {
    // new fadeHideSlide set, hide previous
    this.slides[ this.fadeHideIndex ].setOpacity( 0 );
  }
  this.fadeHideIndex = fadeHideIndex;
};

proto.getFadeDragIndexes = function() {
  if ( this.options.wrapAround ) {
    return this.getFadeDragWrapIndexes();
  } else {
    return this.getFadeDragLimitIndexes();
  }
};

proto.getFadeDragWrapIndexes = function() {
  var distances = this.slides.map( function( slide, i ) {
    return this.getSlideDistance( -this.x, i );
  }, this );
  var absDistances = distances.map( function( distance ) {
    return Math.abs( distance );
  });
  var minDistance = Math.min.apply( Math, absDistances );
  var closestIndex = absDistances.indexOf( minDistance );
  var distance = distances[ closestIndex ];
  var len = this.slides.length;

  var indexes = {};
  if ( distance < 0 ) {
    indexes.a = utils.modulo( closestIndex - 1, len );
    indexes.b = closestIndex;
  } else {
    indexes.a = closestIndex;
    indexes.b = utils.modulo( closestIndex + 1, len );
  }
  return indexes;
};

proto.getFadeDragLimitIndexes = function() {
  // calculate closest previous slide
  var dragIndex = 0;
  for ( var i=0; i < this.slides.length - 1; i++ ) {
    var slide = this.slides[i];
    if ( -this.x < slide.target ) {
      break;
    }
    dragIndex = i;
  }
  return {
    a: dragIndex,
    b: dragIndex + 1,
  };
};

proto.wrapDifference = function( a, b ) {
  var diff = b - a;

  if ( !this.options.wrapAround ) {
    return diff;
  }

  var diffPlus = diff + this.slideableWidth;
  var diffMinus = diff - this.slideableWidth;
  if ( Math.abs( diffPlus ) < Math.abs( diff ) ) {
    diff = diffPlus;
  }
  if ( Math.abs( diffMinus ) < Math.abs( diff ) ) {
    diff = diffMinus;
  }
  return diff;
};

// ---- wrapAround ---- //

var _getWrapShiftCells = proto._getWrapShiftCells;
proto._getWrapShiftCells = function() {
  if ( !this.options.fade ) {
    _getWrapShiftCells.apply( this, arguments );
  }
};

var shiftWrapCells = proto.shiftWrapCells;
proto.shiftWrapCells = function() {
  if ( !this.options.fade ) {
    shiftWrapCells.apply( this, arguments );
  }
};
