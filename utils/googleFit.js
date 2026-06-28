/**
 * Google Fit REST API and OAuth2 Helper
 */

// Supported Scopes for Google Fit Web OAuth2
export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.oxygen_saturation.read'
];

/**
 * Checks if client ID or connection should be simulated
 */
export function isMockClient(clientId) {
  return !clientId || clientId.trim() === '' || clientId.toLowerCase() === 'mock';
}

/**
 * Builds the Google OAuth 2.0 Authorization URL
 */
export function getGoogleAuthUrl(clientId, redirectUri) {
  if (isMockClient(clientId)) {
    // Return mock success redirect URL format
    return `${redirectUri}#access_token=mock_google_fit_token&token_type=Bearer&expires_in=3600`;
  }

  const scopeStr = encodeURIComponent(GOOGLE_FIT_SCOPES.join(' '));
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scopeStr}`;
}

/**
 * Fetches health data from Google Fit REST API for the current day
 */
export async function fetchGoogleFitData(accessToken, permissions) {
  // If it's a simulated token, return realistic random mock data based on allowed permissions
  if (!accessToken || accessToken === 'mock_google_fit_token' || accessToken.startsWith('mock_')) {
    return {
      steps: permissions.steps ? Math.floor(7500 + Math.random() * 3000) : null,
      distance: permissions.distance ? parseFloat((5.2 + Math.random() * 2).toFixed(2)) : null,
      activeMinutes: permissions.activeMinutes ? Math.floor(30 + Math.random() * 25) : null,
      calories: permissions.calories ? Math.floor(250 + Math.random() * 150) : null,
      heartRate: permissions.heartRate ? Math.floor(68 + Math.random() * 15) : null,
      sleep: permissions.sleep ? parseFloat((6.8 + Math.random() * 2).toFixed(1)) : null,
      bloodOxygen: permissions.bloodOxygen ? Math.floor(96 + Math.random() * 4) : null,
      workout: permissions.workout ? (Math.random() > 0.5 ? 'Evening Jog' : 'Cardio Workout') : null,
    };
  }

  // Real aggregate date boundaries (today from 00:00 to 23:59)
  const startTimeMillis = new Date().setHours(0, 0, 0, 0);
  const endTimeMillis = new Date().setHours(23, 59, 59, 999);

  const results = {
    steps: null,
    distance: null,
    activeMinutes: null,
    calories: null,
    heartRate: null,
    sleep: null,
    bloodOxygen: null,
    workout: null,
  };

  const fetchMetric = async (dataType) => {
    try {
      const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [{ dataTypeName: dataType }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis,
          endTimeMillis,
        }),
      });

      if (!response.ok) {
        console.warn(`Google Fit REST API returned status ${response.status} for ${dataType}`);
        return null;
      }
      return await response.json();
    } catch (e) {
      console.warn(`Failed to fetch ${dataType} from Google Fit:`, e);
      return null;
    }
  };

  // 1. Steps
  if (permissions.steps) {
    const data = await fetchMetric('com.google.step_count.delta');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.intVal !== undefined) {
      results.steps = point.value[0].intVal;
    }
  }

  // 2. Distance
  if (permissions.distance) {
    const data = await fetchMetric('com.google.distance.delta');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.fpVal !== undefined) {
      // Meters to km
      results.distance = parseFloat((point.value[0].fpVal / 1000).toFixed(2));
    }
  }

  // 3. Calories
  if (permissions.calories) {
    const data = await fetchMetric('com.google.calories.spent');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.fpVal !== undefined) {
      results.calories = Math.round(point.value[0].fpVal);
    }
  }

  // 4. Heart Rate
  if (permissions.heartRate) {
    const data = await fetchMetric('com.google.heart_rate.summary');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    // fpVal is average heart rate in summary
    if (point?.value?.[0]?.fpVal !== undefined) {
      results.heartRate = Math.round(point.value[0].fpVal);
    }
  }

  // 5. Active Minutes
  if (permissions.activeMinutes) {
    const data = await fetchMetric('com.google.active_minutes');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.intVal !== undefined) {
      results.activeMinutes = point.value[0].intVal;
    }
  }

  // 6. Sleep Segment
  if (permissions.sleep) {
    const data = await fetchMetric('com.google.sleep.segment');
    const points = data?.bucket?.[0]?.dataset?.[0]?.point || [];
    let totalSleepMillis = 0;
    points.forEach((p) => {
      const start = parseInt(p.startTimeNanos || 0) / 1000000;
      const end = parseInt(p.endTimeNanos || 0) / 1000000;
      if (end > start) {
        totalSleepMillis += (end - start);
      }
    });
    if (totalSleepMillis > 0) {
      results.sleep = parseFloat((totalSleepMillis / 3600000).toFixed(1));
    }
  }

  // 7. Blood Oxygen Saturation
  if (permissions.bloodOxygen) {
    const data = await fetchMetric('com.google.oxygen_saturation');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.fpVal !== undefined) {
      results.bloodOxygen = Math.round(point.value[0].fpVal);
    }
  }

  // 8. Workout/Activity Segment
  if (permissions.workout) {
    const data = await fetchMetric('com.google.activity.segment');
    const point = data?.bucket?.[0]?.dataset?.[0]?.point?.[0];
    if (point?.value?.[0]?.intVal !== undefined) {
      const actCode = point.value[0].intVal;
      const actMap = {
        7: 'Walking',
        8: 'Running',
        100: 'Cycling',
        108: 'Swimming',
      };
      results.workout = actMap[actCode] || 'Active Workout';
    }
  }

  return results;
}
