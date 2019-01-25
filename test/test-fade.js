QUnit.test( 'fade', function( assert ) {

  var done = assert.async();

  var carousel = document.querySelector('.carousel--single');
  var cells = carousel.querySelectorAll('.carousel__cell');
  var flkty = new Flickity( carousel, {
    fade: true,
  });

  assert.ok( flkty instanceof Flickity, 'Flickity instance created' );
  assert.equal( cells[0].style.opacity, '1', 'init - cell #0 full opacity' );
  assert.equal( cells[1].style.opacity, '0', 'init - cell #1 0 opacity' );
  assert.equal( cells[0].style.left, '-25%', 'cell #0 left: -25% ' );
  assert.equal( cells[1].style.left, '-15%', 'cell #1 left: -15% ' );
  assert.equal( cells[2].style.left, '-30%', 'cell #2 left: -30% ' );

  flkty.once( 'settle', onSettle1 );
  flkty.select( 1 );

  function onSettle1() {
    assert.equal( cells[0].style.opacity, '0', 'select 1 - cell #0 0 opacity' );
    assert.equal( cells[1].style.opacity, '1', 'select 1 - cell #1 1 opacity' );
    flkty.once( 'settle', onSettle2 );
    flkty.select( 2 );
  }

  function onSettle2() {
    assert.equal( cells[0].style.opacity, '0', 'select 2 - cell #0 0 opacity' );
    assert.equal( cells[1].style.opacity, '0', 'select 2 - cell #1 0 opacity' );
    assert.equal( cells[2].style.opacity, '1', 'select 2 - cell #2 1 opacity' );
    flkty.once( 'settle', onSettleBack0 );
    flkty.select( 0 );
  }

  function onSettleBack0() {
    assert.equal( cells[0].style.opacity, '1', 'select back 0 - cell #0 1 opacity' );
    assert.equal( cells[1].style.opacity, '0', 'select back 0 - cell #1 0 opacity' );
    assert.equal( cells[2].style.opacity, '0', 'select back 0 - cell #2 0 opacity' );
    // HACK, do async to prevent race condition
    setTimeout( destroy, 100 );
  }

  // DESTROY!
  function destroy() {
    flkty.destroy();
    assert.equal( cells[0].style.opacity, '', 'destroy - cell #0 no opacity set' );
    assert.equal( cells[1].style.opacity, '', 'destroy - cell #1 no opacity set' );
    assert.equal( cells[2].style.opacity, '', 'destroy - cell #2 no opacity set' );
    setTimeout( initGroup );
  }

  /* ---- groupCells ---- */

  var groupLefts = [ '-40%', '10%', '-45%', '15%', '-40%',
    '-10%', '-45%', '-15%', '15%' ];

  function initGroup() {
    flkty = new Flickity( carousel, {
      fade: true,
      groupCells: true,
    });

    for ( var i = 0; i < cells.length; i++ ) {
      var cell = cells[i];
      var left = groupLefts[i];
      var message = 'grouped cell #' + i + ' left: ' + left;
      assert.equal( cell.style.left, left, message );
    }

    done();
  }

});
