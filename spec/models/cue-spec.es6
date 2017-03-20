import Cue from '../../src/models/cue';

describe('Cue', () => {
  it('can be instanciated', () => {
    let cue = new Cue();
    expect(cue).toEqual(jasmine.any(Cue));
  });
});