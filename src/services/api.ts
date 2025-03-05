export const getBusinessName = async (message: string): Promise<{ message: string }> => {
    const API_URL = 'https://eae2-182-190-32-95.ngrok-free.app/generate/names'; 
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
  