const bReport_Functions = require('./bReport_Functions.js');

test('Should return the total value of the array', () => {
  const arr1 = [152, 465, 134, 888, 1022];
  const arr2 = [465, 976, 466, 887, 132, 1124]
  expect(bReport_Functions.monthlySpend(arr1)).toBe(2661);
  expect(bReport_Functions.monthlySpend(arr1)).not.toBe(2665);
  expect(bReport_Functions.monthlySpend(arr2)).toBe(4050);
  expect(bReport_Functions.monthlySpend(arr2)).not.toBe(4059);
});
