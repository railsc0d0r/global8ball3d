// Implements rounding more precisely than Math.
// See: http://stackoverflow.com/a/19722641
const NumberRound = function(number, places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
};

export default NumberRound;
