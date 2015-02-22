var Decomposer = require('../decomposer.js')

describe('Decomposer', function() {
  it('can create instance', function(done) {
    console.log(typeof(readLines));
    decomposer = Decomposer.parse('test/test.sass', function(){
      done();
    });
  });
});
