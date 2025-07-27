/**
 * Timezone utilities for automatic detection and formatting
 */

// Get user's timezone automatically
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect user timezone, falling back to UTC:', error);
    return 'UTC';
  }
};

// Get timezone offset in minutes
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

// Get timezone abbreviation (e.g., "CST", "EST")
export const getTimezoneAbbreviation = (): string => {
  try {
    const date = new Date();
    const timeZoneName = date
      .toLocaleDateString('en', {
        day: '2-digit',
        timeZoneName: 'short',
      })
      .slice(4);
    return timeZoneName;
  } catch (error) {
    console.warn('Could not get timezone abbreviation:', error);
    return 'UTC';
  }
};

// Format date to user's local timezone
export const formatToUserTimezone = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {},
): string => {
  try {
    const date = new Date(dateString);

    // Default formatting options
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: getUserTimezone(),
      ...options,
    };

    return date.toLocaleDateString('es-ES', defaultOptions);
  } catch (error) {
    console.warn('Error formatting date to user timezone:', error);
    return new Date(dateString).toLocaleString('es-ES');
  }
};

// Format time only to user's timezone
export const formatTimeToUserTimezone = (dateString: string): string => {
  return formatToUserTimezone(dateString, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format date only to user's timezone
export const formatDateToUserTimezone = (dateString: string): string => {
  return formatToUserTimezone(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get relative time with timezone awareness
export const getRelativeTimeWithTimezone = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return formatTimeToUserTimezone(dateString);
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        timeZone: getUserTimezone(),
      });
    } else {
      return formatDateToUserTimezone(dateString);
    }
  } catch (error) {
    console.warn('Error getting relative time:', error);
    return new Date(dateString).toLocaleString('es-ES');
  }
};

// Check if date is today in user's timezone
export const isToday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const userTimezone = getUserTimezone();

    const dateInUserTz = new Date(date.toLocaleString('en-US', { timeZone: userTimezone }));
    const todayInUserTz = new Date(today.toLocaleString('en-US', { timeZone: userTimezone }));

    return dateInUserTz.toDateString() === todayInUserTz.toDateString();
  } catch (error) {
    console.warn('Error checking if date is today:', error);
    return false;
  }
};

// Get user's timezone info for debugging/logging
export const getTimezoneInfo = () => {
  return {
    timezone: getUserTimezone(),
    offset: getTimezoneOffset(),
    abbreviation: getTimezoneAbbreviation(),
    locale: navigator.language || 'es-ES',
  };
};

// Log timezone info on app startup
export const logTimezoneInfo = () => {
  const info = getTimezoneInfo();
  console.log('🌍 Timezone Detection:', {
    timezone: info.timezone,
    offset: `UTC${info.offset > 0 ? '-' : '+'}${Math.abs(info.offset / 60)}`,
    abbreviation: info.abbreviation,
    locale: info.locale,
    currentTime: new Date().toLocaleString('es-ES', { timeZone: info.timezone }),
  });
};
