/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  const userId = event.user.user_id;
  const role = event.secrets.GROUP_ROLE_ID; // 'group' role

  const count =
    event.stats && event.stats.logins_count ? event.stats.logins_count : 0;
  if (count > 1) {
    return;
  }

  const ManagementClient = require("auth0").ManagementClient;
  const management = new ManagementClient({
    domain: event.secrets.DOMAIN,
    clientId: event.secrets.CLIENT_ID,
    clientSecret: event.secrets.CLIENT_SECRET,
  });

  const params = { id: userId };
  const data = { roles: [role] };

  management.users.assignRoles(params, data, function (err, user) {
    if (err) {
      // Handle error.
      console.log(err);
      // Prevent the user from logging in.
      api.access.deny("Something went wrong. Plaese try again later.");
    }
  });
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
