class CategoryModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.banner = data.banner;
    this.seoAlias = data.seoAlias;
    this.seoDescription = data.seoDescription;
    this.sortOrder = data.sortOrder;
    this.parentId = data.parentId;
  }

  static fromApi(data) {
    return new CategoryModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new CategoryModel(item));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      banner: this.banner,
      seoAlias: this.seoAlias,
      seoDescription: this.seoDescription,
      sortOrder: this.sortOrder,
      parentId: this.parentId
    };
  }
}

export default CategoryModel; 