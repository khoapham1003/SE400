import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Personal_IP } from "@/constants/ip";
import axios from 'axios';
import { ProductType } from '@/types/type'

type Props = {}

const ProductDetails = (props: Props) => {
    const {id} = useLocalSearchParams();
    const [product, setProduct] = useState<ProductType>({});

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getProductDetails();
    }, []);

    const getProductDetails = async () => {
            try {
                const URL = `http://${Personal_IP.data}:3000/product/get-product/${id}`;
                const response = await axios.get(URL);
                setProduct(response.data.data);  // save response data in state
                setError(null);
            } catch (err) {
                setError('Failed to load product details.');
                console.error(err);
            }
        }


    return (
        <View >
            <Text>{product.title}</Text>
        </View>
    )
}

export default ProductDetails

const styles = StyleSheet.create({})