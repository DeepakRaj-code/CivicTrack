// Wait for the HTML document to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Authentication Check ---
    // First, check if a user is logged in and is an admin.
    // This assumes the user info is saved in localStorage after login.
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token || !userInfo.isAdmin) {
        // If not an admin, show an error and redirect to the login page
        alert('Access Denied. You must be an admin to view this page.');
        window.location.href = 'index.html';
        return; // Stop the script from running further
    }


    // --- Function to Fetch and Display Users ---
    const fetchUsers = async () => {
        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = '<tr><td colspan="4">Loading users...</td></tr>'; // Show loading message

        try {
            const response = await fetch('http://localhost:5000/api/data/users', {
                headers: {
                    // Include the token for authorization
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users.');
            }

            const users = await response.json();
            
            // Clear the loading message
            tableBody.innerHTML = '';

            // Loop through each user and create a table row
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.isBanned ? 'Banned' : 'Active'}</td>
                    <td>
                        <button class="btn-ban" data-userid="${user._id}" ${user.isBanned ? 'disabled' : ''}>
                            ${user.isBanned ? 'Banned' : 'Ban User'}
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="4" style="color:red;">Error: ${error.message}</td></tr>`;
        }
    };


    // --- Function to Ban a User ---
    const banUser = async (userId, buttonElement) => {
        if (!confirm('Are you sure you want to ban this user?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/data/users/${userId}/ban`, {
                method: 'PUT', // Or POST, depending on your API design
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to ban user.');
            }

            // Update the UI to reflect the change
            alert('User has been banned successfully.');
            buttonElement.textContent = 'Banned';
            buttonElement.disabled = true;
            // Find the status cell in the same row and update it
            buttonElement.closest('tr').cells[2].textContent = 'Banned';

        } catch (error) {
            alert(error.message);
        }
    };


    // --- Event Listener for Ban Buttons ---
    // Use event delegation to handle clicks on buttons that are added dynamically
    document.getElementById('user-table-body').addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-ban')) {
            const userId = e.target.dataset.userid;
            banUser(userId, e.target);
        }
    });


    // --- Initial Data Load ---
    // Fetch the users when the page loads
    fetchUsers();
    
    // You would add a function here to fetch analytics data as well
    // fetchAnalytics();
});