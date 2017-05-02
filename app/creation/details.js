import React, { Component } from "react";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons"
import config from "../../component/common/config";
import request from "../../component//common/request";
import Button from 'react-native-button';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  ListView,
  TextInput,
  Modal,
  Alert
} from "react-native";



var width = Dimensions.get('window').width;

export default class Edit extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      // 数据
      data: this.props.row,
      dataSource: ds.cloneWithRows([]),

      // 视频
      videoReady: false,
      videodurationTime: 0,
      videoCurrentTime: 0,
      isPlaying: false,
      isPaused: false,

      // 弹出框
      modalVisible: false,
      replyContent: ''
    }
  }

  _backToList() {
    this.props.navigator.pop();
  }

  render() {
    let data = this.state.data;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>视频页面</Text>
          <Icon name='ios-arrow-back' style={styles.headerIcon} onPress={() => {
            this.props.navigator.pop();
          }} />
        </View>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            style={styles.videoPlayer}
            source={require("../asset/a10a3316a3e0edeaf495fb8d14dd6a05.mp4")} // 视频的URL地址，或者本地地址，都可以. 
            rate={1.0}                   // 控制暂停/播放，0 代表暂停paused, 1代表播放normal. 
            volume={5.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数 
            muted={false}                // true代表静音，默认为false. 
            paused={this.state.isPaused} // true代表暂停，默认为false 
            resizeMode="contain"         // 视频的自适应伸缩铺放行为，
            repeat={false}               // 是否重复播放 
            playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
            onLoad={() => this._onLoad()}
            onProgress={(videoData) => this._onProgress(videoData)}
            onEnd={() => this._onEnd()}
            onError={() => this._onError()}
            onPress={() => this._onPress()}
          />
          {
            !this.state.videoReady && <ActivityIndicator style={styles.loading} color='#fff' />
          }
          {
            (this.state.isPaused && !this.state.isPlaying)
              ? <Icon name='ios-play' style={styles.play} onPress={() => { this._replay() }} />
              : null
          }
          {
            this.state.videoReady ?
              <TouchableOpacity style={styles.pausedBtn} onPress={() => { this._ctrlPlay() }}>
                {(!this.state.isPlaying && !this.state.isPaused)
                  ? <Icon name='ios-play' style={styles.play} onpress={() => { this._ctrlPlay() }} />
                  : <Text></Text>}
              </TouchableOpacity>
              : null
          }
        </View>
        <View>
          <View style={styles.progressTotle}>
            <View style={[styles.progressCurrent, { width: width * this.state.videoPercent }]}></View>
          </View>
        </View>
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={(replyData) => this._renderRow(replyData)}
          enableEmptySections={true}
          renderHeader={() => { return this._renderHeader() }}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 280 }} />

        <Modal animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => { this._onRequestClose(false) }}>
          <View style={styles.modalBox}>
            <Icon name='ios-close' style={styles.modalIcon} onPress={() => { this._onRequestClose(false) }} />
            <TextInput
              style={styles.modalContent}
              underlineColorAndroid='transparent'
              placeholder='这个视频不错吧......'
              placeholderTextColor='#ccc'
              onChangeText={(text) => { this._onChangeText(text) }}
              multiline={true}>
            </TextInput>
            <Button 
              style={styles.modalBtn}
              title="1121"
              onPress={() => {
                this._sendReply();
              }}/>
          </View>
        </Modal>
      </View >
    )
  }

  _sendReply() {
    // Alert.alert(
    //   'Alert Title',
    //   'My Alert Msg',
    //   [
    //     { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
    //     { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false }
    // );
    let url = config.api.getReply
  }

  _renderHeader() {
    let data = this.state.data;
    return (
      <View style={styles.infoBox}>
        <View style={styles.authorBox}>
          <Image
            style={styles.authorAvatar}
            source={{ uri: data.author.avatar }}>
          </Image>
          <View style={styles.descBox}>
            <Text style={styles.authorNickname}>{data.author.nickname}</Text>
            <Text style={styles.authorTitle} numberOfLines={3}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.inputValue}>{'敢不敢评论一下.....'}</Text>
          <TextInput
            style={styles.inputContent}
            multiline={true}
            underlineColorAndroid='transparent'
            placeholder={'这个视频不错.....'}
            placeholderTextColor={'#ccc'}
            onFocus={() => this._onFocus()}>
            {this.state.modalContent}
          </TextInput>
        </View>
      </View>
    );
  }

  _onRequestClose(visible) {
    this.setState({
      modalVisible: visible,
      isPaused: !visible
    });
  }

  _onChangeText(text) {
    this.setState({
      modalContent: text
    });
  }

  _onFocus() {
    this._onRequestClose(true);
    // let listView = this.refs.listView;
    // listView.scrollTo({ y: 20, animated: true });
  }

  _fetchData(id) {
    var uri = config.api.base + config.api.getReply;
    var body = {
      accessToken: 333,
      id: id
    };
    request.post(uri, body)
      .then((response) => {
        if (response && response.access) {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(response.data)
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this._fetchData(this.state.data.id);
  }

  _renderRow(replyData) {
    return (
      <View style={styles.replyBox}>
        <View style={styles.replyerInfo}>
          <Image
            style={styles.replyAvatar}
            source={{ uri: replyData.replyer.avatar }}>
          </Image>
          <Text style={styles.replyNickname}>{replyData.replyer.nickname}</Text>
        </View>
        <Text style={styles.replyComment} numberOfLines={3}>{replyData.comment}</Text>
      </View>
    );
  }

  _onEndReached() {

  }

  _renderFooter() {

  }

  _ctrlPlay() {
    if (!this.state.isPaused) {
      this.setState({
        isPaused: true,
        isPlaying: false
      });
    }
    else {
      this.setState({
        isPaused: false,
        isPlaying: true
      });
    }
  }

  _replay() {
    if (this.state.videoPercent == 1) {
      this.setState({
        isPlaying: true,
        isPaused: false
      });
      this.refs.videoPlayer.seek(0);
    }
    else {
      this.refs.videoPlayer.seek(this.state.videoCurrentTime);
    }
  }

  _onPress() {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        isPaused: true
      })
    }
    else if (!this.state.isPlaying) {
      this.setStte({
        isPlaying: true,
        isPaused: false
      })
    }
  }

  _onLoad() {
    this.setState({
      videoReady: true,
      isPlaying: true
    });

  }

  _onProgress(data) {

    let videoPercent = Number((data.currentTime / data.playableDuration).toFixed(2));
    this.setState({
      videoDurationTime: data.playableDuration,
      videoCurrentTime: data.currentTime,
      videoPercent: videoPercent
    });
  }

  _onEnd() {
    this.setState({
      videoPercent: 1,
      isPlaying: false,
      isPaused: true
    });
  }

  _onError(err) {
    console.log("_onError:" + err);
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF'
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerText: {
    position: 'absolute',
    textAlign: 'center',
    width: width,
    fontSize: 16,
    color: '#fff',
    marginTop: 12
  },
  headerIcon: {
    color: '#fff',
    fontSize: 22,
    paddingLeft: 16,

  },
  loading: {
    position: 'absolute',
    width: width,
    alignSelf: 'center',
    marginTop: 100,
  },
  progressTotle: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },
  progressCurrent: {
    width: 0,
    height: 2,
    backgroundColor: '#ee735c'
  },
  play: {
    position: 'absolute',
    fontSize: 48,
    left: width / 2 - 25,
    height: 48,
    width: 48,
    top: 80,
    color: '#ed7b66',
    backgroundColor: 'transparent',
    paddingLeft: 16,
    paddingTop: 2,
    borderColor: '#fff',
    borderRadius: 23,
    borderWidth: 1
  },
  pausedBtn: {
    width: width,
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0
  },
  infoBox: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 10,
    width: width,
    marginLeft: 8,
    marginRight: 8
  },
  authorAvatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center'
  },
  descBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1
  },
  authorNickname: {
    fontSize: 18,
    color: '#000',
  },
  authorTitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },
  replyBox: {
    flexDirection: 'row',
    marginBottom: 10,
    borderColor: '#666',
  },
  replyerInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    marginLeft: 15,
    marginRight: 15
  },
  replyAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8
  },
  replyNickname: {
    fontSize: 16,
    color: '#666',

  },
  replyComment: {
    flex: 3,
    fontSize: 16,
    color: '#666'
  },
  inputBox: {
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 8,
    justifyContent: 'flex-start'
  },
  inputValue: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8
  },
  inputContent: {
    height: 80,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    textAlignVertical: 'top',
    marginRight: 8,
    width: width - 16
  },
  authorBox: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  videoPlayer: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  modalBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  modalIcon: {
    alignSelf: 'flex-end',
    marginRight: 15,
    fontSize: 24,
    color: '#ee735c',
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ee735c',
    marginLeft: 8
  },
  modalContent: {
    width: width - 16,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    height: 80,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#666',
    textAlignVertical: 'top'
  },
  modalBtn: {
    width:width-16,
    height:40,
    margin: 8,
    borderColor: '#ee735c',
    backgroundColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center'
  }
});

