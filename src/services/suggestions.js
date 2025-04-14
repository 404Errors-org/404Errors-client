export const sendSuggestion = async (locationId, suggestionText, token) => {
    const response = await fetch(`https://404errors-server-production.up.railway.app/suggestions?locationId=${locationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: suggestionText }),
    });
  
    if (!response.ok) {
      throw new Error("Помилка при відправленні пропозиції");
    }
  
    return await response.json();
  };
  