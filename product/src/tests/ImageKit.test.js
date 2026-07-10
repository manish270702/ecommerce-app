const imagekit = require('../services/ImageKit');

describe('ImageKit service', () => {
  test('exposes an upload function', () => {
    expect(imagekit).toBeDefined();
    expect(typeof imagekit.upload).toBe('function');
  });
});
