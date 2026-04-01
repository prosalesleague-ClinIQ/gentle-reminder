import {
  createCard,
  processReview,
  getReviewSchedule,
  generateFamilyCards,
  MemoryCard,
} from '../src/exercises/spaced-repetition';

describe('Spaced Repetition Engine', () => {
  describe('createCard', () => {
    it('initializes with correct defaults', () => {
      const card = createCard({
        id: 'test-1',
        prompt: 'Who is this?',
        answer: 'Your daughter Sarah',
        category: 'person',
      });

      expect(card.id).toBe('test-1');
      expect(card.prompt).toBe('Who is this?');
      expect(card.answer).toBe('Your daughter Sarah');
      expect(card.category).toBe('person');
      expect(card.lastQuality).toBe(0);
      expect(card.intervalHours).toBe(1);
      expect(card.easeFactor).toBe(2.5);
      expect(card.repetitions).toBe(0);
      expect(card.nextReviewAt).toBeInstanceOf(Date);
      expect(card.lastReviewedAt).toBeUndefined();
    });

    it('includes optional photoUrl when provided', () => {
      const card = createCard({
        id: 'test-2',
        prompt: 'Where is this?',
        answer: 'Your garden',
        category: 'place',
        photoUrl: 'https://example.com/garden.jpg',
      });

      expect(card.photoUrl).toBe('https://example.com/garden.jpg');
      expect(card.category).toBe('place');
    });
  });

  describe('processReview', () => {
    let baseCard: MemoryCard;

    beforeEach(() => {
      baseCard = createCard({
        id: 'review-test',
        prompt: 'Who is this?',
        answer: 'Your son Tom',
        category: 'person',
      });
    });

    it('increases interval after successful recall (quality >= 3)', () => {
      const reviewed = processReview(baseCard, 4);

      expect(reviewed.repetitions).toBe(1);
      expect(reviewed.intervalHours).toBe(1); // First successful = 1 hour
      expect(reviewed.lastQuality).toBe(4);
      expect(reviewed.lastReviewedAt).toBeInstanceOf(Date);
    });

    it('sets interval to 6 hours on second successful recall', () => {
      const first = processReview(baseCard, 4);
      const second = processReview(first, 4);

      expect(second.repetitions).toBe(2);
      expect(second.intervalHours).toBe(6);
    });

    it('scales interval by ease factor on third and later recalls', () => {
      const first = processReview(baseCard, 5);
      const second = processReview(first, 5);
      const third = processReview(second, 5);

      // Third recall: intervalHours * easeFactor = 6 * ~2.6 = ~16
      expect(third.repetitions).toBe(3);
      expect(third.intervalHours).toBeGreaterThan(6);
    });

    it('decreases interval after poor recall (quality < 3)', () => {
      // Give the card a larger interval first
      const cardWithInterval: MemoryCard = {
        ...baseCard,
        intervalHours: 24,
        repetitions: 3,
      };

      const reviewed = processReview(cardWithInterval, 1);

      expect(reviewed.intervalHours).toBe(12); // 24 * 0.5
      expect(reviewed.repetitions).toBe(2); // reduced by 1
    });

    it('never allows interval to exceed 168 hours (7 days)', () => {
      const cardWithHighInterval: MemoryCard = {
        ...baseCard,
        intervalHours: 100,
        easeFactor: 2.5,
        repetitions: 5,
      };

      const reviewed = processReview(cardWithHighInterval, 5);

      expect(reviewed.intervalHours).toBeLessThanOrEqual(168);
    });

    it('never allows interval to go below 1 hour', () => {
      const cardWithLowInterval: MemoryCard = {
        ...baseCard,
        intervalHours: 1,
        repetitions: 1,
      };

      const reviewed = processReview(cardWithLowInterval, 0);

      expect(reviewed.intervalHours).toBeGreaterThanOrEqual(1);
    });

    it('never allows ease factor to go below 1.5', () => {
      let card = { ...baseCard, easeFactor: 1.6 };

      // Repeatedly fail to push ease factor down
      card = processReview(card, 0) as MemoryCard;
      card = processReview(card, 0) as MemoryCard;
      card = processReview(card, 0) as MemoryCard;

      expect(card.easeFactor).toBeGreaterThanOrEqual(1.5);
    });

    it('clamps quality to 0-5 range', () => {
      const reviewedHigh = processReview(baseCard, 10);
      expect(reviewedHigh.lastQuality).toBe(5);

      const reviewedLow = processReview(baseCard, -3);
      expect(reviewedLow.lastQuality).toBe(0);
    });

    it('updates nextReviewAt to a future date', () => {
      const before = new Date();
      const reviewed = processReview(baseCard, 4);

      expect(reviewed.nextReviewAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('getReviewSchedule', () => {
    it('separates due/soon/reviewed cards correctly', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 3600000); // 1 hour ago
      const soonDate = new Date(now.getTime() + 3600000); // 1 hour from now
      const futureDate = new Date(now.getTime() + 10 * 3600000); // 10 hours from now

      const dueCard: MemoryCard = {
        ...createCard({ id: 'due', prompt: 'P', answer: 'A', category: 'fact' }),
        nextReviewAt: pastDate,
      };

      const soonCard: MemoryCard = {
        ...createCard({ id: 'soon', prompt: 'P', answer: 'A', category: 'fact' }),
        nextReviewAt: soonDate,
      };

      const futureCard: MemoryCard = {
        ...createCard({ id: 'future', prompt: 'P', answer: 'A', category: 'fact' }),
        nextReviewAt: futureDate,
      };

      const reviewedCard: MemoryCard = {
        ...createCard({ id: 'reviewed', prompt: 'P', answer: 'A', category: 'fact' }),
        nextReviewAt: futureDate,
        lastReviewedAt: pastDate,
      };

      const schedule = getReviewSchedule([dueCard, soonCard, futureCard, reviewedCard]);

      expect(schedule.dueNow).toHaveLength(1);
      expect(schedule.dueNow[0].id).toBe('due');
      expect(schedule.dueSoon).toHaveLength(1);
      expect(schedule.dueSoon[0].id).toBe('soon');
      expect(schedule.reviewed).toBe(1);
      expect(schedule.totalCards).toBe(4);
    });

    it('returns empty arrays when no cards are due', () => {
      const futureDate = new Date(Date.now() + 24 * 3600000);
      const card: MemoryCard = {
        ...createCard({ id: '1', prompt: 'P', answer: 'A', category: 'fact' }),
        nextReviewAt: futureDate,
      };

      const schedule = getReviewSchedule([card]);

      expect(schedule.dueNow).toHaveLength(0);
      expect(schedule.dueSoon).toHaveLength(0);
      expect(schedule.totalCards).toBe(1);
    });
  });

  describe('generateFamilyCards', () => {
    it('creates cards for each family member', () => {
      const family = [
        { name: 'Sarah', relationship: 'daughter' },
        { name: 'Tom', relationship: 'son' },
        { name: 'Emily', relationship: 'granddaughter', photoUrl: 'https://example.com/emily.jpg' },
      ];

      const cards = generateFamilyCards(family);

      expect(cards).toHaveLength(3);
      expect(cards[0].id).toBe('family-0');
      expect(cards[0].prompt).toBe('Who is Sarah?');
      expect(cards[0].answer).toBe('Sarah is your daughter');
      expect(cards[0].category).toBe('person');
      expect(cards[2].photoUrl).toBe('https://example.com/emily.jpg');
    });

    it('returns empty array for empty input', () => {
      const cards = generateFamilyCards([]);
      expect(cards).toHaveLength(0);
    });
  });
});
