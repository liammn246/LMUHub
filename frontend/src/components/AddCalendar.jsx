import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const AddCalendar = ({ gig }) => {
  const [added, setAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCalendarEvent = async (accessToken) => {
    setIsLoading(true);
    setError(null);

    if (!gig.scheduledDate || !gig.endTime) {
        setError('This gig does not have a scheduled date and time.');
        setIsLoading(false);
        return;
    }

    let startDateObj = new Date(gig.scheduledDate);
    let endDateObj = new Date(gig.endTime);

    if (startDateObj.getFullYear() < 2000 || startDateObj.getFullYear() > 2100 ||
        endDateObj.getFullYear() < 2000 || endDateObj.getFullYear() > 2100) {
        setError('The dates for this gig are invalid.');
        setIsLoading(false);
        return;
    }

    const event = {
      'summary': gig.header || 'Gig Event',
      'description': gig.body || 'Event from LMU App',
      'start': {
        'dateTime': startDateObj.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': endDateObj.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      const data = await response.json();
      if (response.ok) {
        setAdded(true);
      } else {
        setError(data.error?.message || 'Failed to add event to calendar.');
      }
    } catch (err) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onSuccess: (tokenResponse) => {
      createCalendarEvent(tokenResponse.access_token);
    },
    onError: (err) => {
      setError('Failed to authenticate with Google. Please try again.');
      setIsLoading(false);
    },
  });

  if (added) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Added to Calendar
      </span>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-1">
        <button 
          onClick={() => {
            setError(null);
            login();
          }} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Retry
        </button>
        <p className="text-xs text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <button 
      onClick={() => login()} 
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow hover:scale-105 active:scale-95"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Adding...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Add to Calendar</span>
        </>
      )}
    </button>
  );
};

export default AddCalendar;
