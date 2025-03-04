const Discord = require('discord.js');

// Mock the discord.js module
jest.mock('discord.js');

// Import the functions we want to test
const { checkMods } = require('./bot');

describe('checkMods function', () => {
  let mockMember;

  beforeEach(() => {
    // Reset the flag before each test
    jest.resetModules();
    mockMember = {
      roles: {
        cache: {
          toJSON: jest.fn()
        }
      }
    };
  });

  test('should return true for a member with an allowed role', () => {
    mockMember.roles.cache.toJSON.mockReturnValue([
      { name: 'Guards [Mods]' },
      { name: 'Regular User' }
    ]);

    expect(checkMods(mockMember)).toBe(true);
  });

  test('should return false for a member without an allowed role', () => {
    mockMember.roles.cache.toJSON.mockReturnValue([
      { name: 'Regular User' },
      { name: 'Another Role' }
    ]);

    expect(checkMods(mockMember)).toBe(false);
  });

  test('should maintain state across multiple calls', () => {
    mockMember.roles.cache.toJSON.mockReturnValue([{ name: 'Guards [Mods]' }]);
    expect(checkMods(mockMember)).toBe(true);

    // Second call with a non-allowed role
    mockMember.roles.cache.toJSON.mockReturnValue([{ name: 'Regular User' }]);
    expect(checkMods(mockMember)).toBe(true);  // Should still be true due to the flag

    // Third call with another non-allowed role
    expect(checkMods(mockMember)).toBe(true);  // Should remain true
  });
});