import api from "./api";

function InterceptorDemo() {

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users");

            // const response = await api.get("/users/invalid-endpoint"); 
            // -> to check error

            console.log("API Response:", response.data);
        } catch (error) {
            console.log("API Error:", error);
        }
    };

    return (
        <div>
            <h2>Axios Interceptor Demo</h2>

            <button onClick={fetchUsers}>
                Fetch Users
            </button>
        </div>
    );
}

export default InterceptorDemo;