import React, { Component } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Mock from "mockjs";
import request from "../../component/common/request";
import requestConfig from "../../component/common/config";
import Details from "./details";
import {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from "react-native";

let width = Dimensions.get('window').width;
let listCache = {
  currentPage: 0,
  recieveCount: 0,
  datas: []
};


class CreationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      row: this.props.row,
      up: this.props.row.up
    }
  }

  _up(row) {
    let that = this;
    let up = !this.state.up;
    let url = requestConfig.api.base + requestConfig.api.up;
    let body = {
      accessToken: 'abc',
      id: 'adfa'
    }
    request.post(url, body)
      .then((data) => {
        if (data && data.access) {
          that.setState({
            up: up
          });
        }
      });
  }

  render() {
    var row = this.state.row;
    return (<TouchableHighlight onPress={() => this.props.onSelect()}>
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{row.title}</Text>
        <Image
          source={{ uri: row.thumb }}
          style={styles.thumb}>
          <Icon name='ios-play' style={styles.play} />
        </Image>
        <View style={styles.itemFooter}>
          <View style={styles.handleBox} >
            <Icon
              name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
              style={[this.state.up ? styles.icoUp : styles.icoDown]}
              onPress={this._up.bind(this)}
            />
            <Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
          </View>
          <View style={styles.handleBox}>
            <Icon name='ios-heart-outline' style={styles.icoDown} />
            <Text style={styles.handleText}>评论</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>);
  }
}

export default class Creation extends Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dateSource: ds.cloneWithRows([]),
      totleCount: 0,
      isLoading: false,
      isRefresh: false
    }
  }

  _renderRow(row) {
    return (
      <CreationItem key={row.id} onSelect={() => { this._pageLoad(row) }} row={row} />
    )
  }

  _fetchData(pageNum) {
    var that = this;
    var data = request.get(requestConfig.api.base + requestConfig.api.creation,
      {
        accessToken: "abc",
        pageNum: pageNum
      })
      .then((data) => {
        if (data.access && data.data) {
          if (this.state.isLoading || listCache.currentPage == 0) {
            listCache.datas = listCache.datas.concat(data.data);
          }
          else if (this.state.isRefresh) {
            let items = data.data.concat(listCache.datas);
            listCache.datas = items;
            // var tmpData =[ {
            //   "_id": "530000199605048635",
            //   "thumb": "http://dummyimage.com/1280x720/f7bbe7)",
            //   "title": "Ivumvke Clqblcov Lmlr Aqo", "video": "afasdfdsf"
            // }];
            // listCache.datas = tmpData;
          }
          listCache.recieveCount += data.data.length;
          setTimeout(
            () => {
              // console.log(listCache.datas);
              that.setState({
                dateSource: that.state.dateSource.cloneWithRows(listCache.datas),
                totleCount: data.count
              });
              this.setState({
                isLoading: false,
                isRefresh: false
              });
            }
            , 0)
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          isRefresh: false
        });
        console.warn(error);
      })
  }

  componentDidMount() {
    this._fetchData(0);
  }

  _pageLoad(row) {
    this.props.navigator.push({
      name: 'details',
      component: Details,
      params: {
        row: row
      }
    });
  }

  _hasMore() {
    let hasMore = true;
    if (listCache.currentPage != 0) {
      hasMore = this.state.totleCount > listCache.recieveCount;
    }
    return hasMore;
  }

  _listEndReached() {
    if (this._hasMore() && !this.isLoading) {
      this.setState({
        isLoading: true
      });
      listCache.currentPage += 1;
      this._fetchData(listCache.currentPage);
    }
  }

  _renderFooter() {
    if (this._hasMore()) {
      return (
        <ActivityIndicator
          color="#fff"
          size="large"
        />)
    }
    else {
      return (
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>没有更多了</Text>
        </View>)
    }

  }

  _onRefresh() {
    if (this._hasMore() && !this.state.isRefresh) {
      this.setState({
        isRefresh: true
      })
      listCache.currentPage += 1;
      this._fetchData(listCache.currentPage);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dateSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          onEndReached={this._listEndReached.bind(this)}
          onEndReachedThreshold={20}
          renderFooter={this._renderFooter.bind(this)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  itemTitle: {
    fontSize: 18,
    padding: 10,
    color: '#333'
  },
  thumb: {
    width: width,
    height: width * 0.5,
    resizeMode: 'cover',
  },
  play: {
    position: 'absolute',
    fontSize: 28,
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 23,
    color: '#ed7b66'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.5 - 0.5,
    padding: 10
  },
  icoDown: {
    fontSize: 22,
    color: '#333'
  },
  icoUp: {
    fontSize: 22,
    color: '#ee735c'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  footerContent: {
    // marginVertical: 20
    marginTop: 20,
    marginBottom: 20
  },
  footerText: {
    color: '#777',
    textAlign: 'center'
  },
  itemLayout: {
    flex: 1,
    width: width / 3,
    height: width / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea'
  },
  grid: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})