(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{25:function(e,t,n){e.exports=n(45)},30:function(e,t,n){},32:function(e,t,n){e.exports=n.p+"static/media/logo.25bf045c.svg"},33:function(e,t,n){},45:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(8),s=n.n(o),i=(n(30),n(31),n(32),n(33),n(17)),c=n(18),l=n(19),u=n(23),h=n(20),m=n(24),d=n(51),p=n(48),g=n(49),f=n(52),v=n(50),b=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).state={email:"",pw:"",isRegister:!1,registerText:"I need to create an account",header:"Log in",loggedIn:!1,error:""},n.handleSignInText=function(){var e=!n.state.isRegister,t=e?"I already have an account":"I need to create an account",a=e?"Sign up":"Log in";n.setState({isRegister:e,registerText:t,header:a})},n.handleChange=function(e){e.preventDefault(),n.setState(Object(i.a)({},e.target.id,e.target.value))},n.handleSubmit=function(e){if(e.preventDefault(),n.validateForm()){var t=JSON.stringify({email:n.state.email,pw:n.state.pw}),a="http://honker.cse356.compas.cs.stonybrook.edu/"+(n.state.isRegister?"/create_user":"/login");fetch(a,{method:"POST",body:t,headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){console.log(e.success+"\n"+e.message),e.success?(n.props.onLogin(n.state.email),n.state.isRegister?n.props.history.push("/user/account/type"):n._isMounted&&!n.state.isRegister&&n.setState({loggedIn:!0})):!e.success&&n._isMounted&&n.setState({error:e.message})})).catch((function(e){return console.error(e)}))}},n._isMounted=!1,n}return Object(m.a)(t,e),Object(l.a)(t,[{key:"componentWillUnmount",value:function(){this._isMounted=!1}},{key:"componentDidMount",value:function(){this._isMounted=!0}},{key:"render",value:function(){var e;return this.state.error.length>0&&(e=r.a.createElement(d.a,{variant:"danger"},this.state.error)),r.a.createElement(p.a,null,e,r.a.createElement("h1",{className:"mb-3"},this.state.header),r.a.createElement(g.a,{className:"justify-content-md-center"},r.a.createElement(f.a,{onSubmit:this.handleSubmit},r.a.createElement(f.a.Group,{controlId:"email"},r.a.createElement(f.a.Label,null,"Email address"),r.a.createElement(f.a.Control,{type:"email",placeholder:"Enter email",onChange:this.handleChange})),r.a.createElement(f.a.Group,{controlId:"pw"},r.a.createElement(f.a.Label,null,"Password"),r.a.createElement(f.a.Control,{type:"password",placeholder:"Password",onChange:this.handleChange})),r.a.createElement(v.a,{variant:"primary",type:"submit"},"Submit"),r.a.createElement("div",{onClick:this.handleSignInText,className:"m-2",style:{cursor:"pointer"}},this.state.registerText))))}},{key:"validateForm",value:function(){var e=!0;return 0===this.state.email.length&&(e=!1),0===this.state.pw.length&&(e=!1),e}}]),t}(a.Component);var y=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(b,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(y,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[25,1,2]]]);
//# sourceMappingURL=main.a90e9980.chunk.js.map