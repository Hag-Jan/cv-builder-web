import { formatDate, formatPhone, isValidEmail, isValidUrl, ensureUrlScheme, normalizePhone, isValidPhone } from '../src/lib/utils/date-formatter';

describe('date-formatter utils', () => {
    describe('formatDate', () => {
        test('preserves July 0007 exactly', () => {
            expect(formatDate('July 0007')).toBe('Jul 0007');
            expect(formatDate('Jul 0007')).toBe('Jul 0007');
        });

        test('formats standard input YYYY-MM', () => {
            expect(formatDate('2023-07')).toBe('Jul 2023');
            expect(formatDate('1907-01')).toBe('Jan 1907');
        });

        test('formats MM/YYYY', () => {
            expect(formatDate('07/2023')).toBe('Jul 2023');
            expect(formatDate('7/2023')).toBe('Jul 2023');
        });

        test('preserves year-only inputs', () => {
            expect(formatDate('2023')).toBe('2023');
            expect(formatDate('0007')).toBe('0007');
        });

        test('handles Present and variants', () => {
            expect(formatDate('Present')).toBe('Present');
            expect(formatDate('present')).toBe('Present');
            expect(formatDate('Now')).toBe('Present');
        });

        test('returns original for ambiguous or unknown formats', () => {
            expect(formatDate('07/08/23')).toBe('07/08/23');
            expect(formatDate('not a date')).toBe('not a date');
        });

        test('handles null/empty', () => {
            expect(formatDate('')).toBe('');
            expect(formatDate(null as any)).toBe('');
        });
    });

    describe('formatPhone', () => {
        test('formats 10 digit numbers', () => {
            expect(formatPhone('5551234567')).toBe('(555) 123-4567');
        });
        test('formats 11 digit numbers starting with 1', () => {
            expect(formatPhone('15551234567')).toBe('+1 (555) 123-4567');
        });
        test('preserves others', () => {
            expect(formatPhone('12345')).toBe('12345');
        });
    });

    describe('normalizePhone', () => {
        test('normalizes 10 digit US numbers', () => {
            expect(normalizePhone('5551234567')).toBe('+15551234567');
        });
    });

    describe('isValidPhone', () => {
        test('validates 10 digit number', () => {
            expect(isValidPhone('5551234567')).toBe(true);
        });
        test('validates number with formatting', () => {
            expect(isValidPhone('(555) 123-4567')).toBe(true);
        });
        test('rejects too short numbers', () => {
            expect(isValidPhone('123')).toBe(false);
        });
    });

    describe('isValidEmail', () => {
        test('validates standard emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
        });
        test('rejects invalid emails', () => {
            expect(isValidEmail('plain')).toBe(false);
            expect(isValidEmail('@domain.com')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
        });
    });

    describe('ensureUrlScheme', () => {
        test('adds https if missing', () => {
            expect(ensureUrlScheme('example.com')).toBe('https://example.com');
        });
        test('preserves existing scheme', () => {
            expect(ensureUrlScheme('http://example.com')).toBe('http://example.com');
            expect(ensureUrlScheme('https://example.com')).toBe('https://example.com');
        });
    });

    describe('isValidUrl', () => {
        test('validates URL with scheme', () => {
            expect(isValidUrl('https://google.com')).toBe(true);
        });
        test('validates URL without scheme', () => {
            expect(isValidUrl('google.com')).toBe(true);
        });
    });
});
