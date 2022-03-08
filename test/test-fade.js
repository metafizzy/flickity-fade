QUnit.test( 'fade', function( assert ) {

  // position values can be off by 0.1% or 1px
  function isPositionApprox( cell, expected ) {
    let { transform } = cell.style;
    let position = transform.replace( 'translateX(', '' ).replace( ')', '' );
    let isPercent = position.indexOf('%') !== -1;
    position = parseFloat( position );
    let diff = Math.abs( expected - position );
    return isPercent ? diff < 0.1 : diff <= 1;
  }

  let done = assert.async();

  let carousel = document.querySelector('.carousel--single');
  let cells = carousel.querySelectorAll('.carousel__cell');
  let flkty = new Flickity( carousel, {
    fade: true,
  } );

  assert.ok( flkty instanceof Flickity, 'Flickity instance created' );
  assert.equal( cells[0].style.opacity, '1', 'init - cell #0 full opacity' );
  assert.equal( cells[1].style.opacity, '0', 'init - cell #1 0 opacity' );
  assert.ok( isPositionApprox( cells[0], -50 ), 'cell #0 left: -50% ' );
  assert.ok( isPositionApprox( cells[1], -50 ), 'cell #1 left: -50% ' );
  assert.ok( isPositionApprox( cells[2], -50 ), 'cell #2 left: -50% ' );

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

  let groupLefts = [ -80, 33.33, -75, 50, -133.33,
    -20, -150, -50, 50 ];

  function initGroup() {
    flkty = new Flickity( carousel, {
      fade: true,
      groupCells: true,
    } );

    for ( let i = 0; i < cells.length; i++ ) {
      let cell = cells[i];
      let left = groupLefts[i];
      let message = `grouped cell #${i} left: ${left}`;
      assert.ok( isPositionApprox( cell, left ), message );
    }

    done();
  }

} );
