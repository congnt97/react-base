import { describe, expect, it } from 'vitest';

import { buildUrl } from '@/shared/url';

describe('buildUrl', () => {
  it('trả về endpoint gốc khi không có params', () => {
    expect(buildUrl('/projects')).toBe('/projects');
  });

  it('thay thế url params', () => {
    expect(buildUrl('/projects/:id', { id: 42 })).toBe('/projects/42');
  });

  it('thay thế mọi vị trí của cùng một param', () => {
    expect(buildUrl('/projects/:id/copy/:id', { id: 'a' })).toBe(
      '/projects/a/copy/a',
    );
  });

  it('không thay nhầm param có tên là prefix của param khác', () => {
    expect(buildUrl('/items/:id/:idType', { id: '1', idType: 'sku' })).toBe(
      '/items/1/sku',
    );
  });

  it('encode giá trị url param', () => {
    expect(buildUrl('/files/:name', { name: 'a b/c' })).toBe(
      '/files/a%20b%2Fc',
    );
  });

  it('gắn query params và bỏ qua giá trị undefined', () => {
    expect(
      buildUrl('/projects', undefined, {
        page: 1,
        keyword: 'demo',
        archived: undefined,
      }),
    ).toBe('/projects?page=1&keyword=demo');
  });
});
