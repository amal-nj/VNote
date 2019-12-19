import React, { Component } from "react";
import { Text, View, AsyncStorage, Image, Alert } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import store from "../redux/store";
import {setFilteredPosts } from "../redux/actions";

export default class NotificationsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      token: ""
    };
  }
 
 
  render() {
    return (
      <Card style={{marginVertical:10}}>
        <Card.Content>
        <Text style={{fontSize:20}}>{`@${this.props.post.sender.username}`}</Text>
          <Paragraph  style={{ textAlign: "right", alignSelf: "stretch" }}>{this.props.post.body}</Paragraph>
          <Text style={{fontSize:10, color:'grey'}}>{this.props.post.updatedAt.split("T")[0]}</Text>

        </Card.Content>
       
      </Card> 
    );
  }
}
