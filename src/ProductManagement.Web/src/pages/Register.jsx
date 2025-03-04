import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import useAuthStore from '../store/authStore';

const Register = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const registerUser = useAuthStore((state) => state.register);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log('Enviando dados:', data);
        setIsLoading(true);
        setError(null);

        try {
            console.log('Calling registerUser with:', data.userName, data.email, data.password);
            const result = await registerUser(data.userName, data.email, data.password);
            console.log('Registration result:', result);

            if (result.success) {
                console.log('Conta criada com sucesso. Redirecionando para login...');
                navigate('/login', { state: { message: 'Conta criada com sucesso. Efetue o login.' } });
            } else {
                console.error('Falha ao criar conta:', result.message);
                setError(result.message);
            }
        } catch (err) {
            console.error('Erro inesperado ao criar conta:', err);
            setError('Erro inesperado ao criar conta. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Registrar</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="userName" className="text-sm font-medium">Usuário</label>
                            <Input
                                id="userName"
                                type="text"
                                placeholder="johndoe"
                                {...register('userName', { required: 'Usuário é obrigatório' })}
                            />
                            {errors.userName && (
                                <p className="text-sm text-red-500">{errors.userName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register('email', {
                                    required: 'Email é obrigatório',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Endereço de email inválido',
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Senha</label>
                            <Input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'Senha é obrigatória',
                                    minLength: {
                                        value: 6,
                                        message: 'Senha deve ter pelo menos 6 caracteres',
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar Senha</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Por favor, confirme sua senha',
                                    validate: (value) => value === watch('password') || 'Senha não confere',
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Criando conta...' : 'Registrar'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Já possui uma conta?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                            Acesse aqui
                        </Link>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default Register;