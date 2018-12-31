class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    const user = this.getUser(id);

    if(user) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    // return the first user or undefined
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    // filter by room passed in
    const users = this.users.filter((user) => user.room === room);
    // build array of user names in room:
    const namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = { Users };

