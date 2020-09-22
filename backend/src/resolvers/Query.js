const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      // want to return null because a user doesn't have to be logged in
      return null
    }
    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info)
  },
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId){
      throw new Error('You must be logged in')
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    
    //empty where field to query all users
   return ctx.db.query.users({}, info);
  }
};

module.exports = Query;