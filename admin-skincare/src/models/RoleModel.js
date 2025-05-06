class RoleModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
  }

  static fromApi(data) {
    return new RoleModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new RoleModel(item));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }
}

export default RoleModel; 