const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    console.log(item);

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
        permissions: { set: ['USER']}
      }
    }, info )

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set jwt as cookie to pass jwt along
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
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
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    
    return user;
  },
  signout(parent, args, ctx, info){
    ctx.response.clearCookie('token')
    return { message: 'You were logged out!'}
  }
  
  
  
  // createDog(parent, args, ctx, info) {
  //   global.dogs = global.dogs || [];
  //   // create a dog
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  // },
};

module.exports = Mutations;