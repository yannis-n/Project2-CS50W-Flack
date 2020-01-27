	const template = Handlebars.compile(document.querySelector('#channel_message').innerHTML);
	const template_movement = Handlebars.compile(document.querySelector('#movement').innerHTML);
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);// var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
	var counter = 0;
	const limit = 100;

	function load_page(channel){
	  const request = new XMLHttpRequest();

		socket.emit('leave',{'username':localStorage.getItem('username'),'room':localStorage.getItem('channel')});
		socket.emit('join',{'username':localStorage.getItem('username'),'room':channel});

	  request.open('POST', `/${channel}`);
	  request.onload = () => {

	    const response = JSON.parse(request.responseText);



	    const content = template({'values': response});
			counter = response.length;
	    document.querySelector('.messages').innerHTML = content;
			document.querySelector('.channel_space').innerHTML = 'Channel Name: ' + channel;

	    document.title=`Flack ${channel}`;
			localStorage.setItem('channel',channel);
			check_message();
			gotoBottom(".container-fluid");




	  };
	  request.send();



	}

	function load_tab(tab){
		document.querySelector('#users').style.display='none';
		document.querySelector('#channels').style.display='none';
		document.querySelector(`#${tab}`).style.display='block';

		localStorage.setItem('tab',tab);
	}

	window.onpopstate = e => {
	    const data = e.state;

			load_page(data.title);
			// socket.emit('leave',{'username':localStorage.getItem('username'),'room':localStorage.getItem('channel')});
			// socket.emit('join',{'username':localStorage.getItem('username'),'room':data.title});
			//
	    // document.title =`Flack ${data.title}`;
	    // localStorage.setItem('channel', data.title);
			//
	    // const content = template({'values': data.messages});
	    // document.querySelector('.messages').innerHTML = content;
			// document.querySelector('.channel_space').innerHTML = 'Channel Name: ' + data.title;
			// check_message();
	};

	function active_links(){
		document.querySelectorAll('.channel').forEach(link => {
			link.onclick = () => {
				load_page(link.dataset.page);
				history.pushState({'title':link.dataset.page,}, link.dataset.page, link.dataset.page);
				return false;
			};
		});
	}

	function active_tabs(){

		document.querySelectorAll('.tab').forEach(tab => {
			tab.onclick = () =>{
				load_tab(tab.dataset.tab)
				return false;
			};
		});
	}

	function gotoBottom(id){
		let element = document.querySelector(id);
		element.scrollTop = element.scrollHeight - element.clientHeight;
	}

	function check_message(){

		document.querySelectorAll(".delete_message").forEach(button => {

			if (button.dataset.messenger === localStorage.getItem('username')){
				button.style.display = "block";
			};
		});
	}






document.addEventListener('DOMContentLoaded', function(){





	socket.on("connect",function(){

			if (!localStorage.getItem('channel')){
				load_page("General");
			}else{
					load_page(localStorage.getItem('channel'));
			}
			history.pushState({'title':localStorage.getItem('channel'),}, localStorage.getItem('channel'), localStorage.getItem('channel'));



			document.getElementById('close_nav').onclick = function(){

				document.getElementById('navigation_bar').style.width = 0;
				document.querySelector('.container-fluid').style.width = '100%';
				document.querySelector('.Channel_info').style.display = 'block';
				document.querySelector('.message-input').style.width = '100%';

			}

			document.querySelector('.menu').onclick = function (){
				document.getElementById('navigation_bar').style.width = '100%';
				document.querySelector('.container-fluid').style.width = 0;
				document.querySelector('.Channel_info').style.display = 'none';
				document.querySelector('.message-input').style.width = 0;

			}

		if (!localStorage.getItem('username')){
			var authenticated_user = false;
	    $('#modal_user').modal('show');

			document.querySelector('#username_input').addEventListener("click",function(){
				document.querySelectorAll('.error_message').forEach(error => {
		      error.style.display = "none";
		    });
			});

			document.querySelector('#submit_username').addEventListener("click", function(){
				 var user = document.querySelector('#username_input').value;
				 if ( typeof user === 'undefined' || !user){
					document.getElementById('no_username').style.display="block";
				}else{

					const request = new XMLHttpRequest();
					request.open('POST','/check');

					request.onload = () =>{
						const data = JSON.parse(request.responseText);
						if (data.taken){
							document.getElementById('taken_username').style.display="block";
						}else{
							localStorage.setItem('username',user);

							$('#modal_user').modal('hide');
							document.querySelector('#info').innerHTML = 'Welcome, ' + localStorage.getItem('username');
				
							socket.emit("add_user",{'username': localStorage.getItem('username')});



						}
					}

					const data = new FormData();
					data.append('username_input', user);

					request.send(data);
					return false;

				}
			});
	  } else {
	        document.querySelector('#info').innerHTML = 'Welcome, ' + localStorage.getItem('username');

	  }

		active_links();

		document.querySelector('#users').style.display='none';

		active_tabs();

		document.getElementById("channel_name").onclick = function(){
			document.getElementById('channel_name').value = " ";
			document.getElementById('channel_name').style.color = "black";
		}

		document.getElementById("create_channel1").onclick = function(){

	    const channel_name = document.getElementById("channel_name").value;

			const request = new XMLHttpRequest();
			request.open('POST','/check_channel_name');

			request.onload = () =>{
				const data = JSON.parse(request.responseText);
				if (data.taken){
					document.getElementById('channel_name').value = "The channel name is used!";
					document.getElementById('channel_name').style.color = "red";
				}else{

					socket.emit("create_channel",{'channel_name': channel_name});
				}
			}

			const data = new FormData();
			data.append('channel_name', channel_name);

			request.send(data);
			return false;

	  };

		var messagesParent = document.querySelector('.messages');

		messagesParent.addEventListener('click', function(e){
			if (e.target.dataset.id){
				channel_name = localStorage.getItem('channel');
				id = e.target.dataset.id;

				socket.emit("delete_message",{'channel_name': channel_name, 'id':id});
			}

		});

		document.getElementById('message_content').onkeydown = function(e){
			if (e.keyCode == 13 && !e.shiftKey){
     		document.getElementById('submit_message').click();
   		}
			if (e.keyCode == 13 && e.shiftKey){
     		this.appendChild(document.createElement('br'));
   		}

		};


		document.getElementById("submit_message").onclick = function(){

	    const message = document.getElementById("message_content").value;
	    var currentdate = new Date();
	    var datetime = "Last Sync: " + currentdate.getDate() + "/"
	          + (currentdate.getMonth()+1)  + "/"
	          + currentdate.getFullYear() + " @ "
	          + currentdate.getHours() + ":"
	          + currentdate.getMinutes() + ":"
	          + currentdate.getSeconds();
	    socket.emit("submit_message",{'channel_name':localStorage.getItem('channel'),'message': message,
	                                'messenger':localStorage.getItem('username'),
	                                'timestamp':datetime});
	  };

	});

	socket.on('user_list', data => {
		const a = document.createElement('a');
		a.innerHTML = data.user;
		a.classList.add("nav-link");
		a.href = "#";
		a.dataset.page = data.user;
		document.getElementById('users').append(a);
		active_tabs();
		active_links();

	});

	socket.on('channelsList', data => {
		const a = document.createElement('a');
		a.innerHTML = data.new_channel;
		a.classList.add('channel');
		a.classList.add('nav-link');
		a.href = "#";
		a.dataset.page = data.new_channel;
		document.getElementById('channels').append(a);
		active_tabs();
		active_links();

	});

	socket.on('add_message', data => {
		const content = template({'values': data.messages});
		document.querySelector('.messages').innerHTML += content;
		counter += 1;
		if (counter >= (limit + 1) ){
			message = document.querySelector('.message');
			document.querySelector('.messages').removeChild(message);

		}
		gotoBottom(".container-fluid");
		check_message();


	});



	socket.on('joined', data => {
		const content = template_movement({'username': data.username, 'action':'joined'});
		document.querySelector('.messages').innerHTML += content;
		// load_page(localStorage.getItem('channel'));
		gotoBottom(".container-fluid");

	});

	socket.on('left', data => {
		const content = template_movement({'username': data.username, 'action':'left'});
		document.querySelector('.messages').innerHTML += content;
		// load_page(localStorage.getItem('channel'));
		gotoBottom(".container-fluid");

	});

	socket.on('deleted_message', data => {

		document.querySelectorAll('.delete_message').forEach(button => {
			if (button.dataset.id === data.id){
				button.parentElement.innerHTML = 'deleted';
				counter -=1;
			}
		});
	});


});
