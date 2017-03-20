import Cue from '../../src/objects/cue';

describe('Cue', () => {
  it('can be instanciated', () => {
    let cue = new Cue();
    expect(cue).toEqual(jasmine.any(Cue));
  });
});