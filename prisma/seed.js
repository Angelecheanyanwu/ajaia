const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123', 10)

  const users = [
    { email: 'somtoecheanyanwu', name: 'Somto Echeanyanwu', password },
    { email: 'angelsam',         name: 'Angel Sam',          password },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { password, name: user.name },
      create: user,
    })
  }

  // Create a demo document owned by Somto and shared with Angel
  const somto = await prisma.user.findUnique({ where: { email: 'somtoecheanyanwu' } })
  const angel = await prisma.user.findUnique({ where: { email: 'angelsam' } })

  if (somto && angel) {
    const demoDoc = await prisma.document.upsert({
      where: { id: 'demo-shared-doc-001' },
      update: {},
      create: {
        id: 'demo-shared-doc-001',
        title: 'Project Roadmap (Shared)',
        content: JSON.stringify({
          type: 'doc',
          content: [
            { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '📋 Project Roadmap' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'This document is owned by Somto and shared with Angel.' }] },
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Phase 1 — Setup' }] },
            { type: 'bulletList', content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Initialize project workspace' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Configure authentication' }] }] },
            ]},
            { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Phase 2 — Development' }] },
            { type: 'bulletList', content: [
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Build editor components' }] }] },
              { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Implement sharing logic' }] }] },
            ]},
          ]
        }),
        ownerId: somto.id,
        sharedWith: { connect: { id: angel.id } }
      }
    })
    console.log('Created shared demo document:', demoDoc.title)
  }

  console.log('✅ Seeded users:', users.map(u => u.name).join(', '))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
