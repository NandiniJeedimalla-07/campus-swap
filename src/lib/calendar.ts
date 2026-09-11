import { Rental } from '@/types';

/**
 * Calendar utility functions for Campus Swap
 * Supports Google Calendar and iCalendar (.ics) formats
 */

interface CalendarEvent {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location?: string;
}

/**
 * Generate a Google Calendar URL for a rental event
 */
export const generateGoogleCalendarUrl = (rental: Rental, sellerName?: string, sellerContact?: string): string => {
    const start = new Date(rental.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(rental.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const title = encodeURIComponent(`Return: ${rental.itemName}${rental.quantity > 1 ? ` (Qty: ${rental.quantity})` : ''}`);

    // Enhanced description with more details
    const descriptionParts = [
        `Rental Period: ${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}`,
        `Item: ${rental.itemName}`,
        `Quantity: ${rental.quantity}`,
        `Price: ₹${rental.pricePerDay}/day`,
    ];

    if (sellerName) {
        descriptionParts.push(`Seller: ${sellerName}`);
    }

    if (sellerContact) {
        descriptionParts.push(`Contact: ${sellerContact}`);
    }

    descriptionParts.push('', 'Please return the item(s) to the seller by the end date.');

    const description = encodeURIComponent(descriptionParts.join('\n'));

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}&sf=true&output=xml`;
};

/**
 * Generate an iCalendar (.ics) file content
 */
export const generateICalendarContent = (rental: Rental, sellerName?: string, sellerContact?: string): string => {
    const formatDate = (date: Date): string => {
        return new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatDate(rental.startDate);
    const end = formatDate(rental.endDate);
    const now = formatDate(new Date());

    const title = `Return: ${rental.itemName}${rental.quantity > 1 ? ` (Qty: ${rental.quantity})` : ''}`;

    const descriptionParts = [
        `Rental Period: ${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}`,
        `Item: ${rental.itemName}`,
        `Quantity: ${rental.quantity}`,
        `Price: ₹${rental.pricePerDay}/day`,
    ];

    if (sellerName) {
        descriptionParts.push(`Seller: ${sellerName}`);
    }

    if (sellerContact) {
        descriptionParts.push(`Contact: ${sellerContact}`);
    }

    descriptionParts.push('', 'Please return the item(s) to the seller by the end date.');

    const description = descriptionParts.join('\\n');

    // RFC 5545 compliant iCalendar format
    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Campus Swap//Rental Reminder//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${rental.id}@campus-swap.app`,
        `DTSTAMP:${now}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT24H',
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${title}`,
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
};

/**
 * Download an iCalendar (.ics) file
 */
export const downloadICalendar = (rental: Rental, sellerName?: string, sellerContact?: string): void => {
    const content = generateICalendarContent(rental, sellerName, sellerContact);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `rental-${rental.itemName.replace(/\s+/g, '-').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Open Google Calendar with the rental event
 */
export const addToGoogleCalendar = (rental: Rental, sellerName?: string, sellerContact?: string): void => {
    const url = generateGoogleCalendarUrl(rental, sellerName, sellerContact);
    window.open(url, '_blank');
};

/**
 * Format time remaining for a rental
 */
export const getTimeRemaining = (endDate: Date, now: Date = new Date()): string => {
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
};

/**
 * Check if a rental is expiring soon (within 24 hours)
 */
export const isExpiringSoon = (endDate: Date, now: Date = new Date()): boolean => {
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    const hoursRemaining = diff / (1000 * 60 * 60);

    return hoursRemaining > 0 && hoursRemaining <= 24;
};
