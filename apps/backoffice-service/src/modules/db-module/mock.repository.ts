export const MockRepository = jest.fn(() => ({
  find: jest.fn().mockResolvedValue(''),
  save: jest.fn().mockResolvedValue(''),
  findOne: jest.fn().mockResolvedValue(''),
  update: jest.fn().mockResolvedValue(''),
}));
