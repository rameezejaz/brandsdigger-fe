export const getBusinessName = async (message: string): Promise<{ message: string }> => {
    const API_URL = import.meta.env.VITE_API_URL;
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
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching business name:', error);
      throw error;
    }
  };
  