const getUnique = (arr1, arr2) => {
  const forAdd = arr1.filter((item1) => {
    const match = arr2.find(
      (item2) => item2._id.toString() === item1._id.toString()
    );
    return !match || (match && match.date !== item1.date.toISOString());
    // return match;
  });
  const forDel = arr2
    .filter((item1) => {
      const match = arr1.find(
        (item2) => item1._id.toString() === item2._id.toString()
      );
      return !match;
    })
    .map((item) => {
      return item._id;
    });
  return { forAdd, forDel };
};

module.exports = { getUnique };
