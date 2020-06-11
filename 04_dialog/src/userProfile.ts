// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class UserProfile {
  transport: any;
  name: any;
  age: any;
  picture: any;

  constructor(transport, name, age, picture) {
    this.transport = transport;
    this.name = name;
    this.age = age;
    this.picture = picture;
  }
}
