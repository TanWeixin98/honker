import React, {Component} from  'react';
import {Form, Button} from 'react-bootstrap';

class ById extends Component{
  
  state = {
          id:""
  }

  render() {
    return(
      <div className = 'container'>
        <Form>
          <Form.Group controlId="id">
            <Form.Control type="text" placeholder="ID" onChange = {this.handleChange}/>
            <Button onClick={this.handleDelete}>Delete</Button>
            <Button onClick={this.handleSearch}>Search</Button>
          </Form.Group>
        </Form>
      </div>
    ); 
  }

  handleChange = e =>{
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }
  
  handleSearch = e =>{
    e.preventDefault();
    const url = "http://honker.cse356.compas.cs.stonybrook.edu/item/"+this.state.id
    fetch(url, {
      method: "GET"
    })
      .then(res => res.json())
      .then(response => {
        if(response.status === "OK"){
          this.props.history.push({
             pathname: '/tweets',  
             state: { tweets: [response.item] }
          });
        }else{
          alert(response.error);
        }        
      })
  }



  handleDelete = e =>{
    e.preventDefault();
    const url = "http://honker.cse356.compas.cs.stonybrook.edu/item/" + this.state.id;
    fetch(url, {
      method: "DELETE",
    })
      .then( res => res.json())
      .then(response => {
         console.log(response)
         if(response.statusCode===200){
            alert("Deleted");
         }else{
            alert("Failed to Delete");
         }
      });
  }

}


export default ById;
