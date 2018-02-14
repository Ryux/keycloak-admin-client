'use strict';

const privates = require('./private-map');
const members = require('./group-members');
const request = require('request');

/**
 * @module users
 */

module.exports = {
  find: find,
  create: create,
  members: members
};

/**
 GGet group hierarchy. Only name and ids are returned.
 @param {string} realmName - The name of the realm(not the realmID) - ex: master
 @param {object} [options] - The options object
 @param {string} [options.id] - The id of the group, this will override any query param options used
 @returns {Promise} A promise that will resolve with an Array of group objects
 @example
 keycloakAdminClient(settings)
 .then((client) => {
      client.groups.find(realmName)
        .then((groupList) => {
          console.log(groupList) // [{...},{...}, ...]
        })
      });
 */
function find (client) {
  return function find (realm, options) {
    return new Promise((resolve, reject) => {
      const req = {
        auth: {
          bearer: privates.get(client).accessToken
        },
        json: true
      };

      if (options.id) {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups/${options.id}`;
      } else {
        req.url = `${client.baseUrl}/admin/realms/${realm}/groups`;
        req.qs = options;
      }

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
 A function to create a new group for a realm.

 @param {string} realm - The name of the realm(not the realmID) - ex: master
 @param {object} group - The JSON representation of a group - http://www.keycloak.org/docs-api/3.4/rest-api/index.html#_grouprepresentation - name must be unique
 @returns {Promise} A promise that will resolve with an Array of group objects
 @example
 keycloakAdminClient(settings)
 .then((client) => {
      client.groups.create(realmName, group)
        .then((createdGroup) => {
        console.log(createdGroup) // [{...}]
        })
      });
 */
function create (client) {
  return function create (realm, group) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/admin/realms/${realm}/groups/`,
        auth: {
          bearer: privates.get(client).accessToken
        },
        body: group,
        method: 'POST',
        json: true
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 201) {
          return reject(body);
        }

        // eg "location":"https://<url>/auth/admin/realms/<realm>/groups/499b7073-fe1f-4b7a-a8ab-f401d9b6b8ec"
        const guid = resp.headers.location.replace(/.*\/(.*)$/, '$1');

        // Since the create Endpoint returns an empty body, go get what we just imported.
        // *** Body is empty but location header contains group id ***
        // We need to search based on the groupid, since it will be unique
        return resolve(client.groups.find(realm, {
          groupId: guid
        }));
      });
    });
  };
}
