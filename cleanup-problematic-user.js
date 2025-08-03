// Script to cleanup problematic user data
// Run this script to clean up the user with ID: 868ebb54-6416-45bb-ab3c-5647ac783a97

const PROBLEMATIC_USER_ID = '868ebb54-6416-45bb-ab3c-5647ac783a97';
const API_URL = 'http://localhost:3000/api/admin/cleanup-user';

async function cleanupUser() {
  try {
    console.log(`Cleaning up user: ${PROBLEMATIC_USER_ID}`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: PROBLEMATIC_USER_ID
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ User cleanup successful:', result);
      console.log('The user can now sign up again with a fresh account.');
    } else {
      console.error('❌ User cleanup failed:', result);
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
cleanupUser();