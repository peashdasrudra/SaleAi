import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 0. Clean up existing data (in reverse dependency order to respect foreign keys)
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.task.deleteMany(),
    prisma.suppression.deleteMany(),
    prisma.reply.deleteMany(),
    prisma.emailMessage.deleteMany(),
    prisma.emailTemplate.deleteMany(),
    prisma.campaign.deleteMany(),
    prisma.scoreBreakdown.deleteMany(),
    prisma.prospectEvidence.deleteMany(),
    prisma.prospect.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('Database cleared.');

  // 1. Create User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'AiExpertLabs Admin',
      email: 'admin@aixpertlabs.com',
      passwordHash,
      timezone: 'Asia/Dhaka',
    },
  });
  console.log(`User created: ${user.email}`);

  // 2. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'AiExpertLabs',
      companyName: 'AiExpertLabs',
      companyWebsite: 'https://aixpertlabs.com',
      companyEmail: 'hello@aixpertlabs.com',
      businessAddress: 'Dhaka, Bangladesh',
      defaultSignature: 'Best regards,\nAiExpertLabs Team',
      ownerId: user.id,
    },
  });
  const workspaceId = workspace.id;
  console.log(`Workspace created: ${workspace.name}`);

  // Helpers for random generation
  const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  // 3. Create 20 US Prospects
  const usProspectsData = [
    { name: 'Smith Realty', fn: 'John', ln: 'Smith', title: 'Owner', email: 'john@smithrealty.com', st: 'CA', city: 'Los Angeles', status: 'NEW', p: 'A', score: 92, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Pacific Coast Properties', fn: 'Sarah', ln: 'Jenkins', title: 'Broker', email: 'sarah.j@pacificcoast.com', st: 'CA', city: 'San Diego', status: 'COMPLETE', p: 'A', score: 88, contact: 'SENT', src: 'MANUAL', estatus: 'VALIDATED' },
    { name: 'Texas Lone Star Real Estate', fn: 'Mike', ln: 'Johnson', title: 'Managing Partner', email: 'mike@txlonestar.com', st: 'TX', city: 'Austin', status: 'QUEUED', p: 'B', score: 75, contact: 'NOT_CONTACTED', src: 'CSV', estatus: 'VALIDATED' },
    { name: 'Miami Beach Homes', fn: 'Elena', ln: 'Rodriguez', title: 'Agent', email: 'elena@miamibeachhomes.com', st: 'FL', city: 'Miami', status: 'REVIEW_REQUIRED', p: 'B', score: 65, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'NY Metro Property Management', fn: 'David', ln: 'Cohen', title: 'Owner', email: 'david@nymetropm.com', st: 'NY', city: 'New York', status: 'COMPLETE', p: 'A', score: 95, contact: 'REPLIED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Chicago City Brokers', fn: 'Amanda', ln: 'Williams', title: 'Broker', email: 'amanda.w@chicagocitybrokers.com', st: 'IL', city: 'Chicago', status: 'NEW', p: 'C', score: 45, contact: 'NOT_CONTACTED', src: 'CSV', estatus: 'INVALID' },
    { name: 'Seattle Pines Realty', fn: 'Robert', ln: 'Chen', title: 'Agent', email: 'robert@seattlepines.com', st: 'WA', city: 'Seattle', status: 'QUEUED', p: 'B', score: 70, contact: 'NOT_CONTACTED', src: 'MANUAL', estatus: 'VALIDATED' },
    { name: 'Denver Peak Properties', fn: 'Lisa', ln: 'Davis', title: 'Managing Partner', email: 'lisa.davis@denverpeak.com', st: 'CO', city: 'Denver', status: 'COMPLETE', p: 'A', score: 85, contact: 'APPROVED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Vegas Valley Realty', fn: 'James', ln: 'Wilson', title: 'Owner', email: 'james@vegasvalleyrealty.com', st: 'NV', city: 'Las Vegas', status: 'NEW', p: 'C', score: 35, contact: 'NOT_CONTACTED', src: 'CSV', estatus: 'INVALID' },
    { name: 'Phoenix Sun Estates', fn: 'Maria', ln: 'Garcia', title: 'Broker', email: 'maria@phoenixsun.com', st: 'AZ', city: 'Phoenix', status: 'REVIEW_REQUIRED', p: 'B', score: 68, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Boston Brick Management', fn: 'William', ln: 'Brown', title: 'Owner', email: 'william@bostonbrick.com', st: 'MA', city: 'Boston', status: 'COMPLETE', p: 'A', score: 91, contact: 'SENT', src: 'MANUAL', estatus: 'VALIDATED' },
    { name: 'Atlanta Peach Realty', fn: 'Jessica', ln: 'Taylor', title: 'Agent', email: 'jessica.t@atlantapeach.com', st: 'GA', city: 'Atlanta', status: 'QUEUED', p: 'B', score: 72, contact: 'NOT_CONTACTED', src: 'CSV', estatus: 'VALIDATED' },
    { name: 'Nashville Sounds Properties', fn: 'Thomas', ln: 'Moore', title: 'Broker', email: 'thomas@nashvillesounds.com', st: 'TN', city: 'Nashville', status: 'NEW', p: 'C', score: 50, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'INVALID' },
    { name: 'Portland Rose Realty', fn: 'Jennifer', ln: 'Anderson', title: 'Managing Partner', email: 'jen@portlandrose.com', st: 'OR', city: 'Portland', status: 'COMPLETE', p: 'A', score: 89, contact: 'REPLIED', src: 'MANUAL', estatus: 'VALIDATED' },
    { name: 'SF Bay Area Estates', fn: 'Richard', ln: 'Thomas', title: 'Owner', email: 'richard@sfbayestates.com', st: 'CA', city: 'San Francisco', status: 'REVIEW_REQUIRED', p: 'B', score: 77, contact: 'NOT_CONTACTED', src: 'CSV', estatus: 'VALIDATED' },
    { name: 'Dallas Metro Realty', fn: 'Susan', ln: 'Jackson', title: 'Agent', email: 'susan@dallasmetro.com', st: 'TX', city: 'Dallas', status: 'NEW', p: 'B', score: 62, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Detroit Motor City Properties', fn: 'Charles', ln: 'White', title: 'Broker', email: 'charles@motorcityprop.com', st: 'MI', city: 'Detroit', status: 'QUEUED', p: 'C', score: 40, contact: 'NOT_CONTACTED', src: 'MANUAL', estatus: 'VALIDATED' },
    { name: 'Charlotte Queen City Realty', fn: 'Karen', ln: 'Harris', title: 'Owner', email: 'karen@queencityrealty.com', st: 'NC', city: 'Charlotte', status: 'COMPLETE', p: 'A', score: 86, contact: 'APPROVED', src: 'CSV', estatus: 'VALIDATED' },
    { name: 'Austin Capital Estates', fn: 'Daniel', ln: 'Martin', title: 'Managing Partner', email: 'daniel@austincapital.com', st: 'TX', city: 'Austin', status: 'NEW', p: 'B', score: 79, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' },
    { name: 'Austin Capital Estates', fn: 'Danielle', ln: 'Martin', title: 'Agent', email: 'danielle@austincapital.com', st: 'TX', city: 'Austin', status: 'NEW', p: 'C', score: 30, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', estatus: 'VALIDATED' }, // Duplicate domain
  ];

  const usProspects = await Promise.all(usProspectsData.map(p => 
    prisma.prospect.create({
      data: {
        workspaceId,
        companyName: p.name,
        website: `https://${p.email.split('@')[1]}`,
        contactFirstName: p.fn,
        contactLastName: p.ln,
        contactFullName: `${p.fn} ${p.ln}`,
        jobTitle: p.title,
        businessEmail: p.email,
        country: 'US',
        stateOrCounty: p.st,
        city: p.city,
        sourceType: p.src as any,
        researchStatus: p.status as any,
        contactStatus: p.contact as any,
        priority: p.p as any,
        totalScore: p.score,
        emailStatus: p.estatus as any,
      }
    })
  ));
  console.log(`Created 20 US Prospects`);

  // 4. Create 20 UK Prospects
  const ukProspectsData = [
    { name: 'Foxtons & Co', fn: 'Oliver', ln: 'Hughes', title: 'Director', email: 'oliver@foxtonsandco.co.uk', city: 'London', status: 'COMPLETE', p: 'A', score: 94, contact: 'SENT', src: 'USER_RESEARCH', type: 'Estate Agent' },
    { name: 'Barrington Estate Agency', fn: 'George', ln: 'Evans', title: 'Branch Manager', email: 'george@barringtonea.co.uk', city: 'Manchester', status: 'NEW', p: 'B', score: 76, contact: 'NOT_CONTACTED', src: 'CSV', type: 'Estate Agent' },
    { name: 'Northern Lettings', fn: 'Harry', ln: 'Davies', title: 'Lettings Manager', email: 'harry@northernlettings.co.uk', city: 'Leeds', status: 'REVIEW_REQUIRED', p: 'B', score: 68, contact: 'NOT_CONTACTED', src: 'MANUAL', type: 'Letting Agency' },
    { name: 'Bristol Property Group', fn: 'Jack', ln: 'Green', title: 'Senior Negotiator', email: 'jack@bristolpg.co.uk', city: 'Bristol', status: 'COMPLETE', p: 'A', score: 88, contact: 'REPLIED', src: 'USER_RESEARCH', type: 'Property Management' },
    { name: 'Edinburgh Castle Lettings', fn: 'Jacob', ln: 'Hall', title: 'Director', email: 'jacob@edinburghcastlelettings.co.uk', city: 'Edinburgh', status: 'QUEUED', p: 'B', score: 72, contact: 'NOT_CONTACTED', src: 'CSV', type: 'Letting Agency' },
    { name: 'Birmingham Prime Estates', fn: 'Charlie', ln: 'Wood', title: 'Branch Manager', email: 'charlie@bhamprime.co.uk', city: 'Birmingham', status: 'NEW', p: 'C', score: 45, contact: 'UNSUBSCRIBED', src: 'MANUAL', type: 'Estate Agent' },
    { name: 'London Central Properties', fn: 'Thomas', ln: 'Wright', title: 'Senior Negotiator', email: 'thomas@londoncentral.co.uk', city: 'London', status: 'COMPLETE', p: 'A', score: 91, contact: 'APPROVED', src: 'USER_RESEARCH', type: 'Property Management' },
    { name: 'Manchester Northern Quarter Lettings', fn: 'Arthur', ln: 'Robinson', title: 'Lettings Manager', email: 'arthur@mcrnqlettings.co.uk', city: 'Manchester', status: 'REVIEW_REQUIRED', p: 'B', score: 64, contact: 'NOT_CONTACTED', src: 'CSV', type: 'Letting Agency' },
    { name: 'Leeds Riverside Estates', fn: 'Mia', ln: 'Thompson', title: 'Director', email: 'mia@leedsriverside.co.uk', city: 'Leeds', status: 'NEW', p: 'A', score: 85, contact: 'NOT_CONTACTED', src: 'MANUAL', type: 'Estate Agent' },
    { name: 'Bristol Clifton Properties', fn: 'Amelia', ln: 'White', title: 'Branch Manager', email: 'amelia@bristolclifton.co.uk', city: 'Bristol', status: 'QUEUED', p: 'B', score: 70, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', type: 'Property Management' },
    { name: 'Edinburgh New Town Lettings', fn: 'Isla', ln: 'Watson', title: 'Lettings Manager', email: 'isla@edinburghnt.co.uk', city: 'Edinburgh', status: 'COMPLETE', p: 'C', score: 55, contact: 'BOUNCED', src: 'CSV', type: 'Letting Agency' },
    { name: 'Birmingham Bullring Estates', fn: 'Ava', ln: 'Jackson', title: 'Senior Negotiator', email: 'ava@bhambullring.co.uk', city: 'Birmingham', status: 'NEW', p: 'B', score: 78, contact: 'NOT_CONTACTED', src: 'MANUAL', type: 'Estate Agent' },
    { name: 'London West End Lettings', fn: 'Emily', ln: 'Harris', title: 'Director', email: 'emily@londonwestend.co.uk', city: 'London', status: 'REVIEW_REQUIRED', p: 'A', score: 90, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', type: 'Letting Agency' },
    { name: 'Manchester Piccadilly Properties', fn: 'Lily', ln: 'Clark', title: 'Branch Manager', email: 'lily@mcrpiccadilly.co.uk', city: 'Manchester', status: 'QUEUED', p: 'B', score: 66, contact: 'NOT_CONTACTED', src: 'CSV', type: 'Property Management' },
    { name: 'Leeds Headingley Estates', fn: 'Grace', ln: 'Lewis', title: 'Senior Negotiator', email: 'grace@leedsheadingley.co.uk', city: 'Leeds', status: 'COMPLETE', p: 'A', score: 82, contact: 'SENT', src: 'MANUAL', type: 'Estate Agent' },
    { name: 'Bristol Harbourside Lettings', fn: 'Sophia', ln: 'Walker', title: 'Lettings Manager', email: 'sophia@bristolharbourside.co.uk', city: 'Bristol', status: 'NEW', p: 'C', score: 48, contact: 'UNSUBSCRIBED', src: 'USER_RESEARCH', type: 'Letting Agency' },
    { name: 'Edinburgh Royal Mile Properties', fn: 'Chloe', ln: 'Young', title: 'Director', email: 'chloe@edinburghrm.co.uk', city: 'Edinburgh', status: 'REVIEW_REQUIRED', p: 'B', score: 74, contact: 'NOT_CONTACTED', src: 'CSV', type: 'Property Management' },
    { name: 'Birmingham Broad Street Estates', fn: 'Evie', ln: 'Allen', title: 'Branch Manager', email: 'evie@bhambroadst.co.uk', city: 'Birmingham', status: 'COMPLETE', p: 'A', score: 87, contact: 'REPLIED', src: 'MANUAL', type: 'Estate Agent' },
    { name: 'London City Airport Lettings', fn: 'Freya', ln: 'King', title: 'Lettings Manager', email: 'freya@londoncityairportlettings.co.uk', city: 'London', status: 'NEW', p: 'B', score: 69, contact: 'NOT_CONTACTED', src: 'USER_RESEARCH', type: 'Letting Agency' },
    { name: 'London City Airport Lettings', fn: 'Florence', ln: 'King', title: 'Senior Negotiator', email: 'florence@londoncityairportlettings.co.uk', city: 'London', status: 'COMPLETE', p: 'C', score: 35, contact: 'BOUNCED', src: 'USER_RESEARCH', type: 'Letting Agency' }, // Duplicate domain
  ];

  const ukProspects = await Promise.all(ukProspectsData.map(p => 
    prisma.prospect.create({
      data: {
        workspaceId,
        companyName: p.name,
        website: `https://${p.email.split('@')[1]}`,
        contactFirstName: p.fn,
        contactLastName: p.ln,
        contactFullName: `${p.fn} ${p.ln}`,
        jobTitle: p.title,
        businessEmail: p.email,
        country: 'UK',
        city: p.city,
        sourceType: p.src as any,
        researchStatus: p.status as any,
        contactStatus: p.contact as any,
        priority: p.p as any,
        totalScore: p.score,
        businessType: p.type,
      }
    })
  ));
  console.log(`Created 20 UK Prospects`);

  const allProspects = [...usProspects, ...ukProspects];

  // 5. Create 15 ProspectEvidence records
  const evidenceTypes = ['WEBSITE_FORM', 'NO_INSTANT_ACKNOWLEDGMENT', 'NO_BOOKING_LINK', 'MISSED_CALL_GAP', 'ACTIVE_LISTING', 'RECENT_REVIEW', 'SMALL_TEAM'];
  const evidenceDetails = [
    "Contact form found at example.com/contact",
    "No auto-reply observed after form submission",
    "No online viewing booking option available",
    "No missed-call text-back service visible",
    "Currently showing 12 active property listings",
    "Latest Google review from 2 weeks ago",
    "Team of 3 agents listed on website"
  ];

  for (let i = 0; i < 15; i++) {
    const prospect = allProspects[i];
    const typeIndex = i % evidenceTypes.length;
    await prisma.prospectEvidence.create({
      data: {
        prospectId: prospect.id,
        evidenceType: evidenceTypes[typeIndex] as any,
        evidenceText: evidenceDetails[typeIndex],
        observedAt: new Date(),
        verifiedByUser: i % 3 === 0,
        confidence: Math.floor(Math.random() * 55) + 40,
      }
    });
  }
  console.log(`Created 15 ProspectEvidence records`);

  // 6. Create ScoreBreakdown records for 10 prospects
  const breakdownFactors = [
    { factor: 'Active listing', score: 15, details: '+15 active listing' },
    { factor: 'Website form', score: 10, details: '+10 website form' },
    { factor: 'No instant acknowledgment', score: 10, details: '+10 no instant acknowledgment' },
    { factor: 'Large corporate', score: -10, details: '-10 large corporate' },
    { factor: 'Recent review', score: 5, details: '+5 recent review' },
  ];

  for (let i = 0; i < 10; i++) {
    const prospect = allProspects[i + 5];
    for (let j = 0; j < 3; j++) {
      const factor = breakdownFactors[(i + j) % breakdownFactors.length];
      await prisma.scoreBreakdown.create({
        data: {
          prospectId: prospect.id,
          factor: factor.factor,
          points: factor.score,
          explanation: factor.details,
        }
      });
    }
  }
  console.log(`Created ScoreBreakdown records`);

  // 7. Create 4 Campaigns
  const campaignsData = [
    { name: 'US Independent RE Agents - Inquiry Response', targetCountry: 'US' },
    { name: 'UK Estate Agencies - Viewing Automation', targetCountry: 'UK' },
    { name: 'UK Letting Agencies - Tenant Response', targetCountry: 'UK' },
    { name: 'Property Businesses - Website Conversion', targetCountry: 'US' },
  ];

  const campaigns = await Promise.all(campaignsData.map(c => 
    prisma.campaign.create({
      data: {
        workspaceId,
        name: c.name,
        status: 'DRAFT',
        targetCountry: c.targetCountry,
      }
    })
  ));
  console.log(`Created 4 Campaigns`);

  // 8. Create 4 EmailTemplates
  const templatesData = [
    { type: 'INITIAL', subject: 'Quick question about {{company_name}}', body: 'Hi {{first_name}},\n\nI noticed on {{company_or_website}} that {{verified_observation}}.\n\nAre you open to a quick chat?' },
    { type: 'FOLLOW_UP_1', subject: 'Re: {{company_name}} inquiry response', body: 'Hi {{first_name}},\n\nFollowing up on my previous note. We could help with {{specific_fix}}.' },
    { type: 'FOLLOW_UP_2', subject: 'Short checklist for {{company_name}}', body: 'Hi {{first_name}},\n\nHere is a short checklist that might help your team.' },
    { type: 'BREAKUP', subject: 'Should I close the loop?', body: 'Hi {{first_name}},\n\nI haven\'t heard back, so I\'ll assume this isn\'t a priority right now.' },
  ];

  await Promise.all(templatesData.map((t, index) => 
    prisma.emailTemplate.create({
      data: {
        workspaceId,
        name: `Template ${index + 1}`,
        templateType: t.type as any,
        subjectTemplate: t.subject,
        bodyTemplate: t.body,
      }
    })
  ));
  console.log(`Created 4 EmailTemplates`);

  // 9. Create 5 Sample Replies
  const repliesData = [
    { type: 'HOT', content: "Yes, I'd love to see a demo. Can we schedule a call this week?" },
    { type: 'WARM', content: "Interesting, tell me more about how this works" },
    { type: 'OBJECTION', content: "We already have a system in place but it's not great" },
    { type: 'UNSUBSCRIBE', content: "Please remove me from your list" },
    { type: 'OUT_OF_OFFICE', content: "I am currently out of the office until August 30th" },
  ];

  const repliedProspects = allProspects.filter(p => p.contactStatus === 'REPLIED');

  for (let i = 0; i < 5; i++) {
    const r = repliesData[i];
    const prospect = repliedProspects[i % repliedProspects.length] || allProspects[i];
    
    const generatedEmail = await prisma.generatedEmail.create({
      data: {
        prospectId: prospect.id,
        campaignId: campaigns[0].id,
        subject: `Re: Quick question about ${prospect.companyName}`,
        bodyHtml: r.content,
        bodyText: r.content,
      }
    });

    const emailMessage = await prisma.emailMessage.create({
      data: {
        prospectId: prospect.id,
        campaignId: campaigns[0].id,
        generatedEmailId: generatedEmail.id,
        providerMessageId: `msg-${Date.now()}-${i}`,
        stepNumber: 1,
        sentAt: new Date(),
      }
    });

    await prisma.reply.create({
      data: {
        prospectId: prospect.id,
        emailMessageId: emailMessage.id,
        senderEmail: prospect.businessEmail || 'unknown@example.com',
        bodyText: r.content,
        classification: r.type as any,
        receivedAt: new Date(),
      }
    });
  }
  console.log(`Created 5 Sample Replies`);

  // 10. Create 2 Suppression entries
  await prisma.suppression.createMany({
    data: [
      { workspaceId, email: 'nomore@example.com', reason: 'UNSUBSCRIBE' },
      { workspaceId, domain: 'bounceddomain.com', reason: 'HARD_BOUNCE' },
    ]
  });
  console.log(`Created 2 Suppression entries`);

  // 11. Create 3 Tasks
  const tasksData = [
    'Follow up with hot lead',
    'Review AI-generated emails',
    'Verify evidence for Smith Realty',
  ];

  await Promise.all(tasksData.map(t => 
    prisma.task.create({
      data: {
        workspaceId,
        title: t,
        status: 'OPEN',
        dueAt: new Date(Date.now() + 86400000), // tomorrow
      }
    })
  ));
  console.log(`Created 3 Tasks`);

  // 12. Create 5 Notifications
  const notificationsData = [
    { title: 'New Reply Received', type: 'REPLY' },
    { title: 'Hot Lead Identified!', type: 'HOT_LEAD' },
    { title: 'Email Bounced', type: 'BOUNCE' },
    { title: 'Another Reply', type: 'REPLY' },
    { title: 'New Hot Lead', type: 'HOT_LEAD' },
  ];

  await Promise.all(notificationsData.map(n => 
    prisma.notification.create({
      data: {
        workspaceId,
        message: n.title,
        type: n.type as any,
      }
    })
  ));
  console.log(`Created 5 Notifications`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
