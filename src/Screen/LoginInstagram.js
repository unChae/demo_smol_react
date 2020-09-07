import React from 'react';
import * as config from '../config';

class LoginInstagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect_uri: config.REDIRECT_URI,
      client_id: config.CLIENT_ID,
    }
  }

  render() {
    let {redirect_uri, client_id} = this.state;
    let url = "https://api.instagram.com/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=user_profile,user_media&response_type=code";
    return (
      <div className="LoginInstagram">
        <a href={url}>Login</a><br/>
      </div>
    );
  }
}

export default LoginInstagram;
