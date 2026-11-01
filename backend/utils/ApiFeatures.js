/**
 * Chainable helper that turns req.query into a Mongoose query.
 * Usage: new ApiFeatures(Product.find(), req.query).search().filter().sort().paginate()
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = ['name']) {
    if (this.queryString.search) {
      const searchOr = fields.map((field) => ({
        [field]: { $regex: this.queryString.search, $options: 'i' },
      }));
      this.query = this.query.find({ $or: searchOr });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // category / collections / color / size can arrive as comma separated lists
    ['category', 'collections', 'colors', 'sizes', 'brand'].forEach((key) => {
      if (queryObj[key] && typeof queryObj[key] === 'string' && queryObj[key].includes(',')) {
        queryObj[key] = { $in: queryObj[key].split(',') };
      }
    });

    if (queryObj.minPrice || queryObj.maxPrice) {
      queryObj.price = {};
      if (queryObj.minPrice) queryObj.price.$gte = Number(queryObj.minPrice);
      if (queryObj.maxPrice) queryObj.price.$lte = Number(queryObj.maxPrice);
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    if (queryObj.colors) {
      queryObj['colors.name'] = queryObj.colors;
      delete queryObj.colors;
    }
    if (queryObj.sizes) {
      queryObj['sizes.value'] = queryObj.sizes;
      delete queryObj.sizes;
    }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

export default ApiFeatures;
