import React, {useEffect, useRef, useState} from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    Image,
    Dimensions,
    TouchableOpacity,
    Text,
    ScrollView,
    Modal, Animated
} from "react-native";
import {AlertBox, NavigationBar} from "../components";
import CardService from "../services/CardService";

const {width} = Dimensions.get('window');

const CardViewScreen = ({navigation}) => {
    const [visible, setVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [Cards, setCards] = useState([]);
    const [Card, setCard] = useState([])


    useEffect(() => {
        fetchCards().then();
    }, [])

    const fetchCards = async () => {
        await CardService.getCards()
            .then(card => {
                setCards(card);
            }).catch(err => {
                console.error(err)
            })
    }

    const btnClick = () => {
        console.log('Proceed button clicked');
    };

    const CardHolder = ({card, onTouchStart}) => {
        return (
            <ImageBackground
                source={require('../assets/images/VisaCard.png')}
                onTouchStart={() => onTouchStart(card)}
                style={styles.cards}>
                <Text style={styles.textType}>Credit</Text>
                <Text style={styles.textName}>{card.name}</Text>
                <Text style={styles.text}>{card.cardNumber}</Text>
            </ImageBackground>
        );
    };

    const onPressCard = (card) => {
        setCard(card);
        setVisible(true);
    };

    const onPressDeleteCard = (id) => {
        if (id === '') {
            alert('Something went wrong!! Try again.');
        } else {
            CardService.removeCard(id)
                .then(res => {
                    if(res.status === 200){
                        setTimeout(() => setIsVisible(true), 2000);
                    }else{
                        alert('Something went wrong!! Try again.');
                    }
                })
        }
    };

    const backToMain = () => {
        navigation.navigate('BillCategory')
    }

    const CardPopup = ({visible, children}) => {
        const [showCard, setShowCard] = useState(visible);
        const scaleValue = useRef(new Animated.Value(0)).current;
        useEffect(() => {
            toggleModel();
        }, [visible]);
        const toggleModel = () => {
            if (visible) {
                setShowCard(true);
                Animated.spring(scaleValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            } else {
                setTimeout(() => setShowCard(false), 200)
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                }).start();
            }
        };
        return (
            <Modal transparent visible={showCard}>
                <View style={styles.modalBackground}>
                    <Animated.View style={[styles.modelContainer, {transform: [{scale: scaleValue}]}]}>
                        {children}
                    </Animated.View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                <View style={styles.inputContainer}>

                    <CardPopup visible={visible}>
                        <View style={{alignItems: 'center'}}>
                            <ImageBackground source={require('../assets/images/VisaCard.png')}
                                             style={{width: 285, height: 150, marginVertical: 10}}>
                                <Text style={styles.textCardPopup}>Credit</Text>
                                <Text style={styles.textCardPopup2}>{Card.name}</Text>
                                <Text style={styles.textCardPopup2}>{Card.cardNumber}</Text>
                            </ImageBackground>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{alignItems: 'center', width: '50%',}}>
                                <TouchableOpacity onPress={() => setVisible(false)}>
                                    <Image source={require('../assets/images/Right_Button.png')}
                                           style={{width: 70, height: 70, marginVertical: 10}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'center', width: '50%'}}>
                                <TouchableOpacity onPress={() => onPressDeleteCard(Card._id)}>
                                    <Image source={require('../assets/images/Delete_Button.png')}
                                           style={{width: 70, height: 70, marginVertical: 10}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </CardPopup>

                    {
                        Cards.length > 0 ?
                            Cards.map(card => {
                                return <CardHolder key={card._id} card={card} onTouchStart={onPressCard}/>
                            })
                            : <Text> No Card Found</Text>
                    }

                    <AlertBox
                        image={require('../assets/images/Checked.png')}
                        text={"Card Successfully Removed."}
                        buttonText="Back to View Card" buttonColor="#13C39C" isVisible={isVisible}
                        onPress={backToMain}/>

                </View>

            </ScrollView>
            <View style={styles.addButtonContainer}>
                <TouchableOpacity style={styles.iconContainer}
                                  onPress={() => navigation.navigate('EnterCardDetails')}>
                    <Image source={require('../assets/images/Add_Button.png')}
                           style={{width: 50, height: 50,}} onPress={btnClick}/>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <NavigationBar navigation={navigation}/>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    scrollContainer: {
        flex: 1,
        padding: 10,
    },
    inputContainer: {
        height: 'auto',
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    addButtonContainer: {
        paddingTop: 10,
        marginLeft: width / 1.2,
        justifyContent: 'flex-end',
    },
    bottomContainer: {
        paddingTop: 20,
        alignItems: 'center'
    },
    cards: {
        margin: 5,
        width: 380,
        height: 200,
    },
    textType: {
        fontSize: 20,
        paddingTop: 28,
        paddingLeft: 20,
        marginRight: 'auto',
        color: 'white',
    },
    text: {
        fontSize: 18,
        paddingTop: 10,
        paddingLeft: 20,
        marginRight: 'auto',
        color: 'white',
    },
    textName: {
        fontSize: 18,
        paddingTop: 70,
        paddingLeft: 20,
        marginRight: 'auto',
        color: 'white',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modelContainer: {
        width: '80%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20
    },
    header: {
        width: '100%',
        height: 40,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    textCardPopup: {
        fontSize: 16,
        paddingTop: 25,
        paddingLeft: 20,
        marginRight: 'auto',
        color: 'white',
        marginBottom: 25,
    },
    textCardPopup2: {
        fontSize: 15,
        paddingTop: 10,
        paddingLeft: 20,
        marginRight: 'auto',
        color: 'white',
    },
})

export default CardViewScreen;
