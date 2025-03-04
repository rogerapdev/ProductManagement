import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import useProductStore from '../store/productStore';
import config from '../config';

const ProductCard = ({ product, onEdit }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteProduct } = useProductStore();

    const handleDelete = async () => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setIsDeleting(true);
            try {
                await deleteProduct(product.id);
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Função para formatar preço em Reais
    const formatPrice = (price) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    // Função para formatar data
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };

    // Construindo o URL da imagem corretamente
    const getImageUrl = () => {
        const baseImageUrl = `${config.API_URL}`; // URL do backend

        if (!product.imagePath) {
            return `${baseImageUrl}/uploads/default-product.jpg`;
        }

        // Verificar se o caminho já é um URL completo
        if (product.imagePath.startsWith('http')) {
            return product.imagePath;
        }

        // Verificar se o caminho já inclui "uploads/"
        if (product.imagePath.startsWith('/uploads/')) {
            return `${baseImageUrl}${product.imagePath}`;
        }

        // Adicionar o diretório de uploads se o caminho é apenas o nome do arquivo
        return `${baseImageUrl}/uploads/${product.imagePath}`;
    };

    const imageUrl = getImageUrl();

    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 w-full bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'http://localhost:5001/uploads/default-product.jpg';
                        console.log('Erro ao carregar imagem:', imageUrl);
                    }}
                />
            </div>

            <CardContent className="p-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="mt-1 text-gray-600 line-clamp-2">{product.description}</p>

                <div className="mt-3 flex flex-col space-y-2">
                    <div className="text-xl font-bold text-blue-600">
                        {formatPrice(product.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                        Criado em {formatDate(product.createdAt)}
                    </div>
                </div>

                <div className="mt-4 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={onEdit}
                    >
                        Editar
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;