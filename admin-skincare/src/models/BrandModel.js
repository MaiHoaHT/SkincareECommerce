class BrandModel {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.banner = data.banner;
    this.alias = data.alias;
  }

  static fromApi(data) {
    return new BrandModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new BrandModel(item));
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      banner: this.banner,
      alias: this.alias
    };
  }
}

export default BrandModel; 