# Project 2

Web Programming with Python and JavaScript

This is my implementation of Flack for CS50W where I designed my own chatting app. The objectives of this project are the following:
1. Learn to use JavaScript to run code server-side.
2. Become more comfortable with building web user interfaces.
3. Gain experience with Socket.IO to communicate between clients and servers.


The web app contains the following features:
1. A modal that appears if it is your first time entering the site and prompts you for a username that once submitted appear across all users in the Users tab.
2. On the right, there is another tab named Channels where you can navigate through all the created channels or create new ones.
3. Once you've chosen the channel you wish to enter, you can exchange messages and view up to 100 messages via socket.IO.

Apart from the required tasks for the project, my own personal touch were the following:
1. The Users tab where you can see who else is connected on the site.
2. The ability to delete one's own messages if they wish to do so.
3. The implementation of a different layout should the user connects via a mobile phone.

Running the web app:

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. In a terminal window, navigate into your project2 directory.
2. Run pip3 install -r requirements.txt in your terminal window to make sure that all of the necessary Python packages (Flask and Flask-Socket.IO, for instance) are installed.
3. To start up you Flask application simply run python application.py.

Built with:
1. Flask
2. Socket.IO
3. JavaScript
4. Bootstrap
5. Handlebars
