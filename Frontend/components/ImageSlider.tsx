import { Dimensions, StyleSheet, Text, View, FlatList, Image } from 'react-native'
import React from 'react'

type Props = {
    image: string[]
}

const width = Dimensions.get('screen').width;

const ImageSlider = ({image}: Props) => {
    return (
        <View style={{width: width,
                      justifyContent: 'center',
                      alignItems: 'center'}}>
            <FlatList data={image} renderItem={({item}) => (<View>
                    <Image source={{uri: item}} style={{width: 300, height: 300, borderRadius: 10}}/>
                </View>
                )}
                horizontal
                showHorizontalScrollIndicator={false}
                pagingEnabled
            />
        </View>
    )
}

export default ImageSlider

const styles = StyleSheet.create({})