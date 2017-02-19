import CueConfig from '../../src/config/cue_config';

describe('CueConfig', () => {
  it('describes 5 parts', () => {
    expect(CueConfig.length).toEqual(5);
  });

  it('describes the tip', () => {
    const config = CueConfig.find((element) => {
      return element.name === 'tip';
    });

    expect(config.diameterTop).toEqual(0.014);
    expect(config.diameterBottom).toEqual(config.diameterTop);
    expect(config.height).toEqual(0.005);
    expect(config.color).toEqual('black');
    expect(config.position.y).toEqual(0.0025);
  });

  it('describes the ferule', () => {
    const config = CueConfig.find((element) => {
      return element.name === 'ferule';
    });

    expect(config.diameterTop).toEqual(0.014);
    expect(config.diameterBottom).toEqual(config.diameterTop);
    expect(config.height).toEqual(0.045);
    expect(config.color).toEqual('white');
    expect(config.position.y).toEqual(0.0275);
  });

  it('describes the taper', () => {
    const config = CueConfig.find((element) => {
      return element.name === 'taper';
    });

    expect(config.diameterTop).toEqual(0.014);
    expect(config.diameterBottom).toEqual(config.diameterTop);
    expect(config.height).toEqual(0.3);
    expect(config.color).toEqual('lightBrown');
    expect(config.position.y).toEqual(0.2);
  });

  it('describes the shaft', () => {
    const config = CueConfig.find((element) => {
      return element.name === 'shaft';
    });

    expect(config.diameterTop).toEqual(0.035);
    expect(config.diameterBottom).toEqual(0.014);
    expect(config.height).toEqual(0.6);
    expect(config.color).toEqual('lightBrown');
    expect(config.position.y).toEqual(0.65);
  });

  it('describes the butt', () => {
    const config = CueConfig.find((element) => {
      return element.name === 'butt';
    });

    expect(config.diameterTop).toEqual(0.035);
    expect(config.diameterBottom).toEqual(config.diameterTop);
    expect(config.height).toEqual(0.6);
    expect(config.color).toEqual('black');
    expect(config.position.y).toEqual(1.25);
  });
});
