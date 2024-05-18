
declare var Promise: {
    new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    resolve(value?: any): Promise<any>;
    reject(reason?: any): Promise<any>;
    
};

interface UserRequest {
    id: number;
}

interface UserResponse {
    id: number;
    name: string;
    userName:string;
    email: string;
}
class UserFetcher {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async fetchUserById(userId: number): Promise<UserResponse> {
        const url = `${this.apiUrl}/users/${userId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userData = await response.json();
            return {
                id: userData.id,
                name: userData.name,
                userName: userData.username,
                email: userData.email,
                
            };
        } catch (error) {
            throw new Error(`Error fetching user: ${error}`);
        }
    }
}

// Dependency injection example
const userFetcher = new UserFetcher("https://jsonplaceholder.typicode.com");

function updateUserContainer(user: UserResponse) {
    const userDataContainer = document.getElementById("userDataContainer");
    if (userDataContainer) {
        userDataContainer.innerHTML = `
            <h2>User Details:</h2>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Username:</strong> ${user.userName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    }
}

const plusButton = document.getElementById("plusButton");
const minusButton = document.getElementById("minusButton");

let userId = 1; 

if (plusButton) {
    plusButton.addEventListener("click", () => {
        userId++; 
        fetchAndUpdateUser(userId);
    });
}


if (minusButton) {
    minusButton.addEventListener("click", () => {
        if (userId > 1) {
            userId--; 
            fetchAndUpdateUser(userId);
        }
    });
}

function fetchAndUpdateUser(userId: number) {
    userFetcher.fetchUserById(userId)
        .then((user: UserResponse) => {
            console.log("User:", user);
            updateUserContainer(user); 
        })
        .catch((error: Error) => {
            console.error("Error fetching user:", error.message);
        });
}

fetchAndUpdateUser(userId);