const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')

const MAX_AGE = 1000 * 60 * 60 * 24 * 365

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    
    if (!ctx.request.userId){
      throw new Error('You must be logged in to do that.')
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          user: {
            // Creates relationship between user and item
            connect: {
              id: ctx.request.userId
            }
          }
        },
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id
      }
    }, info)
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id}
    // find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`)
    // check if they own that item or if they have perms
    // TODO
    // delete the item
    return ctx.db.mutation.deleteItem({where}, info)
  },
  async signup(parent, args, ctx, info){
    const email = args.email.toLowerCase()
    // Set the salt number for hashing
    const password = await bcrypt.hash(args.password, 15);
    const name = args.name
    const user = await ctx.db.mutation.createUser({
      data: {
        name,
        password,
        email,
        permissions: { set: ['ADMIN']}
      }
    }, info )

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set jwt as cookie to pass jwt along
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: MAX_AGE
    })
    
    return user;
  },
  async login(parent, args, ctx, info) {
    const { email, password } = args
    
    const user = await ctx.db.query.user({ where: { email }})
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid Password')
    }
    
    
    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set jwt as cookie to pass jwt along
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: MAX_AGE
    })
    
    return user;
  },
  signout(parent, args, ctx, info){
    ctx.response.clearCookie('token')
    return { message: 'You were logged out!'}
  },
  async requestReset(parent, args, ctx, info){
    const user = await ctx.db.query.user({ where: { email: args.email }})
    if (!user){
      throw new Error(`No such user found for email ${args.email}`)
    }
    // Set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes);
    const resetToken = (await randomBytesPromiseified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })
    // email them
    const mailRes = await transport.sendMail({
      from: 'tylerouellette4@gmail.com',
      to: user.email,
      subject: 'Password Reset Token',
      html: makeANiceEmail(`Your password reset is: \n\n
        <button>
          <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>
        </button>`
      )
    })
    return { message: 'Done' }
  },
  async resetPassword(parent, args, ctx, info){
    // Check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Passwords Do Not Match')
    }
    
    // check if there is a legit reset token
    const [user] = await ctx.db.query.users({ 
      where: { resetToken: args.resetToken, resetTokenExpiry_gte: Date.now() - 3600000 }
    })
    if (!user) {
      throw new Error('This token is either invalid or expired')
    }
    
    const password = await bcrypt.hash(args.password, 15)
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: MAX_AGE
    })
    
    return updatedUser;
  }  
};

module.exports = Mutations;