import { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux'
import { getExchangeInfo } from '../homeSlice.js';
import { images } from '../../../common/imgDict.js'
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../homecomponents/ScreenSize.js';

function GameHeader(props) { 
    const [userInfo, setUserInfo] = useState('');
    const [exchange, setExchange] = useState([]);

    const textRef1 = useRef('');
    const textRef2 = useRef('');
    const [currentText, setCurrentText] = useState(0);

    let texts = [];

    const TextTransition = (props) => {
        exchange.map(a => {
            if (a.전일대비 > 0) {
                texts.push({
                    money: a.통화코드,
                    points: '▲' + a.전일대비
                })
            } else if (a.전일대비 < 0) {
                texts.push({
                    money: a.통화코드,
                    points: '▼' + a.전일대비
                })
            } else {
                texts.push({
                    money: a.통화코드,
                    points: '▬'
                })
            }
        })

        useEffect(() => {
            const timeout = setTimeout(() => {
                setCurrentText((prevText) => (prevText === texts.length - 1 ? 0 : prevText + 1));
                textRef1.current.fadeIn(1000).then(() => {
                    textRef1.current.fadeOut(1000);
                });
                textRef2.current.fadeIn(1000).then(() => {
                    textRef2.current.fadeOut(1000);
                });
            }, 2000); // 3초마다 텍스트 변경

            return () => clearTimeout(timeout);
        }, [currentText]);

        return (
            <View style={styles.rightBottomBox}>
                <Animatable.View ref={textRef1}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{ texts[currentText].money }:</Text>
                </Animatable.View>
                <Animatable.View ref={textRef2}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: texts[currentText].points[0] == '▲' ? 'red' : texts[currentText].points[0] == '=' ? 'white' : 'blue' }}> { texts[currentText].points }</Text>
                </Animatable.View>
            </View>
        )
    }

    const gameUser = useSelector(state => state.home.userGameInfo);

    const dispatch = useDispatch();
    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        try {
            await dispatch(getExchangeInfo()).then((res) => {
                let data = res.payload;
                let copy = [...data];

                setExchange(copy);
                setUserInfo({name: gameUser.userId, point: gameUser.point})

            })
        } catch(e) {
            console.log(e);
        }
    };
    
    return (
        <>
            {exchange.length > 0 && (
                <View style={styles.header}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <View style={styles.headerItem}>
                            {/* <View style={{ flex: 1, alignItems: 'center' }}>
                                <Image source={images.defaultCharacter.TIGER.MINT} style={styles.profile}></Image>
                            </View> */}
                            <Text style={styles.name}>{userInfo.name}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                width: '85%',
                                height: '40%',
                                backgroundColor: '#D9D9D9',
                                borderRadius: 15,
                            }}></View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                            <View style={styles.headerRight}>
                                <View style={styles.rightTopBox}>
                                    <Image source={images.gameIcon.coin} style={{ resizeMode: 'contain', height: '85%', width: '20%' }} />
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', height: '85%', marginEnd: '10%' }}> {userInfo.point}$</Text>
                                </View>
                            </View>
                            <View style={styles.headerRight}>
                                <TextTransition exchange={exchange} currentText={currentText} textRef1={textRef1} textRef2={textRef2}/>
                            </View>
                    </View>
                </View>
            )}
        </>
    );
};

export default GameHeader;

const styles = StyleSheet.create({
    header: {
        flex: 1,
        width: SCREEN_WIDTH,
        flexDirection: 'row',
        backgroundColor: 'rgba(41, 54, 148, 0.8)',
    },
    headerItem: { 
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // profile: { 
    //     width: '65%',
    //     height: '85%',
    //     backgroundColor: '#0F6828',
    //     borderRadius: 20,
    //     borderColor: '#5C4800',
    //     borderWidth: 2,
    //     resizeMode: 'contain',
    //     marginTop: '10%',
    // },
    name: {
        flex: 1.5,
        fontWeight: 'bold',
        fontSize: 25,
        color: 'white',
        textShadowColor: '#272B49',
        textShadowRadius: 2,
        textShadowOffset: { width: 2, height: 2 },
        elevation: 1,
        marginTop: '5%',
        marginStart: '10%',
    },
    headerRight: { 
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    rightTopBox: { 
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#758DCC',   
        height: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '10%',
        marginTop: '3%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#505A75'
    },
    rightBottomBox: { 
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#758DCC',   
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '10%',
        marginBottom: '3%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#505A75'
    },
});