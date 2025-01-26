// describe('Create and Join Room Test', () => {
//     it('should create a room and join as a new user', () => {
//       // Visit the landing page
//       cy.visit('/'); // Adjust the URL if needed
  
//       // Create a room as the moderator
//       cy.get('input[placeholder="Enter your name"]')
//         .first()
//         .type('Moderator');
      
//       cy.contains('Create New Room').click();
  
//       // Assert that the room creation was successful
//       cy.url().should('include', '/room/'); // Check if it navigates to room page
//       cy.get('button').contains('Room:').should('exist'); // Ensure room code is displayed
  
//       // Get the room ID from the URL
//       cy.url().then(url => {
//         const roomId = url.split('/room/')[1]; // Extract roomId from the URL
  
//         // Store room info in sessionStorage
//         cy.window().then(win => {
//           win.sessionStorage.setItem('roomInfo', JSON.stringify({ roomId }));
//         });
  
//         // Open a new tab and visit the landing page to join the room
//         cy.window().then((win) => {
//           const newTab = win.open('', '_blank');
//           newTab.location.href = '/';
//         });
  
//         cy.window().should('have.property', 'location'); // Ensure a new tab was opened
  
//         // Join the room as a different user
//         cy.get('input[placeholder="Enter your name"]')
//           .last()
//           .type('Player 1');
  
//         cy.get('input[placeholder="Enter room code"]')
//           .type(roomId);
  
//         cy.contains('Join Room').click();
  
//         // Assert that the player has successfully joined the room
//         cy.url().should('include', `/room/${roomId}`); // Ensure correct room page is loaded
//       });
//     });
//   });
  