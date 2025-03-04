import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set, get) => ({
    products: [],
    isLoading: false,
    error: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isLoadingProducts: false,

    // Buscar todos os produtos
    fetchProducts: async () => {

        const state = get();
    
        // Se já estiver carregando, retorna para evitar chamada dupla
        if (state.isLoadingProducts) {
          return;
        }
        set({ isLoading: true, isLoadingProducts: true, error: null });

        try {
            const response = await api.get('/products');
            console.log('Produtos carregados:', response.data);
            set({ products: response.data, isLoading: false, isLoadingProducts: false });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            set({
                error: error.response?.data?.message || 'Falha ao carregar produtos',
                isLoading: false,
                isLoadingProducts: false
            });
        }
    },

    // Criar novo produto (com suporte para upload de arquivo)
    createProduct: async (formData) => {
        set({ isLoading: true, error: null });

        try {
            console.log('Enviando dados para criar produto');
            // Registrar os dados que estão sendo enviados (para debug)
            for (let [key, value] of formData.entries()) {
                if (key !== 'image') {
                    console.log(`${key}: ${value}`);
                } else {
                    console.log(`${key}: Arquivo presente`);
                }
            }

            // Usar cabeçalhos específicos para FormData
            const response = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Produto criado com sucesso:', response.data);

            // Adicionar o novo produto à lista
            set(state => ({
                products: [response.data, ...state.products],
                isLoading: false
            }));

            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            console.error('Detalhes do erro:', error.response?.data);
            set({
                error: error.response?.data?.message || 'Failed to create product',
                isLoading: false
            });
            throw error;
        }
    },

    // Atualizar produto existente (com suporte para upload de arquivo)
    updateProduct: async (id, formData) => {
        set({ isLoading: true, error: null });

        try {
            console.log(`Atualizando produto ${id}`);
            // Registrar os dados que estão sendo enviados (para debug)
            for (let [key, value] of formData.entries()) {
                if (key !== 'image') {
                    console.log(`${key}: ${value}`);
                } else {
                    console.log(`${key}: Arquivo presente`);
                }
            }

            const response = await api.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Produto atualizado com sucesso:', response.data);

            // Atualizar o produto na lista
            set(state => ({
                products: state.products.map(p =>
                    p.id === id ? response.data : p
                ),
                isLoading: false
            }));

            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Detalhes do erro:', error.response?.data);
            set({
                error: error.response?.data?.message || 'Failed to update product',
                isLoading: false
            });
            throw error;
        }
    },

    // Excluir produto
    deleteProduct: async (id) => {
        set({ isLoading: true, error: null });

        try {
            await api.delete(`/products/${id}`);
            console.log(`Produto ${id} excluído com sucesso`);

            // Remover o produto da lista
            set(state => ({
                products: state.products.filter(p => p.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('Error deleting product:', error);
            set({
                error: error.response?.data?.message || 'Failed to delete product',
                isLoading: false
            });
            throw error;
        }
    },

    // Configurações de ordenação
    setSortBy: (sortBy) => set({ sortBy }),
    setSortOrder: (sortOrder) => set({ sortOrder }),

    // Função para obter produtos ordenados
    getSortedProducts: () => {
        const { products, sortBy, sortOrder } = get();

        return [...products].sort((a, b) => {
            // Comparação para diferentes tipos de campos
            if (sortBy === 'price') {
                return sortOrder === 'asc'
                    ? a.price - b.price
                    : b.price - a.price;
            }

            // Comparação para campos de data
            if (sortBy === 'createdAt') {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Comparação alfabética para outros campos
            if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }
}));

export default useProductStore;