"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var Colors_1 = require("../constants/Colors");
var vector_icons_1 = require("@expo/vector-icons");
var ProductItem_1 = require("./ProductItem");
var FlashSale = function (_a) {
    var products = _a.products;
    var saleEndDate = new Date();
    saleEndDate.setFullYear(2025, 4, 21); // thang bat dau tu 0 - 11
    //saleEndDate.setDate(saleEndDate.getDate() + 2);
    saleEndDate.setHours(23, 59, 59);
    var _b = (0, react_1.useState)({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }), timeUnits = _b[0], setTimeUnits = _b[1];
    (0, react_1.useEffect)(function () {
        var calculateTimeUnits = function (timeDifference) {
            var seconds = Math.floor(timeDifference / 1000);
            setTimeUnits({
                days: Math.floor((seconds % (365 * 24 * 60 * 60)) / (24 * 60 * 60)),
                hours: Math.floor((seconds % (24 * 60 * 60)) / (60 * 60)),
                minutes: Math.floor((seconds % (60 * 60)) / 60),
                seconds: seconds % 60,
            });
        };
        var updateCountdown = function () {
            var currentDate = new Date().getTime();
            var expiryTime = saleEndDate.getTime();
            var timeDifference = expiryTime - currentDate;
            if (timeDifference <= 0) {
                calculateTimeUnits(0);
            }
            else {
                calculateTimeUnits(timeDifference);
            }
        };
        updateCountdown();
        var interval = setInterval(updateCountdown, 1000);
        return function () { return clearInterval(interval); };
    }, []);
    var formatTime = function (time) {
        return time.toString().padStart(2, "0");
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.titleWrapper}>
      <react_native_1.View style={styles.timerWrapper}>
          <react_native_1.Text style={styles.title}>Flash Sale</react_native_1.Text>
          <react_native_1.View style={styles.timer}>
            <vector_icons_1.Ionicons name='time-outline' size={16} color={Colors_1.Colors.black}/>
            <react_native_1.Text style={styles.timerTxt}>{"".concat(formatTime(timeUnits.days), ":").concat(formatTime(timeUnits.hours), ":").concat(formatTime(timeUnits.minutes), ":").concat(formatTime(timeUnits.seconds))}</react_native_1.Text>
          </react_native_1.View>

          </react_native_1.View>
              <react_native_1.TouchableOpacity>
                <react_native_1.Text style={styles.titleBtn}>See All</react_native_1.Text>
              </react_native_1.TouchableOpacity>
          </react_native_1.View>
          <react_native_1.FlatList data={products} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginLeft: 20, paddingRight: 20 }} keyExtractor={function (item) { return item.id.toString(); }} renderItem={function (_a) {
            var item = _a.item, index = _a.index;
            return (<react_native_1.View style={{ marginRight: 20 }}>
                    <ProductItem_1.default index={index} item={item}/>
                    </react_native_1.View>);
        }}></react_native_1.FlatList>
    </react_native_1.View>);
};
exports.default = FlashSale;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginBottom: 20
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.6,
        color: Colors_1.Colors.black,
    },
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 20
    },
    titleBtn: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors_1.Colors.black,
        letterSpacing: 0.6,
    },
    timerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    timer: {
        flexDirection: 'row',
        gap: 5,
        backgroundColor: Colors_1.Colors.highlight,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 12
    },
    timerTxt: {
        color: Colors_1.Colors.black,
        fontWeight: '500'
    }
});
