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

var proto = Flickity.prototype;

var positionSlider = proto.positionSlider;
Flickity.prototype.positionSlider = function() {
  if ( !this.options.fade ) {
    positionSlider.apply( this, arguments );
    return;
  }
  // position fade slider
  var x = this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft ? -x : x;
  var value = this.getPositionValue( x );
  this.slider.style.transform = 'translateX(' + value + ')';

  this.fadeSlides();

  // scroll event
  var firstSlide = this.slides[0];
  if ( firstSlide ) {
    var positionX = -this.x - firstSlide.target;
    var progress = positionX / this.slidesWidth;
    this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
  }
};

proto.fadeSlides = function() {
  if ( this.slides.length < 2 ) {
    return;
  }

  // calculate closest previous slide
  var prevIndex = 0;
  for ( var i=0; i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    if ( -this.x < slide.target ) {
      break;
    }
    prevIndex = i;
  }

  var prevSlide = this.slides[prevIndex];
  var nextSlide = this.slides[ prevIndex + 1 ];
  var distance = nextSlide.target - prevSlide.target;

  var incProgress = ( -this.x - prevSlide.target ) / distance;
  // console.log( incProgress );
  this.slides.forEach( function( slide, i ) {
    var alpha = 0;
    if ( i == prevIndex ) {
      // previous slide
      alpha = 1 - incProgress;
    } else if ( i == prevIndex + 1 ) {
      alpha = incProgress;
    }
    slide.cells.forEach( function( cell ) {
      cell.element.style.opacity = alpha;
    });
  });
};
