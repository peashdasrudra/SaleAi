const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting minimal seed...');
  
  const passwordHash = await bcrypt.hash('admin123', 10);
  let user = await prisma.user.findUnique({ where: { email: 'admin@aixpertlabs.com' } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'AiExpertLabs Admin',
        email: 'admin@aixpertlabs.com',
        passwordHash,
        timezone: 'Asia/Dhaka',
      },
    });
    console.log(`User created: ${user.email}`);
  } else {
    // Update password just in case
    await prisma.user.update({
      where: { email: 'admin@aixpertlabs.com' },
      data: { passwordHash }
    });
    console.log(`User updated: ${user.email}`);
  }

  const workspaceCount = await prisma.workspace.count({ where: { ownerId: user.id }});
  if (workspaceCount === 0) {
    const workspace = await prisma.workspace.create({
      data: {
        name: 'AiExpertLabs',
        companyName: 'AiExpertLabs',
        companyWebsite: 'https://aixpertlabs.com',
        companyEmail: 'hello@aixpertlabs.com',
        businessAddress: 'Dhaka, Bangladesh',
        defaultSignature: 'Best regards,\\nAiExpertLabs Team',
        ownerId: user.id,
      },
    });
    console.log(`Workspace created: ${workspace.name}`);
  }
}

main()
  .catch((e) => {
    console.error('Error during minimal seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
