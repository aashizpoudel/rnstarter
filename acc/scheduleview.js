import React, { Component } from 'react';
import { Container, Header, Content, Text,Card,CardItem,Body,Left,Right,Title,StyleProvider } from 'native-base';
import {FlatList} from 'react-native';
import firebase from 'react-native-firebase';
import getTheme from './../native-base-theme/components'; 
import material from './../native-base-theme/variables/commonColor';

export default class ScheduleView extends Component {

  constructor(props){
    super(props);
    this.ref = firebase.firestore().collection('schedules').
    where("department","==",this.props.department).
    where("day","==",this.props.day).where("year","==",this.props.year);
    this.state = { 
        loading:true,
        schedules:[],
    };
    this.unsubscribe = null;
  }

componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate) 
}

componentWillUnmount() {
    this.unsubscribe();
}

onCollectionUpdate = (querySnapshot) => {
    const todos = [];
    querySnapshot.forEach((doc) => {
    const {subject, from,to } = doc.data();
    todos.push({
      key:doc.id,
     subject,from,to
      });
    });
  this.setState({ 
    schedules:todos,
    loading: false,
 });
}

  renderItem(item){
    
    return    <Card>
        <CardItem>
          <Body>
            <Text>{item.from} {item.to} {item.subject} </Text> 
          </Body>
        </CardItem>
    </Card>;
  }


  render() {
    return (
    <StyleProvider  style={getTheme(material)}>
        <Content>
        <Card>
        <Text>{this.props.day}</Text>

          <FlatList
            data={this.state.schedules}
              renderItem={({item}) => this.renderItem(item)}
         / >
         </Card>
        </Content>
    </StyleProvider>
    );
  }
}