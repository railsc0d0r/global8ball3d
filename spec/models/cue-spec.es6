import Cue from '../../src/models/cue';

describe('Cue', () => {
  it('can be instanciated', () => {
    let cue = new Cue();
    expect(cue).toEqual(jasmine.any(Cue));
  });

  it('validates the given target to be a mesh', function() {
    pending();
  });

  it('validates the given scene', function() {
    pending();
  });
});
