import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import useProductStore from '../store/productStore';
import config from '../config';

const ProductForm = ({ product, onSuccess, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: product || {
            name: '',
            description: '',
            price: ''
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const { createProduct, updateProduct } = useProductStore();

    // Carregar a imagem existente ao editar um produto
    useEffect(() => {
        if (product?.imagePath) {
            // Construir URL da imagem no backend
            const baseImageUrl = `${config.API_URL}`;
            let imageUrl;

            if (product.imagePath.startsWith('http')) {
                imageUrl = product.imagePath;
            } else if (product.imagePath.startsWith('/uploads/')) {
                imageUrl = `${baseImageUrl}${product.imagePath}`;
            } else {
                imageUrl = `${baseImageUrl}/uploads/${product.imagePath}`;
            }

            setImagePreview(imageUrl);
        }
    }, [product]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Criar um FormData para enviar dados multipart (incluindo arquivos)
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price);

            // Adicionar a imagem ao FormData se existir
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]);
            } else if (product?.imagePath) {
                // Se estamos editando e não foi selecionada nova imagem, manter a existente
                formData.append('imagePath', product.imagePath);
            }

            if (product) {
                // Atualizar produto existente
                await updateProduct(product.id, formData);
            } else {
                // Criar novo produto
                await createProduct(formData);
            }

            onSuccess();
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Função para lidar com a visualização prévia da imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome do Produto
                </label>
                <Input
                    id="name"
                    {...register('name', { required: 'Nome é obrigatório' })}
                    className="mt-1"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                </label>
                <textarea
                    id="description"
                    {...register('description', { required: 'Descrição é obrigatória' })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço (R$)
                </label>
                <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register('price', {
                        required: 'Preço é obrigatório',
                        min: { value: 0.01, message: 'Preço deve ser maior que zero' }
                    })}
                    className="mt-1"
                />
                {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Imagem do Produto
                </label>
                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register('image')}
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />

                {/* Visualização prévia da imagem */}
                {imagePreview && (
                    <div className="mt-2">
                        <img
                            src={imagePreview}
                            alt="Prévia"
                            className="h-32 w-auto object-contain rounded border"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'http://localhost:5001/uploads/default-product.jpg';
                                console.log('Erro ao carregar prévia:', imagePreview);
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Salvando...' : product ? 'Atualizar' : 'Criar'}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;