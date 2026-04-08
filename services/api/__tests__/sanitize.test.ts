import { inputSanitizer } from '../src/middleware/sanitize';
import { Request, Response } from 'express';

function createMockReq(body: any = {}, query: any = {}, params: any = {}): Partial<Request> {
  return { body, query, params };
}

function createMockRes(): Partial<Response> {
  return {};
}

describe('Input Sanitization Middleware', () => {
  const next = jest.fn();

  beforeEach(() => {
    next.mockClear();
  });

  it('should call next() for clean input', () => {
    const req = createMockReq({ name: 'Margaret Thompson' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.name).toBe('Margaret Thompson');
  });

  it('should strip HTML tags from body strings', () => {
    const req = createMockReq({ name: '<script>alert("xss")</script>Margaret' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.name).toBe('alert("xss")Margaret');
  });

  it('should strip HTML from nested objects', () => {
    const req = createMockReq({
      patient: { name: '<b>Bold</b> Name', notes: '<img src=x onerror=alert(1)>safe' },
    });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.patient.name).toBe('Bold Name');
    expect(req.body.patient.notes).toBe('safe');
  });

  it('should strip HTML from arrays', () => {
    const req = createMockReq({ tags: ['<em>tag1</em>', 'tag2', '<script>bad</script>'] });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.tags).toEqual(['tag1', 'tag2', '']);
  });

  it('should remove null bytes', () => {
    const req = createMockReq({ name: 'test\0value' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.name).toBe('testvalue');
  });

  it('should neutralize SQL comment patterns', () => {
    const req = createMockReq({ search: "Robert'; DROP TABLE patients--" });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.search).not.toContain('--');
  });

  it('should trim whitespace from strings', () => {
    const req = createMockReq({ name: '  Margaret  ' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.name).toBe('Margaret');
  });

  it('should sanitize query parameters', () => {
    const req = createMockReq({}, { search: '<script>xss</script>test' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.query!.search).toBe('xsstest');
  });

  it('should sanitize URL params', () => {
    const req = createMockReq({}, {}, { id: '<b>123</b>' });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.params!.id).toBe('123');
  });

  it('should preserve non-string values (numbers, booleans)', () => {
    const req = createMockReq({ age: 85, active: true, score: 0.75 });
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(req.body.age).toBe(85);
    expect(req.body.active).toBe(true);
    expect(req.body.score).toBe(0.75);
  });

  it('should handle null body gracefully', () => {
    const req = createMockReq(null);
    inputSanitizer(req as Request, createMockRes() as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
