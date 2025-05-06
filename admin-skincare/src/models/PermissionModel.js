class PermissionModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.parentId = data.parentId;
    this.hasCreate = data.hasCreate;
    this.hasUpdate = data.hasUpdate;
    this.hasDelete = data.hasDelete;
    this.hasView = data.hasView;
    this.hasApprove = data.hasApprove;
  }

  static fromApi(data) {
    return new PermissionModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new PermissionModel(item));
  }

  hasPermission(permissionType) {
    switch (permissionType) {
      case 'CREATE':
        return this.hasCreate > 0;
      case 'UPDATE':
        return this.hasUpdate > 0;
      case 'DELETE':
        return this.hasDelete > 0;
      case 'VIEW':
        return this.hasView > 0;
      case 'APPROVE':
        return this.hasApprove > 0;
      default:
        return false;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      hasCreate: this.hasCreate,
      hasUpdate: this.hasUpdate,
      hasDelete: this.hasDelete,
      hasView: this.hasView,
      hasApprove: this.hasApprove
    };
  }
}

export default PermissionModel; 