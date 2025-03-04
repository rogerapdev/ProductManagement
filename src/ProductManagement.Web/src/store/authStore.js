import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            token: null,
            user: {
                userName: null,
                email: null
            },
            isAuthenticated: false,

            login: async (email, password) => {
                try {
                    console.log('Tentando fazer login com:', { email });
                    const response = await api.post('/auth/login', { email, password });

                    // Log da resposta para debug
                    console.log('Resposta do login:', {
                        success: response.data.success,
                        message: response.data.message,
                        tokenExists: !!response.data.token,
                        userExists: !!response.data.user
                    });

                    if (response.data.success && response.data.token) {
                        set({
                            token: response.data.token,
                            user: {
                                userName: response.data.userName,
                                email: response.data.email
                            },
                            isAuthenticated: true
                        });

                        // Verificar se o token foi realmente armazenado
                        setTimeout(() => {
                            const storeAfterLogin = get();
                            console.log('Estado do store após login:', {
                                tokenExiste: !!storeAfterLogin.token,
                                isAuthenticated: storeAfterLogin.isAuthenticated,
                                userExiste: !!storeAfterLogin.user.userName
                            });
                        }, 100);

                        return { success: true };
                    } else {
                        console.error('Login falhou:', response.data.message);
                        return {
                            success: false,
                            message: response.data.message || 'Login falhou'
                        };
                    }
                } catch (error) {
                    console.error('Erro de login:', error.response || error);
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Login falhou'
                    };
                }
            },

            register: async (userName, email, password) => {
                try {
                    console.log('Tentando registrar usuário:', { userName, email });
                    const response = await api.post('/auth/register', {
                        userName,
                        email,
                        password
                    });
                    console.log('Resposta do registro:', response.data);
                    return { success: true };
                } catch (error) {
                    console.error('Erro no registro:', error);
                    console.error('Resposta do erro:', error.response?.data);

                    const errorDetails = error.response?.data?.errorDetails;
                    const errorMessage = error.response?.data?.message || 'Falha ao registrar usuário, tente novamente';

                    return {
                        success: false,
                        message: errorMessage,
                        errorDetails: errorDetails || []
                    };
                }
            },

            logout: () => {
                console.log('Fazendo logout...');
                set({ token: null, user: { userName: null, email: null }, isAuthenticated: false });
                console.log('Logout concluído, estado resetado');
            },

            checkAuth: () => {
                const state = get();
                console.log('Verificando autenticação:', {
                    tokenExiste: !!state.token,
                    isAuthenticated: state.isAuthenticated,
                    userExiste: !!state.user
                });

                if (state.token) {
                    try {
                        // Verificar se o token está expirado
                        const payloadBase64 = state.token.split('.')[1];
                        const payload = JSON.parse(atob(payloadBase64));

                        if (payload.exp) {
                            const expirationDate = new Date(payload.exp * 1000);
                            const now = new Date();

                            if (expirationDate < now) {
                                console.warn('Token expirado, fazendo logout');
                                get().logout();
                                return false;
                            }
                        }
                        return true;
                    } catch (error) {
                        console.error('Erro ao verificar token:', error);
                        return false;
                    }
                }
                return false;
            }
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useAuthStore;