import { Injectable } from '@angular/core';


export const FIRST_PRIZE_LIST = 'FIRST_PRIZE_LIST';
export const SECOND_PRIZE_LIST = 'SECOND_PRIZE_LIST';
export const THIRD_PRIZE_LIST = 'THIRD_PRIZE_LIST';
export const TOTAL_USER_LIST = 'TOTAL_USER_LIST';
@Injectable({providedIn: 'root'})
export class CacheService {
  constructor() { }
  setKey(type: string, key: string): void {
    localStorage.setItem(type, key);
  }

  getKey(type: string): string | null {
      return localStorage.getItem(type) || null;
  }

  removeKey(type: string): void {
      localStorage.removeItem(type);
  }
}
