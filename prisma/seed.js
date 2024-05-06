const { PrismaClient } = require('@prisma/client')
const { generateSalt, hashPassword } = require("../src/util/password.util")

const prisma = new PrismaClient()

const userData = [
  {
    email: 'alice@gmail.com',
    password: "1234",
    files: {
      create: [
        {
          name: 'file.txt',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const { salt, hashedPassword } = hashPassword(u.password, generateSalt())
    u.salt = salt
    u.hashedPassword = hashedPassword
    delete u.password
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
