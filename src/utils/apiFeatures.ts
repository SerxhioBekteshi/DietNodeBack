// TODO: fix any types

class APIFeatures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => "$" + match);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort(orderObject?: any) {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      if (orderObject) {
        this.query = this.query.sort(orderObject);
      } else this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFiels() {
    // field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export { APIFeatures };
