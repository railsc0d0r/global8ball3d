const NumberRound = function(number, places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
};

export default NumberRound;
