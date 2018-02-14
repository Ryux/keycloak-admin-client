'use strict';

const privates = require('./private-map');
const request = require('request');

/**
 * @module users
 */

module.exports = {
  find: find,
  join: join,
  leave: leave
};

/**
  Returns a list of user's groups, filtered according to query parameters

  @param {string} realmName - The name of the realm(not the realmID) - ex: master
  @param {string} userId - Id of the users
  @returns {Promise} A promise that will resolve with an Array of user's group objects
  @example
  keycloakAdminClient(settings)
    .then((client) => {
      client.users.groups.find(realmName, userId)
        .then((groups) => {
          console.log(groups) // [{...},{...}, ...]
        })
      });
 */
function find (client) {
  return function find (realm, userId) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
        url: `${client.baseUrl}/admin/realms/${realm}/users/${userId}/groups`
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 200) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}

/**
 Add group membership to a user

 @param {string} realmName - The name of the realm(not the realmID) - ex: master
 @param {string} userId - Id of the user
 @param {string} groupId - Id of the group
 @returns {Promise} A promise that will resolve with the realm, the user id and the group id
 @example
 keycloakAdminClient(settings)
 .then((client) => {
      client.users.groups.join(realmName, userId, groupId)
        .then((result) => {
          console.log(result) // {realm:..., userId:...,groupId:...}
        })
      });
 */
function join (client) {
  return function join (realm, userId, groupId) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
        url: `${client.baseUrl}/admin/realms/${realm}/users/${userId}/groups/${groupId}`
      };

      request.put(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(true);
      });
    });
  };
}

/**
 Remove group membership of a user

 @param {string} realmName - The name of the realm(not the realmID) - ex: master
 @param {string} userId - Id of the user
 @param {string} groupId - Id of the group
 @returns {Promise} A promise that will resolve with the realm, the user id and the group id
 @example
 keycloakAdminClient(settings)
 .then((client) => {
      client.users.groups.leave(realmName, userId, groupId)
        .then((result) => {
          console.log(result) // {realm:..., userId:...,groupId:...}
        })
      });
 */
function leave (client) {
  return function join (realm, userId, groupId) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true,
        url: `${client.baseUrl}/admin/realms/${realm}/users/${userId}/groups/${groupId}`
      };

      request.delete(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(true);
      });
    });
  };
}
