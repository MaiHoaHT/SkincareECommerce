class FunctionModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.parentId = data.parentId;
    this.sortOrder = data.sortOrder;
    this.url = data.url;
    this.icon = data.icon;
  }

  static fromApi(data) {
    return new FunctionModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new FunctionModel(item));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      sortOrder: this.sortOrder,
      url: this.url,
      icon: this.icon
    };
  }
}

export default FunctionModel; 