import React, { Component, createRef } from 'react';
import ReactNotification from 'react-notifications-component';

import * as BooksAPI from 'api/BooksAPI';
import * as BooksAPIUtils from 'utils/BooksAPIUtils';

import Loading from 'components/Loading';
import Routes from './Routes';
import './App.css';
import 'react-notifications-component/dist/theme.css';


class BooksApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myBooks: [],
      loading: true,
    };

    this.notificationDOMRef = createRef();
  }

  componentDidMount() {
    // Capturando todos os MEUS LIVROS da api
    BooksAPI.getAll().then((books) => {
      this.setState({
        myBooks: books,
        loading: false,
      });
    }).catch(err => console.error(err));
  }

  updateBook = (book, newShelf) => {
    // Atualizando shelf de um livro
    const { myBooks } = this.state;
    let newState = {};
    BooksAPI.update(book, newShelf).then((result) => {
      // Caso consiga atualizar
      let message = `Livro ${book.title} `;
      if (newShelf === 'none') {
        newState = BooksAPIUtils.delBook(book, myBooks);
        message += 'removido com sucesso!';
      } else if (BooksAPIUtils.checkMyBooksHaveChanged(result, myBooks) === true) {
        newState = BooksAPIUtils.addBook(book, newShelf, myBooks);
        message += 'adicionado com sucesso!';
      } else {
        newState = BooksAPIUtils.movBookShelf(book, newShelf, myBooks);
        message += 'movido com sucesso!';
      }
      this.setState({
        ...newState,
      });
      this.addNotification('Sucesso', message, 'success');
    });
  }

  addNotification = (title, message, type) => {
    this.notificationDOMRef.current.addNotification({
      title,
      message,
      type,
      insert: "bottom",
      container: "bottom-left",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  render() {
    const { myBooks, loading } = this.state;

    return (
      <Loading status={loading} className="loading center">
        <div className="app">
          <Routes myBooks={myBooks} updateBook={this.updateBook} />
          <ReactNotification ref={this.notificationDOMRef} />
        </div>
      </Loading>
    );
  }
}

export default BooksApp;
