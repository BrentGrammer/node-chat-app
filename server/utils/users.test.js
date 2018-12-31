const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'room1'
      },
      {
        id: '2',
        name: 'Bob',
        room: 'room2'
      },
      {
        id: '3',
        name: 'Bart',
        room: 'room1'
      }
    ];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Bob',
      room: 'room name'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('it should return names for room1', () => {
    const userList = users.getUserList('room1');
    expect(userList).toEqual(['Mike', 'Bart']);
  });

  
  it('it should return names for room2', () => {
    const userList = users.getUserList('room2');
    expect(userList).toEqual(['Bob']);
  });

  it('should remove a user', () => {
    const userId = '1';
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const userId = '99';
    const user = users.removeUser(userId);
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const userId = '2';
    const user = users.getUser('2');
    expect(user.id).toBe(userId);
  });

  it('should not find user', () => {
    const userId = 99;
    const user = users.getUser(userId);
    expect(user).toBeFalsy();
  });

});