/* eslint-disable no-nested-ternary */
import {
  useEffect, useState, useMemo, useCallback,
} from 'react';

import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import ContactsService from '../../services/ContactsService';

import arrow from '../../assets/images/icons/arrow.svg';
import edit from '../../assets/images/icons/edit.svg';
import trash from '../../assets/images/icons/trash.svg';
import sad from '../../assets/images/sad.svg';
import emptyBox from '../../assets/images/empty-box.svg';

import Loader from '../../components/Loader';

import {
  Container,
  Header,
  ListHeader,
  Card,
  InputSearchContainer,
  ErrorContainer,
  EmptyListContainer,
} from './styles';

export default function Home() {
  const [contacts, setContacts] = useState([]);
  const [orderBy, setOrderBy] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter((contact) => (
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )), [searchTerm, contacts]);

  const loadContacts = useCallback(
    async () => {
      try {
        setIsLoading(true);

        const contactsList = await ContactsService.listContacts(orderBy);

        setHasError(false);
        setContacts(contactsList);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [orderBy],
  );

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  function handleToggleOrdeyBy() {
    setOrderBy((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
  }

  function handleChangeSearchTerm(event) {
    setSearchTerm(event.target.value);
  }

  function handleTryAgain() {
    loadContacts();
  }

  return (
    <Container>
      <Loader isLoading={isLoading} />
      {contacts.length > 0 && (
      <InputSearchContainer>
        <input type="text" onChange={handleChangeSearchTerm} placeholder="pesquise pelo nome" />
      </InputSearchContainer>

      )}
      <Header
        justifyContent={
          hasError
            ? 'flex-end'
            : (
              contacts.length > 0
                ? 'space-between'
                : 'center'
            )
}
      >
        {!hasError && contacts.length > 0 && (
          <strong>
            {filteredContacts.length}
            {' '}
            {filteredContacts.length === 1 ? 'contatos' : 'contato'}
          </strong>
        )}
        <Link to="/new">Novo contato</Link>
      </Header>

      {(hasError) && (
        <ErrorContainer>
          <img src={sad} alt="sad" />
          <div className="details">
            <strong>Ocorreu um texto ao obter seus contatos</strong>
            <Button type="button" onClick={handleTryAgain}>Tentar novamente</Button>
          </div>
        </ErrorContainer>
      )}

      {!hasError && (
      <>
        {contacts.length < 1 && !isLoading && (
          <EmptyListContainer>
            <img src={emptyBox} alt="Empty box" />

            <p>
              Você ainda não tem nenhum contato cadastrado!
              Clique no botão
              {' '}
              <strong>”Novo contato”</strong>
              {' '}
              à cima para cadastrar o seu primeiro!

            </p>
          </EmptyListContainer>
        )}
        {filteredContacts.length > 0 && (
        <ListHeader orderBy={orderBy}>
          <button type="button" onClick={handleToggleOrdeyBy}>
            <span>Nome</span>
            <img src={arrow} alt="Arrow icon" />
          </button>
        </ListHeader>
        )}

        {filteredContacts.map((contact) => (
          <Card key={contact.id}>
            <div className="info">
              <div className="contact-name">
                <strong>{contact.name}</strong>
                {contact.category_name && (
                <small>{contact.category_name}</small>
                )}
              </div>
              <span>{contact.email}</span>
              <span>{contact.phone}</span>
            </div>

            <div className="actions">
              <Link to={`/edit/${contact.id}`}>
                <img src={edit} alt="Edit" />
              </Link>
              <button type="button">
                <img src={trash} alt="Delete icon" />
              </button>
            </div>
          </Card>

        ))}
      </>
      )}

    </Container>
  );
}
