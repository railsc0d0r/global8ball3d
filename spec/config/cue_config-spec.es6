import CueConfig from '../../src/config/cue_config';

describe('CueConfig', () => {
  it('describes 5 parts', () => {
    expect(CueConfig.length).toEqual(5);
  });
});