import { describe, it, expect } from 'vitest';

function classifyReply(body: string) {
  const lowerBody = body.toLowerCase();
  
  if (/yes.*interested|send.*details|schedule.*demo|schedule.*call/i.test(lowerBody)) {
    return 'HOT';
  }
  if (/tell me more|sounds interesting/i.test(lowerBody)) {
    return 'WARM';
  }
  if (/already have|not right now/i.test(lowerBody)) {
    return 'OBJECTION';
  }
  if (/no thanks|not interested/i.test(lowerBody)) {
    return 'NOT_INTERESTED';
  }
  if (/remove me|unsubscribe|stop emailing/i.test(lowerBody)) {
    return 'UNSUBSCRIBE';
  }
  if (/out of the office|on vacation/i.test(lowerBody)) {
    return 'OUT_OF_OFFICE';
  }

  return 'UNKNOWN';
}

describe('Reply Classifier', () => {
  it('classifies HOT keywords', () => {
    expect(classifyReply('Yes, I am interested')).toBe('HOT');
    expect(classifyReply('Send me details please')).toBe('HOT');
    expect(classifyReply('Can we schedule a demo?')).toBe('HOT');
  });

  it('classifies WARM keywords', () => {
    expect(classifyReply('Tell me more about this')).toBe('WARM');
    expect(classifyReply('Sounds interesting, maybe later')).toBe('WARM');
  });

  it('classifies OBJECTION keywords', () => {
    expect(classifyReply('We already have something in place')).toBe('OBJECTION');
    expect(classifyReply('Not right now, thanks')).toBe('OBJECTION');
  });

  it('classifies NOT_INTERESTED keywords', () => {
    expect(classifyReply('No thanks')).toBe('NOT_INTERESTED');
    expect(classifyReply('Not interested')).toBe('NOT_INTERESTED');
  });

  it('classifies UNSUBSCRIBE keywords', () => {
    expect(classifyReply('Please remove me from this list')).toBe('UNSUBSCRIBE');
    expect(classifyReply('Unsubscribe')).toBe('UNSUBSCRIBE');
    expect(classifyReply('Stop emailing me')).toBe('UNSUBSCRIBE');
  });

  it('classifies OUT_OF_OFFICE patterns', () => {
    expect(classifyReply('I am out of the office until Monday')).toBe('OUT_OF_OFFICE');
    expect(classifyReply('Currently on vacation')).toBe('OUT_OF_OFFICE');
  });

  it('classifies ambiguous replies as UNKNOWN', () => {
    expect(classifyReply('Who is this?')).toBe('UNKNOWN');
    expect(classifyReply('Okay')).toBe('UNKNOWN');
  });
});
