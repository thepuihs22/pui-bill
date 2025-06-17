



export async function updateOrCreateUser(profile: any) {
    try {
        const response = await fetch('/splitbill/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profile),
        });
    
        if (!response.ok) {
          console.error('Failed to sync user data with Supabase');
        }
      } catch (error) {
        console.error('Error syncing user data:', error);
      }
}