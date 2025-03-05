// src/services/api.ts
export const getBusinessName = async (message: string): Promise<{ message: string }> => {
    const API_URL = 'https://eae2-182-190-32-95.ngrok-free.app/generate/names'; // Ensure correct URL
    // const API_URL = '#'; // Ensure correct URL
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: '1',
          message: message,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Ensure that response.json() is called only once
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching business name:', error);
      throw error;
    }
  };
  