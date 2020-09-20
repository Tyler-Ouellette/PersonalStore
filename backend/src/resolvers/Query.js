const { forwardTo } = require('prisma-binding');

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
  }
};

module.exports = Query;