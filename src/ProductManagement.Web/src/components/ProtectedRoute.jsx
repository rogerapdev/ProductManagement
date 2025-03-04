import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    useEffect(() => {
        console.log('========== ProtectedRoute Debug Info ==========');
        console.log(`Rota atual: ${location.pathname}`);
        console.log(`isAuthenticated: ${isAuthenticated}`);
        console.log(`Token existe: ${!!token}`);
        console.log(`Usuário existe: ${!!user}`);

        if (token) {
            // Analisar quando o token expira (se ele tiver exp claim)
            try {
                // Pegar só a parte payload do JWT (segunda parte)
                const payloadBase64 = token.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64));
                console.log('Payload do token:', payload);

                if (payload.exp) {
                    const expirationDate = new Date(payload.exp * 1000);
                    const now = new Date();
                    console.log(`Data de expiração do token: ${expirationDate}`);
                    console.log(`Token expirado: ${expirationDate < now}`);
                }
            } catch (error) {
                console.error('Erro ao decodificar token:', error);
            }
        }
        console.log('=============================================');
    }, [isAuthenticated, token, user, location.pathname]);

    if (!isAuthenticated || !token) {
        console.warn(`Redirecionando para login a partir de ${location.pathname} (não autenticado)`);
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute;