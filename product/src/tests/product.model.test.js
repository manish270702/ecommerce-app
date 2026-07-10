const productModel = require('../models/product.model');

describe('Product model', () => {
  test('exports a Mongoose model named Product and has expected schema paths', () => {
    expect(productModel.modelName).toBe('Product');
    const paths = productModel.schema.paths;
    expect(paths.title).toBeDefined();
    expect(paths.price).toBeDefined();
    expect(paths.category).toBeDefined();
    expect(paths.createdBy).toBeDefined();
  });
});
