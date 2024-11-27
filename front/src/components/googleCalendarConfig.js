/* global google */
export const loadGoogleAPI = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // המתן לטעינת הסקריפט של Google Identity Services
      await new Promise((resolve) => {
        const checkGoogleExists = setInterval(() => {
          if (window.google && window.google.accounts) {
            clearInterval(checkGoogleExists);
            resolve();
          }
        }, 100);
      });

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            reject(tokenResponse);
            return;
          }
          resolve(tokenResponse);
        },
      });

      // Load the Google API client library
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      await new Promise((resolve, reject) => {
        window.gapi.load('client', resolve);
      });

      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });

      // Store the token client for later use
      window.tokenClient = client;
      
      resolve();
    } catch (error) {
      console.error('Error loading Google API:', error);
      reject(error);
    }
  });
};

export const addEventToCalendar = async (event) => {
  try {
    // Request an access token
    await new Promise((resolve, reject) => {
      if (!window.tokenClient) {
        reject(new Error('Token client not initialized'));
        return;
      }
      window.tokenClient.callback = (response) => {
        if (response.error) {
          reject(response);
          return;
        }
        resolve(response);
      };
      window.tokenClient.requestAccessToken({ prompt: 'consent' });
    });

    // Add the event to the calendar
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    console.log('Event added successfully:', response);
    return response;
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    throw error;
  }
};