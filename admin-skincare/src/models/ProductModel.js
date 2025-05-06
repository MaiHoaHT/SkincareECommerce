class ProductModel {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.discount = data.discount;
    this.imageUrl = data.imageUrl;
    this.categoryId = data.categoryId;
    this.brandId = data.brandId;
    this.seoAlias = data.seoAlias;
    this.quantity = data.quantity;
    this.sold = data.sold;
    this.status = data.status;
    this.isFeature = data.isFeature;
    this.isHome = data.isHome;
    this.isHot = data.isHot;
    this.isActive = data.isActive;
    this.createDate = data.createDate;
    this.lastModifiedDate = data.lastModifiedDate;
  }

  static fromApi(data) {
    return new ProductModel(data);
  }

  static fromApiList(data) {
    return data.map(item => new ProductModel(item));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      discount: this.discount,
      imageUrl: this.imageUrl,
      categoryId: this.categoryId,
      brandId: this.brandId,
      seoAlias: this.seoAlias,
      quantity: this.quantity,
      sold: this.sold,
      status: this.status,
      isFeature: this.isFeature,
      isHome: this.isHome,
      isHot: this.isHot,
      isActive: this.isActive,
      createDate: this.createDate,
      lastModifiedDate: this.lastModifiedDate
    };
  }
}

export default ProductModel; 