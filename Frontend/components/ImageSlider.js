"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var width = react_native_1.Dimensions.get('screen').width;
var ImageSlider = function (_a) {
    var image = _a.image;
    return (<react_native_1.View style={{ width: width,
            justifyContent: 'center',
            alignItems: 'center' }}>
            <react_native_1.FlatList data={image} renderItem={function (_a) {
            var item = _a.item;
            return (<react_native_1.View>
                    <react_native_1.Image source={{ uri: item }} style={{ width: 300, height: 300, borderRadius: 10 }}/>
                </react_native_1.View>);
        }} horizontal showHorizontalScrollIndicator={false} pagingEnabled/>
        </react_native_1.View>);
};
exports.default = ImageSlider;
var styles = react_native_1.StyleSheet.create({});
