const { Op } = require('sequelize');

module.exports = (req, modelName = '') => {
  const limitData = +req.query.limit;
  const offsetData = (+req.query.page - 1) * limitData || 0;
  let where = {};
  let search = [];

  // 1) Pagination Feature
  let limit = {};
  if (req.query.limit) {
    limit = { limit: limitData, offset: offsetData };
  }

  // 2) Sorting Feature
  let order = [];


  let sortWith = req.query.sortwith ? req.query.sortwith : req.query.sortWith;
  let sortBy = req.query.sortby ? req.query.sortby : req.query.sortBy;

  sortWith = sortWith ? sortWith : 'id';
  // sortBy = sortBy && sortBy == '0' ? 'desc' : 'asc';
  if(req.query.sortBy){
    sortBy = sortBy && sortBy == '1' ? 'desc' : 'asc';
  } else{
    sortBy = sortBy && sortBy == '0' ? 'desc' : 'asc';
  }

  order.push([sequelize.col(sortWith), sortBy]);

  // 3) Searching Feature
  if (req.query.search) {
    switch (modelName) {
      case 'task':
        search.push(
          { title: { [Op.like]: `%${req.query.search}%` } },
        );
        break;
      default:
        search.push({ title: { [Op.like]: `%${req.query.search}%` } });
        break;
    }

    Object.assign(where, { [Op.or]: search });
  }

  // 4) Filter Feature
  if (
    (req.query.filterKey === 'createdAt' || req.query.filterKey === 'updatedAt') &&
    req.query.filterValue
  ) {
    const date1 = new Date(req.query.filterValue).setHours(0, 0, 0, 0);
    const date2 = new Date(req.query.filterValue).setHours(24, 0, 0, 0);

    Object.assign(where, { [req.query.filterKey]: { [Op.between]: [date1, date2] } });
  } else if (req.query.filterKey && req.query.filterValue) {
    const keys = req.query.filterKey.split(',');
    const values = req.query.filterValue.split(',');

    keys.forEach((el, i) => {
      if (el) {
        Object.assign(where, {
          [el.trim()]: typeof values[i] === 'number' ? +values[i] : values[i],
        });
      }
    });
  }

  if (req.query.status){
    Object.assign(where, { 'status': req.query.status });
  }

  return {
    where,
    limit,
    order,
  };
};
