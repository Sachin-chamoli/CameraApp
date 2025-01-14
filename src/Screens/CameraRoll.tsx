import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import { useNavigation } from '@react-navigation/native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import GestureRecognizer from 'react-native-swipe-gestures';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

const CameraRollScreen = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [photos, setPhotos] = useState<any>([]);
  const Nav = useNavigation<any>()
  const [showPhoto, setShowPhoto] = useState<string|null>(null);

  useEffect(() => {
    requestPermission();

    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        console.log('gallery', r.edges);
        setPhotos(r.edges);
      })
      .catch(err => {
        //Error Loading Images
      });
  }, [device]);

  const TakePhoto = async () => {
    const photo = await camera.current.takePhoto();
    let res = await CameraRoll.save(`file://${photo.path}`, {
        type: 'photo',
      })

      if(res){
        setPhotos(prev => {
            return [
                {
                    node :{
                        image : { uri : res}
                    }
                },
                ...photos
            ]
          })
      }

  };

  
  const previewMedia = (media : string) => {
    setShowPhoto(media);
  };

  const closePreview = () => {
    setShowPhoto(null);
  };

  const renderThumbnail = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {previewMedia(item.node.image.uri)}}
        style={{width: responsiveWidth(30), height: responsiveWidth(30) , marginHorizontal : responsiveWidth(1.6)}}>
        <Image
          source={{uri: item.node.image.uri}}
          resizeMode='cover'
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    );
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };


  const swipeFunction = (state : any , direction : string) =>{
    console.log("state" , state , direction)
    if(direction == 'SWIPE_RIGHT'){
      Nav.navigate('Home')
    }
  }

  if (!hasPermission)
    return (
      <View style={{flex : 1 , alignItems : 'center' , justifyContent : 'center'}}>
        <TouchableOpacity onPress={() => requestPermission()} style={{ height : responsiveWidth(8) , justifyContent : 'center', alignItems : 'center'}}>
          <Text style={{fontSize : responsiveFontSize(2)}}>Allow Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  return (
    <GestureRecognizer
    onSwipe={(direction, state) => {swipeFunction(state , direction)}}
    config={config}
    style={{
      flex: 1,
    }}
    >
 {/* <Text>hiii</Text> */}
 <View style={styles.header}>
        <TouchableOpacity onPress={() => Nav.goBack()} style={{width : responsiveWidth(8) , height : responsiveWidth(8) , justifyContent : 'center', alignItems : 'center'}}>
          <AntDesign name={'left'} color={'black'} size={responsiveFontSize(3)}/>
        </TouchableOpacity>
        <Text style={{fontSize : responsiveFontSize(2.5)}}>Camera Roll</Text>
        <TouchableOpacity>
          <Entypo name='dots-three-horizontal' size={responsiveFontSize(3)} color={'black'}/>
        </TouchableOpacity>
      </View>

<View style={{height: '60%', alignItems: 'center', borderWidth:1 , position : 'relative'}}>
        {device && (
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
        )}
        <TouchableOpacity
          onPress={TakePhoto}
          style={{
            borderWidth: 6,
            borderColor: 'white',
            width:responsiveWidth(17) ,
            height: responsiveWidth(17) ,
            borderRadius: 50,
            position: 'absolute',
            bottom: 20,
          }}></TouchableOpacity>
      </View>
   
      <View style={{ marginVertical : responsiveWidth(7) , flex : 1}}>
        <Text style={{fontSize : responsiveFontSize(2) , alignSelf  :'center'}}>Gallery</Text>
        <FlatList
          data={photos || []}
          renderItem={renderThumbnail}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={{marginVertical: responsiveWidth(3) , paddingLeft : responsiveWidth(2)}}
        />
      </View>

     
         


      <Modal visible={showPhoto != null} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closePreview}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          {showPhoto && (
            <Image source={{ uri: showPhoto }} style={styles.fullScreenImage} />
          )}
          <View style={{ flexDirection : 'row' , width : '100%' ,  justifyContent : 'space-evenly' , paddingTop : responsiveWidth(2)}}>
            <Text style={styles.actionBtns}>Edit</Text>
            <Text  style={styles.actionBtns}>Delete</Text>
            <Text  style={styles.actionBtns}>Share</Text>
          </View>
        </View>
      </Modal>
</GestureRecognizer>



  );
};

const styles = StyleSheet.create({
    actionBtns : {
        borderWidth : 1 , backgroundColor : 'lightgray' , paddingVertical : responsiveWidth(1) , paddingHorizontal : responsiveWidth(3) , fontSize : responsiveFontSize(1.7) , borderRadius : 10 , fontWeight : '600'
    },
    header: {
        height: '7%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
      },

      modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical : responsiveWidth(8)
      },
      closeButton: {
        marginHorizontal : responsiveWidth(3),
        width : responsiveWidth(10),
        height : responsiveHeight(5),
        alignItems : 'center',
        justifyContent : 'center',
        alignSelf : 'flex-end'
      },
      closeText: {
        color: 'white',
        fontSize: responsiveFontSize(4),
      },

      fullScreenImage: {
        width: '100%',
        height: responsiveHeight(85),
        resizeMode: 'contain',
      },
})
export default CameraRollScreen;
