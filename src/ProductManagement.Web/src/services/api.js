import axios from 'axios';
import useAuthStore from '../store/authStore';
import config from '../config';

// Crie uma instância do axios com a URL base
const api = axios.create({
    baseURL: `${config.API_URL}/api`,
    timeout: 10000,
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
    (config) => {
        try {
            // Usamos o getState() do Zustand para obter o token
            const token = useAuthStore.getState().token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log(`Token adicionado à requisição ${config.url}`);
            }
        } catch (error) {
            console.error('Erro ao adicionar token:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Erro de autenticação 401:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;