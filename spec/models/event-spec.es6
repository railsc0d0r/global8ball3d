import Event from '../../src/models/event';

describe('Event', function() {
  it('requires a name to be instanciated', function() {
    const throwsAnException = () => { new Event };
    expect(throwsAnException).toThrow('Event requires a name to be created.');
  })

  describe('as instance', function() {
    beforeEach(function() {
      this.name = 'myEvent';
      this.event = new Event(this.name);
    });

    it('can be created', function() {
      expect(this.event).toEqual(jasmine.any(Event));
    });

    it('stores given name and provides a getter to it', function() {
      expect(this.event.name).toEqual(this.name);
    });

    it('provides an empty array of callbacks', function() {
      expect(this.event.callbacks).toEqual([]);
    });

    it('can register a callback', function() {
      const callback = () => {};
      this.event.registerCallback(callback);

      expect(this.event.callbacks).toContain(callback);
    });
  });
});
