import { useMemo } from 'react';

export type Personalization = {
  name: string;
  displayName: string;
  greeting: string;
  heroLine: string;
  countdownLine: string;
  videoCaption: string;
  rsvpOpening: string;
  thankYouAccept: string;
  thankYouDecline: string;
};

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function usePersonalization(name: string): Personalization {
  return useMemo(() => {
    const displayName = toTitleCase(name.trim() || 'Guest');
    return {
      name: displayName,
      displayName,
      greeting: `Dear ${displayName},`,
      heroLine: `Dear ${displayName}, together with their families, they joyfully invite you to celebrate their union`,
      countdownLine: `${displayName}, the countdown to our forever begins…`,
      videoCaption: `${displayName}, we'd love for you to relive this chapter with us`,
      rsvpOpening: `${displayName}, will you grace us with your presence?`,
      thankYouAccept: `We can't wait to see you, ${displayName} ♡`,
      thankYouDecline: `We'll miss you, ${displayName} — your blessings mean the world to us ♡`,
    };
  }, [name]);
}

export function getStoredName(): string | null {
  try {
    return sessionStorage.getItem('guestName');
  } catch {
    return null;
  }
}

export function writeStoredName(name: string): void {
  try {
    sessionStorage.setItem('guestName', name.trim());
  } catch {
    // Ignore
  }
}
