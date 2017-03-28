import Event from '../../src/models/event';

describe('Event', function() {
  it('can be instanciated', function() {
    expect(new Event()).toEqual(jasmine.any(Event));
  });
});
