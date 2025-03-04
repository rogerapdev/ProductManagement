import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const navigate = useNavigate();

    // Acessando propriedades do auth store individualmente para evitar re-renders desnecessários
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const logout = useAuthStore(state => state.logout);
    const token = useAuthStore(state => state.token);
    const user = useAuthStore(state => state.user);

    // Acessando propriedades do product store
    const fetchProducts = useProductStore(state => state.fetchProducts);
    const getSortedProducts = useProductStore(state => state.getSortedProducts);
    const isLoading = useProductStore(state => state.isLoading);
    const error = useProductStore(state => state.error);
    const sortBy = useProductStore(state => state.sortBy);
    const sortOrder = useProductStore(state => state.sortOrder);
    const setSortBy = useProductStore(state => state.setSortBy);
    const setSortOrder = useProductStore(state => state.setSortOrder);

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productsLoaded, setProductsLoaded] = useState(false);

    // Extrair e decodificar o payload do token para debug
    let tokenPayload = null;
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            tokenPayload = JSON.parse(atob(payloadBase64));
        } catch (e) {
            console.error('Erro ao decodificar token:', e);
        }
    }

    useEffect(() => {
        // Verificar autenticação uma única vez na montagem do componente
        if (!isAuthenticated || !token) {
            console.warn('Não autenticado no Dashboard, redirecionando para login');
            navigate('/login');
            return;
        }

        // Buscar produtos apenas uma vez na montagem
        if (!productsLoaded) {
            console.log(productsLoaded);
            console.log('Buscando produtos...');
            fetchProducts();
            setProductsLoaded(true);
        }
    }, [isAuthenticated, token, navigate]);

    const handleAddNew = () => {
        setEditingProduct(null);
        setShowProductForm(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleFormClose = () => {
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Obter produtos ordenados
    const products = getSortedProducts ? getSortedProducts() : [];

    // Determinar o nome de usuário para exibição
    const displayName = user ? (user.userName || user.email || 'Usuário') : 'Usuário';

    return (
        <div className="container mx-auto py-8 px-4" style={{ minWidth: '800px' }} >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Olá, {displayName}</span>
                    <div className="flex space-x-2">
                        <Button onClick={handleAddNew}>Novo Produto</Button>
                        <Button variant="outline" onClick={handleLogout}>Sair</Button>
                    </div>
                </div>
            </div>


            <div className="mb-6 flex items-center space-x-4">
                <div>
                    <label htmlFor="sortBy" className="mr-2 text-sm font-medium">Ordenar:</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="rounded-md border border-gray-300 p-2"
                    >
                        <option value="createdAt">Data</option>
                        <option value="price">Preço</option>
                    </select>
                </div>
                <Button variant="ghost" onClick={handleOrderChange}>
                    {sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Carregando os produtos...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
            ) : products.length === 0 ? (
                <div className="text-center py-8">
                    <p className="mb-4">Voce ainda nao possui nenhum produto.</p>
                    <Button onClick={handleAddNew}>Adicione seu primeiro produto</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={() => handleEdit(product)}
                        />
                    ))}
                </div>
            )}

            {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-lg">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">
                                    {editingProduct ? 'Alterar Produto' : 'Novo Produto'}
                                </h2>
                                <Button variant="ghost" onClick={handleFormClose}>
                                    ✕
                                </Button>
                            </div>
                            <ProductForm
                                product={editingProduct}
                                onSuccess={handleFormClose}
                                onCancel={handleFormClose}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Dashboard;