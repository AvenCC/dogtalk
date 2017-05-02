import React, { Component } from "react";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons"
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";



var width = Dimensions.get('window').width;

export default class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.row,
      videoReady: false,
      videodurationTime: 0,
      videoCurrentTime: 0,
      isPlaying: false,
      isPaused: false
    }
  }

  _backToList() {
    this.props.navigator.pop();
  }

  render() {
    var videoUrl = "../asset/a10a3316a3e0edeaf495fb8d14dd6a05.mp4";
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>视频页面</Text>
          <Icon name='ios-arrow-back' style={styles.headerIcon} onPress={() => {
            this.props.navigator.pop();
          }} />
        </View>
        <View style={{ width: width, height: 360, backgroundColor: '#000' }}>
          <Video
            ref='videoPlayer'
            style={{ width: width, height: 360, backgroundColor: '#000' }}
            source={require("../asset/a10a3316a3e0edeaf495fb8d14dd6a05.mp4")} // 视频的URL地址，或者本地地址，都可以. 
            rate={1.0}                   // 控制暂停/播放，0 代表暂停paused, 1代表播放normal. 
            volume={5.0}                 // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数 
            muted={false}                // true代表静音，默认为false. 
            paused={this.state.isPaused} // true代表暂停，默认为false 
            resizeMode="contain"         // 视频的自适应伸缩铺放行为，
            repeat={false}               // 是否重复播放 
            playInBackground={false}     // 当app转到后台运行的时候，播放是否暂停
            onLoadStart={() => this._onLoadStart()}
            onLoad={() => this._onLoad()}
            onProgress={(data) => this._onProgress(data)}
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
      </View>
    )
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

  _onLoadStart() {
    // console.log("_onLoadStart");
  }

  _onLoad() {
    this.setState({
      videoReady: true,
      isPlaying: true
    });
    // console.log("_onLoad");
  }

  _onProgress(data) {

    let videoPercent = Number((data.currentTime / data.playableDuration).toFixed(2));
    this.setState({
      videoDurationTime: data.playableDuration,
      videoCurrentTime: data.currentTime,
      videoPercent: videoPercent
    });
    // console.log("_onProgress:" + data);
  }

  _onEnd() {
    this.setState({
      videoPercent: 1,
      isPlaying: false,
      isPaused: true
    });
    // console.log("_onEnd");
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
    top: 120,
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
    height: 360,
    position: 'absolute',
    top: 0,
    left: 0
  }
})

